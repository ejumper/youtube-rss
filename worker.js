const FEED_CONFIGS = {
  // Add additional YouTube feeds here. Each key becomes the worker path segment.
  'cpscott16': {
    channelId: 'UCO1ydt_TOAZfwEgJpgOx2jQ',
    handle: 'CPScott16'
  }
};

const DEFAULT_CONFIG = {
  cacheDuration: 300,
  sourceCacheTTLMin: 3 * 3600,
  sourceCacheTTLMax: 3 * 3600
};

const PROVIDER_PRIORITY = [
  { type: 'invidious', host: 'https://inv.nadeko.net', mode: 'embed', key: 'inv-nadeko-embed' },
  { type: 'invidious', host: 'https://yewtu.be', mode: 'embed', key: 'yewtu-embed' },
  { type: 'invidious', host: 'https://invidious.f5.si', mode: 'embed', key: 'f5si-embed' },
  { type: 'youtube', host: 'https://www.youtube.com', mode: 'embed', key: 'youtube-embed' },
  { type: 'invidious', host: 'https://inv.nadeko.net', mode: 'page', key: 'inv-nadeko-page' },
  { type: 'invidious', host: 'https://yewtu.be', mode: 'page', key: 'yewtu-page' },
  { type: 'invidious', host: 'https://invidious.f5.si', mode: 'page', key: 'f5si-page' },
  { type: 'youtube', host: 'https://www.youtube.com', mode: 'page', key: 'youtube-page' }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const feedKey = pathSegments[0]?.toLowerCase();

    let feedConfig;

    if (feedKey && FEED_CONFIGS[feedKey]) {
      feedConfig = {
        ...DEFAULT_CONFIG,
        ...FEED_CONFIGS[feedKey],
        cacheKey: `feed_${feedKey}`
      };
      feedConfig.url = resolveYouTubeFeedUrl(feedConfig);
    } else {
      const feedUrl = url.searchParams.get('feed');
      if (!feedUrl) {
        return createErrorResponse(
          'Usage:\n' +
          '1. Predefined feeds: https://your-worker.dev/feedname\n' +
          '2. Dynamic feeds: https://your-worker.dev/?feed=RSS_URL',
          400
        );
      }

      feedConfig = {
        ...DEFAULT_CONFIG,
        url: feedUrl,
        cacheKey: `feed_${hashString(feedUrl)}`
      };
    }

    try {
      const processedFeed = await processFeed(feedConfig, env);
      const rewrittenFeed = rewriteFeedSelfLink(processedFeed, url.toString());

      return new Response(rewrittenFeed, {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Access-Control-Allow-Origin': '*',
          'X-Feed-Source': feedConfig.url,
          'X-Feed-Processed': new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Feed processing error:', error);
      return createErrorResponse(`Error processing feed: ${error.message}`, 500);
    }
  }
};

async function processFeed(config, env) {
  const cacheKey = `source_${config.cacheKey}`;
  let feedXml = null;

  if (env.YOUTUBE_FEED_CACHE) {
    try {
      const cached = await env.YOUTUBE_FEED_CACHE.get(cacheKey, { type: 'json' });
      if (cached && cached.content && cached.timestamp) {
        const cacheAge = Date.now() - cached.timestamp;
        if (cacheAge < config.sourceCacheTTLMax * 1000) {
          feedXml = cached.content;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
  }

  if (!feedXml) {
    if (!config.url) {
      throw new Error('Feed URL is not configured.');
    }

    const response = await fetch(config.url, {
      headers: {
        'User-Agent': 'YouTube-RSS-Embed-Worker/1.0 (Polite 3h cache)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    feedXml = await response.text();

    if (env.YOUTUBE_FEED_CACHE) {
      const ttl = Math.floor(
        Math.random() * (config.sourceCacheTTLMax - config.sourceCacheTTLMin) + config.sourceCacheTTLMin
      );

      try {
        await env.YOUTUBE_FEED_CACHE.put(cacheKey, JSON.stringify({
          content: feedXml,
          timestamp: Date.now()
        }), {
          expirationTtl: ttl
        });
      } catch (error) {
        console.error('Error caching source feed:', error);
      }
    }
  }

  const providerCache = new Map();
  const isAtom = feedXml.includes('<feed') && feedXml.includes('xmlns="http://www.w3.org/2005/Atom"');
  return isAtom ? await processAtomFeed(feedXml, providerCache) : await processRssFeed(feedXml, providerCache);
}

async function processRssFeed(xmlString, providerCache) {
  const itemRegex = /<item\b[^>]*>[\s\S]*?<\/item>/gi;
  const matches = [...xmlString.matchAll(itemRegex)];
  if (matches.length === 0) return xmlString;

  let result = '';
  let lastIndex = 0;
  for (const match of matches) {
    const { index } = match;
    const fullItem = match[0];
    result += xmlString.slice(lastIndex, index);
    const rewritten = await rewriteRssItem(fullItem, providerCache);
    result += rewritten;
    lastIndex = index + fullItem.length;
  }
  result += xmlString.slice(lastIndex);
  return result;
}

async function processAtomFeed(xmlString, providerCache) {
  const entryRegex = /<entry\b[^>]*>[\s\S]*?<\/entry>/gi;
  const matches = [...xmlString.matchAll(entryRegex)];
  if (matches.length === 0) return xmlString;

  let result = '';
  let lastIndex = 0;
  for (const match of matches) {
    const { index } = match;
    const fullEntry = match[0];
    result += xmlString.slice(lastIndex, index);
    const rewritten = await rewriteAtomEntry(fullEntry, providerCache);
    result += rewritten;
    lastIndex = index + fullEntry.length;
  }
  result += xmlString.slice(lastIndex);
  return result;
}

async function rewriteRssItem(itemXml, providerCache) {
  const videoId = extractVideoIdFromContent(itemXml);
  if (!videoId) return itemXml;

  const preferredUrl = await getPreferredVideoUrl(videoId, providerCache);
  let updated = itemXml;
  updated = rewriteTextTag(updated, 'link', preferredUrl);
  updated = rewriteTextTag(updated, 'guid', preferredUrl);
  updated = rewriteMediaContentUrls(updated, preferredUrl);
  return updated;
}

async function rewriteAtomEntry(entryXml, providerCache) {
  const videoId = extractVideoIdFromContent(entryXml);
  if (!videoId) return entryXml;

  const preferredUrl = await getPreferredVideoUrl(videoId, providerCache);
  let updated = entryXml;
  updated = rewriteLinkAttributes(updated, preferredUrl);
  updated = rewriteTextTag(updated, 'id', preferredUrl);
  updated = rewriteMediaContentUrls(updated, preferredUrl);
  return updated;
}

function rewriteTextTag(xmlFragment, tagName, newUrl) {
  if (!newUrl) return xmlFragment;
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const escaped = escapeXmlText(newUrl);
  return xmlFragment.replace(regex, (match, inner) => match.replace(inner, escaped));
}

function rewriteLinkAttributes(xmlFragment, newUrl) {
  if (!newUrl) return xmlFragment;
  const regex = /<link\b([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi;
  const escaped = escapeXmlAttribute(newUrl);
  return xmlFragment.replace(regex, (match, _prefix, url) => match.replace(url, escaped));
}

function rewriteMediaContentUrls(xmlFragment, newUrl) {
  if (!newUrl) return xmlFragment;
  const regex = /(<media:content\b[^>]*url=["'])([^"']+)(["'][^>]*>)/gi;
  const escaped = escapeXmlAttribute(newUrl);
  return xmlFragment.replace(regex, (match, prefix, _url, suffix) => `${prefix}${escaped}${suffix}`);
}

async function getPreferredVideoUrl(videoId, providerCache) {
  for (const provider of PROVIDER_PRIORITY) {
    const cacheKey = provider.key;
    let status = providerCache.get(cacheKey);
    if (status === undefined) {
      status = await isProviderReachable(provider, videoId);
      providerCache.set(cacheKey, status);
    }
    if (status) {
      return buildProviderUrl(provider, videoId);
    }
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
}

async function isProviderReachable(provider, videoId) {
  const testUrl = buildProviderUrl(provider, videoId);
  if (!testUrl) return false;

  try {
    let response = await fetch(testUrl, {
      method: 'HEAD',
      redirect: 'manual'
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(testUrl, {
        method: 'GET',
        redirect: 'manual'
      });
    }

    return response.ok;
  } catch (error) {
    console.error(`Provider check failed for ${provider.key}:`, error);
    return false;
  }
}

function buildProviderUrl(provider, videoId) {
  const host = provider.host.replace(/\/+$/, '');
  if (provider.type === 'invidious') {
    if (provider.mode === 'embed') {
      return `${host}/embed/${videoId}`;
    }
    return `${host}/watch?v=${videoId}`;
  }

  if (provider.type === 'youtube') {
    if (provider.mode === 'embed') {
      return `${host}/embed/${videoId}?rel=0`;
    }
    return `${host}/watch?v=${videoId}`;
  }

  return null;
}

function extractVideoIdFromContent(xmlFragment) {
  const ytMatch = xmlFragment.match(/<yt:videoid[^>]*>([\s\S]*?)<\/yt:videoid>/i);
  if (ytMatch) return ytMatch[1].trim();

  const linkMatch = xmlFragment.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
  if (linkMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(linkMatch[1].trim()));
    if (id) return id;
  }

  const linkAttrMatch = xmlFragment.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (linkAttrMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(linkAttrMatch[1]));
    if (id) return id;
  }

  const guidMatch = xmlFragment.match(/<guid\b[^>]*>([\s\S]*?)<\/guid>/i);
  if (guidMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(guidMatch[1].trim()));
    if (id) return id;
  }

  const mediaMatch = xmlFragment.match(/<media:content\b[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(mediaMatch[1]));
    if (id) return id;
  }

  return null;
}

function extractYouTubeVideoId(url) {
  const normalized = url.replace(/\s+/g, '');

  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments[0]) return segments[0];
    }

    if (host.includes('youtube.com')) {
      const vParam = parsed.searchParams.get('v');
      if (vParam) return vParam;

      const parts = parsed.pathname.split('/').filter(Boolean);
      if (['shorts', 'live', 'embed'].includes(parts[0])) {
        return parts[1] || null;
      }

      if (parts[0] === 'watch' && parts[1]) {
        return parts[1];
      }
    }
  } catch (error) {
    // Fall back to regex below
  }

  const fallback = normalized.match(/([A-Za-z0-9_-]{11})/);
  return fallback ? fallback[1] : null;
}

function rewriteFeedSelfLink(feedXml, selfUrl) {
  if (!feedXml || !selfUrl) return feedXml;
  const escapedUrl = escapeXmlAttribute(selfUrl);
  const patterns = [
    /(<link\b[^>]*rel=["']self["'][^>]*href=["'])([^"']+)(["'][^>]*>)/i,
    /(<atom:link\b[^>]*rel=["']self["'][^>]*href=["'])([^"']+)(["'][^>]*>)/i
  ];

  let updatedXml = feedXml;
  for (const pattern of patterns) {
    updatedXml = updatedXml.replace(pattern, `$1${escapedUrl}$3`);
  }
  return updatedXml;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeXmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXmlText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function createErrorResponse(message, status = 500) {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function resolveYouTubeFeedUrl(config) {
  if (config.url) return config.url;
  if (config.channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${config.channelId}`;
  }
  if (config.handle) {
    return `https://www.youtube.com/feeds/videos.xml?user=${config.handle}`;
  }
  return null;
}
