var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-BfhEAh/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-BfhEAh/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// worker.js
var FEED_CONFIGS = {
  // Add additional YouTube feeds here. Each key becomes the worker path segment.
  "cpscott16": {
    channelId: "UCO1ydt_TOAZfwEgJpgOx2jQ",
    handle: "CPScott16"
  },
  "404mediaco": {
    channelId: "UC7YMZb0X_W06ToOazhFuXIQ",
    handle: "404Mediaco"
  },
  "jasonkpargin": {
    channelId: "UCREK_lo_gv9fkQNxEzFTjwQ",
    handle: "jasonkpargin"
  },
  "abettercomputer": {
    channelId: "UCGYdWR8QUYn88lG0PBeJQ_g",
    handle: "ABetterComputer"
  },
  "abetoday": {
    channelId: "UCUxIu91gGsK9Q0tTcQM8iNw",
    handle: "abetoday"
  },
  "hotweirdg0rl": {
    channelId: "UCy_2BeNSAZXkdFlxOLj-IuQ",
    handle: "hotweirdg0rl"
  },
  "roadshowpbs": {
    channelId: "UCdnJJ2_mzqHwKIX_SmCVHTA",
    handle: "RoadshowPBS"
  },
  "archdigest": {
    channelId: "UC0k238zFx-Z8xFH0sxCrPJg",
    handle: "Archdigest"
  },
  "artsy_story": {
    channelId: "UCfSzGVdNy8YndcAw9Fmij5A",
    handle: "artsy_story"
  },
  "atrocityguide": {
    channelId: "UCn8OYopT9e8tng-CGEWzfmw",
    handle: "AtrocityGuide"
  },
  "codingwithauryn": {
    channelId: "UChk4F4yBtP4i063wnJH8TIQ",
    handle: "CodingWithAuryn"
  },
  "austinkillsit": {
    channelId: "UCAmjevylPV9bYMV-pG_4YCg",
    handle: "austinkillsit"
  },
  "bekahdayyy": {
    channelId: "UC_wQixk-qE9uxyB9AwjENsA",
    handle: "bekahdayyy"
  },
  "palmertrolls": {
    channelId: "UCBp_JNTbVgZx_6DFxSSY-Hg",
    handle: "palmertrolls"
  },
  "beckystern": {
    channelId: "UCsI_41SZafKtB5qE46WjlQQ",
    handle: "BeckyStern"
  },
  "clemmygames": {
    channelId: "UCCd3jyJmOFzkJEMj5Bp89rw",
    handle: "clemmygames"
  },
  "bitluni": {
    channelId: "UCp_5PO66faM4dBFbFFBdPSQ",
    handle: "bitluni"
  },
  "_jared": {
    channelId: "UC2Kyj04yISmHr1V-UlJz4eg",
    handle: "_jared"
  },
  "bleepingcomputer": {
    channelId: "UCTU0ZJQ8Lqslww0R9Xk0sJg",
    handle: "bleepingcomputer"
  },
  "mkbhd": {
    channelId: "UCBJycsmduvYEL83R_U4JriQ",
    handle: "mkbhd"
  },
  "halloftechllc": {
    channelId: "UCJSJ0xIWf4e3hNu7KgYqPxg",
    handle: "HallOfTechLLC"
  },
  "landonsanimationwheelhouse": {
    channelId: "UC2WJrMmd_eNMqfWJbD_fq2A",
    handle: "LandonsAnimationWheelhouse"
  },
  "brickexperimentchannel": {
    channelId: "UClsFdM0HzTdF1JYoraQ0aUw",
    handle: "BrickExperimentChannelationWheelhouse"
  },
  "brick_crafts": {
    channelId: "UCTGHqw41qk_WyK3wJK7nweg",
    handle: "Brick_Crafts"
  },
  "brynodc": {
    channelId: "UCNG4L6tzJq1i8gWkbmuMoiA",
    handle: "brynoDC"
  },
  "snaptocks": {
    channelId: "UCNG4L6tzJq1i8gWkbmuMoiA",
    handle: "snaptocks"
  },
  "filamentfriday": {
    channelId: "UCsdc_0ZTXikARFEn2dRDJhg",
    handle: "FilamentFriday"
  },
  "chuntzit": {
    channelId: "UCghR6gNuBneEKkDuKtXQM4w",
    handle: "Chuntzit"
  },
  "clickandthock": {
    channelId: "UCxsWMZAyUwT67nikED3sL_g",
    handle: "ClickandThock"
  },
  "cnet": {
    channelId: "UC9-y-6csu5WGm29I7JiwpnA",
    handle: "CNET"
  },
  "damileearch": {
    channelId: "UCJ_2hNMxOzNjviJBiLWHMqg",
    handle: "DamiLeeArch"
  },
  "danharumi1": {
    channelId: "UCVAgplWvY5nT90yI2Rq2HkA",
    handle: "danharumi1"
  },
  "maklelan": {
    channelId: "UCAAJCQ0FCqRmAEv95SyTfNg",
    handle: "maklelan"
  },
  //!!!!!!!!!!!!!!!!!!!!!!!!
  "danreedermusic": {
    channelId: "UCZQVGv2GGRSOeVTQMYoru2A",
    handle: "DanReederMusic"
  },
  "maklelan": {
    channelId: "UCAAJCQ0FCqRmAEv95SyTfNg",
    handle: "maklelan"
  },
  "davesgarage": {
    channelId: "UCNzszbnvQeFzObW0ghk0Ckw",
    handle: "DavesGarage"
  },
  "drloriv": {
    channelId: "UCyld4DZKdnx-VcH0mqpOClg",
    handle: "DrLoriV"
  },
  "ebnovels": {
    channelId: "UCiflcKnh5cZiRWK7jlYKwxA",
    handle: "ebnovels"
  },
  //!!!!!!!!!!!!!!!!!!!!!!!!!
  "emmymade": {
    channelId: "UC9-y-UCzqbfYjQmf9nLQPMxVgPhiA",
    handle: "emmymade"
  },
  "etymology_nerd": {
    channelId: "UCNHb7I85BKnwbJF4fWBXJjA",
    handle: "etymology_nerd"
  },
  "feypop": {
    channelId: "UCgBvWtknPuHpVuytBgkiXyA",
    handle: "feypop"
  },
  "fourkeysbookarts": {
    channelId: "UCwjz7_xH_1Sehw5W-qIDLeg",
    handle: "FourKeysBookArts"
  },
  //!!!!!!!!!!!!!!!!!!!!!!
  "geohussar": {
    channelId: "UCEW-UCEW-70kkxTIsxPeXJtdVaeg",
    handle: "GeoHussar"
  },
  "hqkay": {
    channelId: "UCnj_D0bV_fZ2p0BdBsUOcYA",
    handle: "HQKAY"
  },
  "ifixityourself": {
    channelId: "UCHbx9IUW7eCeJsC4sBCTNBA",
    handle: "iFixitYourself"
  },
  "democracynow": {
    channelId: "UCzuqE7-t13O4NIDYJfakrhw",
    handle: "DemocracyNow"
  },
  "jennynicholson": {
    channelId: "UC7-E5xhZBZdW-8d7V80mzfg",
    handle: "JennyNicholson"
  },
  "jerryrigeverything": {
    channelId: "UCWFKCr40YwOZQx8FHU_ZqqQ",
    handle: "JerryRigEverything"
  },
  "keds_economist": {
    channelId: "UC-L8bPaJ_aJznCLLtUHxnLA",
    handle: "keds_economist"
  },
  "lastweektonight": {
    channelId: "UC3XTzVzaHQEd30rQbuvCtTQ",
    handle: "LastWeekTonight"
  },
  "learnlinuxtv": {
    channelId: "UCxQKHvKbmSzGMvUrVtJYnUA",
    handle: "LearnLinuxTV"
  },
  "limc": {
    channelId: "UCaHT88aobpcvRFEuy4v5Clg",
    handle: "LIMC"
  },
  "lorde": {
    channelId: "UCOxhwqKKlVq_NaD0LVffGuw",
    handle: "Lorde"
  },
  "matteolanecomedy": {
    channelId: "UC9-UCHtaXqDklDTydmwgLj5siMg-6csu5WGm29I7JiwpnA",
    handle: "matteolanecomedy"
  },
  "michael_tunnell": {
    channelId: "UCmyGZ0689ODyReHw3rsKLtQ",
    handle: "michael_tunnell"
  },
  "gremlita": {
    channelId: "UCoOss5XiPpnLHGmLrBvNkJg",
    handle: "gremlita"
  },
  "maklelan": {
    channelId: "UCsJ-VTlxYSKG-UVHa7K1Khw",
    handle: "maklelan"
  },
  "mk.gee_": {
    channelId: "UCsJ-VTlxYSKG-UVHa7K1Khw",
    handle: "mk.gee_"
  },
  "molesrcoool": {
    channelId: "UCNvIUYKjBXoMVcL0bTRUqhQ",
    handle: "molesrcoool"
  },
  "molly0xfff": {
    channelId: "UCJcWDNh9E6AoVW4nsMXyVCw",
    handle: "molly0xfff"
  },
  "moonsrarebooks": {
    channelId: "UCPCoaKCeqmWhCwCH5Ht7dQg",
    handle: "MoonsRareBooks"
  },
  "networkchuck": {
    channelId: "UC9x0AN7BWHpCDHSm9NiJFJQ",
    handle: "NetworkChuck"
  },
  "nikfromtiktok": {
    channelId: "UCOADp5jDxyAffcTNFvumbQA",
    handle: "NikFromTikTok"
  },
  "nprmusic": {
    channelId: "UC4eYXhJI4-7wSWc8UNRwD4A",
    handle: "nprmusic"
  },
  "oceanna_": {
    channelId: "UClFk1sJv-6eSJNHejjvf-6g",
    handle: "oceanna_"
  },
  "outlawbookselleroriginal": {
    channelId: "UCcpaYAc_kJbYBP66YQpxRnw",
    handle: "OfficeHoursLive"
  },
  "pingpingtechtalk": {
    channelId: "UCYNIKXaDBl8DZ5FyxFivXhg",
    handle: "PingPingTechTalk"
  },
  "jayduck9": {
    channelId: "UCB3gITkN1-LzFF_IpVanURQ",
    handle: "jayduck9"
  },
  "officehourslive": {
    channelId: "UCtS3BcCw-tITPFYSvkbP0Bg",
    handle: "OfficeHoursLive"
  },
  "drrachelbarr": {
    channelId: "UCC6wU8VRgIYizEjVvTdalMQ",
    handle: "DrRachelBarr"
  },
  "ramjad": {
    channelId: "UCLA7cJBnqr0nLF2bQBD9uUg",
    handle: "RAmjad"
  },
  "rebecca.romney": {
    channelId: "UC8_ejtUg86uwyerNtmx5D4g",
    handle: "rebecca.romney"
  },
  "rottenmangopod": {
    channelId: "UCZnXNjnBhrrmvx3eDO_2z9w",
    handle: "rottenmangopod"
  },
  "rottentomatoestrailers": {
    channelId: "UCi8e0iOVk1fEOogdfu4YgfA",
    handle: "RottenTomatoesTRAILERS"
  },
  "thesiliconsiren": {
    channelId: "UCC9uI0zEXkiRFgctyTLegRg",
    handle: "theSiliconSiren"
  },
  "simoncaine9515": {
    channelId: "UC0HAW8tgFA_xEmeUupuRwiA",
    handle: "simoncaine9515"
  },
  "StanWinstonSchool": {
    channelId: "UCnuYvkjI5C1HzYq9dfs2Nsg",
    handle: "OfficeHoursLive"
  },
  "sir_superhero": {
    channelId: "UCnuYvkjI5C1HzYq9dfs2Nsg",
    handle: "sir_superhero"
  },
  "stanwinstonschool": {
    channelId: "UC1rKAv7IwCeynqa9MPNfYaA",
    handle: "StanWinstonSchool"
  },
  "officehourslive": {
    channelId: "UCtS3BcCw-tITPFYSvkbP0Bg",
    handle: "OfficeHoursLive"
  },
  "stavvysworld": {
    channelId: "UCBVAaHkKSwfzee79b7SPyPw",
    handle: "stavvysworld"
  },
  "SwitchandClickOfficial": {
    channelId: "UCT6AJiTYspOILBK3hMWEq2g",
    handle: "SwitchandClickOfficial"
  },
  "jamelle-bouie": {
    channelId: "UCgDA-Or474NOdFEF8WF2yCA",
    handle: "jamelle-bouie"
  },
  "taramooknee": {
    channelId: "UCT5C7yaO3RVuOgwP8JVAujQ",
    handle: "TaraMooknee"
  },
  "taskmaster": {
    channelId: "UCT5C7yaO3RVuOgwP8JVAujQ",
    handle: "taskmaster"
  },
  "taylorlorenz": {
    channelId: "UCp38w5n099xkvoqciOaeFag",
    handle: "TaylorLorenz"
  },
  "theadamfriedlandshow": {
    channelId: "UC6ext5UAbrLT2e5y5BC6RTQ",
    handle: "TheAdamFriedlandShow"
  },
  "theboboyspodcast": {
    channelId: "UCtvC3nAHWPr6Ztc9PfB3eIA",
    handle: "theboboyspodcast"
  },
  "thedailyshow": {
    channelId: "UCUNOwz9KTDIhhTTN3_ptUDA",
    handle: "TheDailyShow"
  },
  "thegoodliars": {
    channelId: "UCUNOwz9KTDIhhTTN3_ptUDA",
    handle: "TheGoodLiars"
  },
  "katetheunreal": {
    channelId: "UCbORPu-PNMrFe9fVZ_Xu0VA",
    handle: "Katetheunreal"
  },
  "thelinuxchannel": {
    channelId: "UCESk3ORdKJ1iQGibV_XiHhw",
    handle: "TheLinuxChannel"
  },
  "thelinuxexp": {
    channelId: "UC5UAwBUum7CPN5buc-_N1Fw",
    handle: "TheLinuxEXP"
  },
  "therestisentertainment": {
    channelId: "UCYJpsKWYfZU8kOHZf_tUzQw",
    handle: "TheRestIsEntertainment"
  },
  "theverge": {
    channelId: "UCddiUEpeqJcYeBxX1IVBKvQ",
    handle: "TheVerge"
  },
  "tibees": {
    channelId: "UC52kszkc08-acFOuogFl5jw",
    handle: "tibees"
  },
  "tom_nicholas": {
    channelId: "UCxt2r57cLastdmrReiQJkEg",
    handle: "Tom_Nicholas"
  },
  "tondoeslinux": {
    channelId: "UCUDdGb82Xsv4_LQprelLhqA",
    handle: "TonDoesLinux"
  },
  "twinflicks": {
    channelId: "UCQG4l7WZRN_v8eI3tFtkHsQ",
    handle: "TwinFlicks"
  },
  "under_1_min": {
    channelId: "UCAq7apXGmB81wXmApvJ7kng",
    handle: "Under_1_min"
  },
  "vanityfair": {
    channelId: "UCIsbLox_y9dCIMLd8tdC6qg",
    handle: "VanityFair"
  },
  "veritasium": {
    channelId: "UCHnyfMqiRRG1u-2MsSQLbXA",
    handle: "veritasium"
  },
  "veronicaexplains": {
    channelId: "UCMiyV_Ib77XLpzHPQH_q0qQ",
    handle: "VeronicaExplains"
  },
  "vfxgeek": {
    channelId: "UC0XxzKQ-zNekAIJMAMrdXVA",
    handle: "VFXGeek"
  },
  "vizuara": {
    channelId: "UCdEov4L0bpJ_h6W3sJxkfUA",
    handle: "vizuara"
  },
  "yharazayd": {
    channelId: "UCzuvcjgZyyMaO6gwidRT8GA",
    handle: "Yharazayd"
  },
  "yharazayd": {
    channelId: "UCeTQM2-L710Mcqf6OAh9UUg",
    handle: "Yharazayd"
  },
  "vanityfair": {
    channelId: "UCIsbLox_y9dCIMLd8tdC6qg",
    handle: "VanityFair"
  },
  "veritasium": {
    channelId: "UCHnyfMqiRRG1u-2MsSQLbXA",
    handle: "veritasium"
  },
  "fdsignifire": {
    channelId: "UCgi2u-lGY-2i2ubLsUr6FbQ",
    handle: "fdsignifire"
  }
};
var DEFAULT_CONFIG = {
  cacheDuration: 300,
  sourceCacheTTLMin: 3 * 3600,
  sourceCacheTTLMax: 3 * 3600
};
var INVIDIOUS_INSTANCES = {
  "yewtu": "https://yewtu.be",
  "nadeko": "https://inv.nadeko.net",
  "f5si": "https://invidious.f5.si"
};
var ACTIVE_INVIDIOUS_INSTANCE = INVIDIOUS_INSTANCES.yewtu;
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
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
      const feedUrl = url.searchParams.get("feed");
      if (!feedUrl) {
        return createErrorResponse(
          "Usage:\n1. Predefined feeds: https://your-worker.dev/feedname\n2. Dynamic feeds: https://your-worker.dev/?feed=RSS_URL",
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
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Access-Control-Allow-Origin": "*",
          "X-Feed-Source": feedConfig.url,
          "X-Feed-Processed": (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error) {
      console.error("Feed processing error:", error);
      return createErrorResponse(`Error processing feed: ${error.message}`, 500);
    }
  }
};
async function processFeed(config, env) {
  const cacheKey = `source_${config.cacheKey}`;
  let feedXml = null;
  if (env.YOUTUBE_FEED_CACHE) {
    try {
      const cached = await env.YOUTUBE_FEED_CACHE.get(cacheKey, { type: "json" });
      if (cached && cached.content && cached.timestamp) {
        const cacheAge = Date.now() - cached.timestamp;
        if (cacheAge < config.sourceCacheTTLMax * 1e3) {
          feedXml = cached.content;
        }
      }
    } catch (error) {
      console.error("Error reading cache:", error);
    }
  }
  if (!feedXml) {
    if (!config.url) {
      throw new Error("Feed URL is not configured.");
    }
    const response = await fetch(config.url, {
      headers: {
        "User-Agent": "YouTube-RSS-Embed-Worker/1.0 (Polite 3h cache)"
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
        console.error("Error caching source feed:", error);
      }
    }
  }
  const isAtom = feedXml.includes("<feed") && feedXml.includes('xmlns="http://www.w3.org/2005/Atom"');
  return isAtom ? await processAtomFeed(feedXml) : await processRssFeed(feedXml);
}
__name(processFeed, "processFeed");
async function processRssFeed(xmlString) {
  const itemRegex = /<item\b[^>]*>[\s\S]*?<\/item>/gi;
  const matches = [...xmlString.matchAll(itemRegex)];
  if (matches.length === 0)
    return xmlString;
  let result = "";
  let lastIndex = 0;
  for (const match of matches) {
    const { index } = match;
    const fullItem = match[0];
    result += xmlString.slice(lastIndex, index);
    const rewritten = await rewriteRssItem(fullItem);
    result += rewritten;
    lastIndex = index + fullItem.length;
  }
  result += xmlString.slice(lastIndex);
  return result;
}
__name(processRssFeed, "processRssFeed");
async function processAtomFeed(xmlString) {
  const entryRegex = /<entry\b[^>]*>[\s\S]*?<\/entry>/gi;
  const matches = [...xmlString.matchAll(entryRegex)];
  if (matches.length === 0)
    return xmlString;
  let result = "";
  let lastIndex = 0;
  for (const match of matches) {
    const { index } = match;
    const fullEntry = match[0];
    result += xmlString.slice(lastIndex, index);
    const rewritten = await rewriteAtomEntry(fullEntry);
    result += rewritten;
    lastIndex = index + fullEntry.length;
  }
  result += xmlString.slice(lastIndex);
  return result;
}
__name(processAtomFeed, "processAtomFeed");
async function rewriteRssItem(itemXml) {
  const videoId = extractVideoIdFromContent(itemXml);
  if (!videoId)
    return itemXml;
  const invidiousUrl = buildInvidiousUrl(videoId);
  let updated = itemXml;
  updated = rewriteTextTag(updated, "link", invidiousUrl);
  updated = rewriteTextTag(updated, "guid", invidiousUrl);
  updated = rewriteMediaContentUrls(updated, invidiousUrl);
  updated = prependVideoLinksToDescription(updated, videoId);
  return updated;
}
__name(rewriteRssItem, "rewriteRssItem");
async function rewriteAtomEntry(entryXml) {
  const videoId = extractVideoIdFromContent(entryXml);
  if (!videoId)
    return entryXml;
  const invidiousUrl = buildInvidiousUrl(videoId);
  let updated = entryXml;
  updated = rewriteLinkAttributes(updated, invidiousUrl);
  updated = rewriteTextTag(updated, "id", invidiousUrl);
  updated = rewriteMediaContentUrls(updated, invidiousUrl);
  updated = prependVideoLinksToDescription(updated, videoId);
  return updated;
}
__name(rewriteAtomEntry, "rewriteAtomEntry");
function rewriteTextTag(xmlFragment, tagName, newUrl) {
  if (!newUrl)
    return xmlFragment;
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const escaped = escapeXmlText(newUrl);
  return xmlFragment.replace(regex, (match, inner) => match.replace(inner, escaped));
}
__name(rewriteTextTag, "rewriteTextTag");
function rewriteLinkAttributes(xmlFragment, newUrl) {
  if (!newUrl)
    return xmlFragment;
  const regex = /<link\b([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi;
  const escaped = escapeXmlAttribute(newUrl);
  return xmlFragment.replace(regex, (match, _prefix, url) => match.replace(url, escaped));
}
__name(rewriteLinkAttributes, "rewriteLinkAttributes");
function rewriteMediaContentUrls(xmlFragment, newUrl) {
  if (!newUrl)
    return xmlFragment;
  const regex = /(<media:content\b[^>]*url=["'])([^"']+)(["'][^>]*>)/gi;
  const escaped = escapeXmlAttribute(newUrl);
  return xmlFragment.replace(regex, (match, prefix, _url, suffix) => `${prefix}${escaped}${suffix}`);
}
__name(rewriteMediaContentUrls, "rewriteMediaContentUrls");
function buildInvidiousUrl(videoId) {
  return `${ACTIVE_INVIDIOUS_INSTANCE}/watch?v=${videoId}&speed=1.8`;
}
__name(buildInvidiousUrl, "buildInvidiousUrl");
function buildYouTubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
__name(buildYouTubeUrl, "buildYouTubeUrl");
function prependVideoLinksToDescription(itemXml, videoId) {
  const invidiousUrl = buildInvidiousUrl(videoId);
  const youtubeUrl = buildYouTubeUrl(videoId);
  const linkHtml = `<p><strong>Watch on:</strong> <a href="${escapeXmlAttribute(invidiousUrl)}">Invidious</a> | <a href="${escapeXmlAttribute(youtubeUrl)}">YouTube</a></p><hr>`;
  const descRegex = /<(description|summary)\b([^>]*)>([\s\S]*?)<\/\1>/i;
  let match = itemXml.match(descRegex);
  if (match) {
    const tagName = match[1];
    const attributes = match[2];
    const content = match[3];
    const cdataMatch = content.match(/^(\s*)<!\[CDATA\[([\s\S]*?)\]\]>(\s*)$/);
    let newContent;
    if (cdataMatch) {
      const [, leadingWs, innerContent, trailingWs] = cdataMatch;
      newContent = `${leadingWs}<![CDATA[${linkHtml}${innerContent}]]>${trailingWs}`;
    } else {
      newContent = `<![CDATA[${linkHtml}${content}]]>`;
    }
    return itemXml.replace(descRegex, `<${tagName}${attributes}>${newContent}</${tagName}>`);
  }
  const mediaDescRegex = /<(media:description)\b([^>]*)>([\s\S]*?)<\/\1>/i;
  match = itemXml.match(mediaDescRegex);
  if (match) {
    const tagName = match[1];
    const attributes = match[2];
    const content = match[3];
    const newContent = `<![CDATA[${linkHtml}${content}]]>`;
    return itemXml.replace(mediaDescRegex, `<${tagName}${attributes}>${newContent}</${tagName}>`);
  }
  return itemXml;
}
__name(prependVideoLinksToDescription, "prependVideoLinksToDescription");
function extractVideoIdFromContent(xmlFragment) {
  const ytMatch = xmlFragment.match(/<yt:videoid[^>]*>([\s\S]*?)<\/yt:videoid>/i);
  if (ytMatch)
    return ytMatch[1].trim();
  const linkMatch = xmlFragment.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
  if (linkMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(linkMatch[1].trim()));
    if (id)
      return id;
  }
  const linkAttrMatch = xmlFragment.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (linkAttrMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(linkAttrMatch[1]));
    if (id)
      return id;
  }
  const guidMatch = xmlFragment.match(/<guid\b[^>]*>([\s\S]*?)<\/guid>/i);
  if (guidMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(guidMatch[1].trim()));
    if (id)
      return id;
  }
  const mediaMatch = xmlFragment.match(/<media:content\b[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) {
    const id = extractYouTubeVideoId(decodeXmlEntities(mediaMatch[1]));
    if (id)
      return id;
  }
  return null;
}
__name(extractVideoIdFromContent, "extractVideoIdFromContent");
function extractYouTubeVideoId(url) {
  const normalized = url.replace(/\s+/g, "");
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0])
        return segments[0];
    }
    if (host.includes("youtube.com")) {
      const vParam = parsed.searchParams.get("v");
      if (vParam)
        return vParam;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["shorts", "live", "embed"].includes(parts[0])) {
        return parts[1] || null;
      }
      if (parts[0] === "watch" && parts[1]) {
        return parts[1];
      }
    }
  } catch (error) {
  }
  const fallback = normalized.match(/([A-Za-z0-9_-]{11})/);
  return fallback ? fallback[1] : null;
}
__name(extractYouTubeVideoId, "extractYouTubeVideoId");
function rewriteFeedSelfLink(feedXml, selfUrl) {
  if (!feedXml || !selfUrl)
    return feedXml;
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
__name(rewriteFeedSelfLink, "rewriteFeedSelfLink");
function decodeXmlEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
__name(decodeXmlEntities, "decodeXmlEntities");
function escapeXmlAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
__name(escapeXmlAttribute, "escapeXmlAttribute");
function escapeXmlText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
__name(escapeXmlText, "escapeXmlText");
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
__name(hashString, "hashString");
function createErrorResponse(message, status = 500) {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(createErrorResponse, "createErrorResponse");
function resolveYouTubeFeedUrl(config) {
  if (config.url)
    return config.url;
  if (config.channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${config.channelId}`;
  }
  if (config.handle) {
    return `https://www.youtube.com/feeds/videos.xml?user=${config.handle}`;
  }
  return null;
}
__name(resolveYouTubeFeedUrl, "resolveYouTubeFeedUrl");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-BfhEAh/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-BfhEAh/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
