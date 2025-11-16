const FEED_CONFIGS = {
  // Add additional YouTube feeds here. Each key becomes the worker path segment.
  'cpscott16': {
    channelId: 'UCO1ydt_TOAZfwEgJpgOx2jQ',
    handle: 'CPScott16'
  }
};

const DEFAULT_CONFIG = {
  cacheDuration: 300,
  sourceCacheTTLMin: 6 * 3600,
  sourceCacheTTLMax: 6 * 3600
};

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
        'User-Agent': 'YouTube-RSS-Embed-Worker/1.0 (Polite 6h cache)'
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

  const isAtom = feedXml.includes('<feed') && feedXml.includes('xmlns="http://www.w3.org/2005/Atom"');
  return isAtom ? processAtomFeed(feedXml) : processRssFeed(feedXml);
}

function processRssFeed(xmlString) {
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  return xmlString.replace(itemRegex, (fullItem) => rewriteRssItem(fullItem));
}

function processAtomFeed(xmlString) {
  const entryRegex = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
  return xmlString.replace(entryRegex, (fullEntry) => rewriteAtomEntry(fullEntry));
}

function rewriteRssItem(itemXml) {
  let updated = itemXml;
  updated = rewriteTextTag(updated, 'link');
  updated = rewriteTextTag(updated, 'guid');
  updated = rewriteMediaContentUrls(updated);
  return updated;
}

function rewriteAtomEntry(entryXml) {
  let updated = entryXml;
  updated = rewriteLinkAttributes(updated);
  updated = rewriteTextTag(updated, 'id');
  updated = rewriteMediaContentUrls(updated);
  return updated;
}

function rewriteTextTag(xmlFragment, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  return xmlFragment.replace(regex, (match, inner) => {
    const embedUrl = convertToYouTubeEmbedUrl(inner);
    if (!embedUrl) return match;
    const escaped = escapeXmlText(embedUrl);
    return match.replace(inner, escaped);
  });
}

function rewriteLinkAttributes(xmlFragment) {
  const regex = /<link\b([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi;
  return xmlFragment.replace(regex, (match, _prefix, url) => {
    const embedUrl = convertToYouTubeEmbedUrl(url);
    if (!embedUrl) return match;
    const escaped = escapeXmlAttribute(embedUrl);
    return match.replace(url, escaped);
  });
}

function rewriteMediaContentUrls(xmlFragment) {
  const regex = /(<media:content\b[^>]*url=["'])([^"']+)(["'][^>]*>)/gi;
  return xmlFragment.replace(regex, (match, prefix, url, suffix) => {
    const embedUrl = convertToYouTubeEmbedUrl(url);
    if (!embedUrl) return match;
    const escaped = escapeXmlAttribute(embedUrl);
    return `${prefix}${escaped}${suffix}`;
  });
}

function convertToYouTubeEmbedUrl(rawUrl) {
  if (!rawUrl) return null;
  const decodedUrl = decodeXmlEntities(String(rawUrl).trim());
  if (!decodedUrl) return null;

  const videoId = extractYouTubeVideoId(decodedUrl);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?rel=0`;
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
