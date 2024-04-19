# Meetup Scraper

```bash
npm init -y
npm i -D concurrently
```

## Errors

```
{
[0]   e: TypeError: fetch failed
[0]       at node:internal/deps/undici/undici:12345:11
[0]       at async globalThis.fetch (webpack-internal:///(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js:216:16)
[0]       at async postPath (webpack-internal:///(action-browser)/./src/app/getMemberHikes.ts:16:21)
[0]       at async $$ACTION_0 (webpack-internal:///(action-browser)/./src/app/getMemberHikes.ts:48:26)
[0]       at async /renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:39:406
[0]       at async t2 (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:38:6412)
[0]       at async rS (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:41:1369)
[0]       at async doRender (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:1378:30)
[0]       at async cacheEntry.responseCache.get.routeKind (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:1539:28)
[0]       at async DevServer.renderToResponseWithComponentsImpl (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:1447:28)
[0]       at async DevServer.renderPageComponent (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:1844:24)
[0]       at async DevServer.renderToResponseImpl (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:1882:32)
[0]       at async DevServer.pipeImpl (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:895:25)
[0]       at async NextNodeServer.handleCatchallRenderRequest (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/next-server.js:269:17)
[0]       at async DevServer.handleRequestImpl (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/base-server.js:791:17)
[0]       at async /renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/dev/next-dev-server.js:331:20
[0]       at async Span.traceAsyncFn (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/trace/trace.js:151:20)
[0]       at async DevServer.handleRequest (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/dev/next-dev-server.js:328:24)
[0]       at async invokeRender (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/lib/router-server.js:174:21)
[0]       at async handleRequest (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/lib/router-server.js:353:24)
[0]       at async requestHandlerImpl (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/lib/router-server.js:377:13)
[0]       at async Server.requestListener (/renderws/carltonData/cj2024/code/monorepo/meetup-scraper/nextjs-meetup-scraper/node_modules/next/dist/server/lib/start-server.js:140:13) {
[0]     cause: SocketError: other side closed
[0]         at Socket.onSocketEnd (node:internal/deps/undici/undici:8903:26)
[0]         at Socket.emit (node:events:530:35)
[0]         at endReadableNT (node:internal/streams/readable:1696:12)
[0]         at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
[0]       code: 'UND_ERR_SOCKET',
[0]       socket: [Object]
[0]     }
[0]   }
[0] }
[0]  ⨯ src/app/getMemberHikes.ts (36:27) @ hikes
[0]  ⨯ TypeError: Cannot read properties of null (reading 'hikes')
[0]     at $$ACTION_0 (./src/app/getMemberHikes.ts:56:32)
[0]   34 |     const hikesRes = await postPath("hikes", { ...user, hikesOld, i });
[0]   35 |     if (hikesRes && hikesRes.error) return { error: hikesRes.error };
[0] > 36 |     const hikes = hikesRes.hikes;
[0]      |                           ^
[0]   37 |     if (!hikes || hikesOld.length === hikes.length) continue;
[0]   38 |     hikesSave({ user, hikes });
[0]   39 |   }
```
