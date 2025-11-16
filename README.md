# YouTube RSS Embed Worker

Cloudflare Worker that proxies YouTube RSS/Atom feeds and converts every video link (including Shorts) into a playable `https://www.youtube.com/embed/<VIDEO_ID>` URL. Subscribe to the worker’s URL instead of the raw feed so you can tap **Play** directly from your reader.

## Project layout

- `worker.js` – Worker entry point. Handles caching, feed parsing, and embed rewriting.
- `wrangler.toml` – Worker configuration plus KV namespace bindings.
- `package.json` – Development conveniences (`npm run dev`, `npm run deploy`).

## Configure feeds

The top of `worker.js` exposes the `FEED_CONFIGS` map:

```js
const FEED_CONFIGS = {
  cpscott16: {
    url: 'https://www.youtube.com/feeds/videos.xml?user=CPScott16'
  }
};
```

- Each key becomes the path segment (e.g. `/cpscott16`).
- Point `url` at any Atom/RSS feed (native YouTube feed or an rss-bridge URL). Add more entries as needed.
- The worker also supports ad-hoc feeds via `?feed=<encoded_url>`.

## Local development

1. `npm install`
2. `npm run dev` – runs `wrangler dev` so you can test at `http://127.0.0.1:8787/<feed>`.
3. `npm run deploy` – publishes with the credentials from `wrangler login`.

## Cloudflare Worker + KV setup

1. **Create a KV namespace**
   - Run `wrangler kv:namespace create YOUTUBE_FEED_CACHE` and copy both the `id` (production) and `preview_id`. These store cached copies of upstream feeds for six hours.
   - Update `wrangler.toml` with the IDs:
     ```toml
     [[kv_namespaces]]
     binding = "YOUTUBE_FEED_CACHE"
     id = "<production-id>"
     preview_id = "<preview-id>"
     ```

2. **Deploy the Worker from GitHub**
   1. Push this directory to a GitHub repository.
   2. In the Cloudflare dashboard go to **Workers & Pages → Create application → Worker**.
   3. Choose **Connect to Git**, authorize the repo, and set:
      - **Production branch:** usually `main`.
      - **Root directory:** the folder containing `wrangler.toml` (e.g. `youtube-rss-handler`).
      - **Build command:** `npm install && npm run deploy` (or leave blank and deploy manually with Wrangler).
   4. After the initial deployment, open the Worker → **Settings → Bindings → KV Namespace Bindings** and attach the namespace created above to the `YOUTUBE_FEED_CACHE` binding.

3. **Manual alternative**
   - Run `wrangler login` locally.
   - Execute `npm run deploy` to push directly from your machine (Cloudflare uses the binding IDs in `wrangler.toml`).

## Using the Worker

- Subscribe to `https://<your-worker>.workers.dev/cpscott16` (or any other configured key).
- For arbitrary feeds, call `https://<your-worker>.workers.dev/?feed=<encoded_url>`.
- Every `<link>`, `<guid>`, `<id>`, `<media:content url>` and `<link rel="alternate">` inside entries is rewritten to `https://www.youtube.com/embed/<VIDEO_ID>?rel=0`, which most RSS clients can play in place.

## Adding more automation

- Duplicate entries in `FEED_CONFIGS` for each channel/shorts feed.
- GitHub automation: enable branch protections, preview deployments, or manual approvals as needed. Cloudflare redeploys automatically whenever the connected branch updates.
