import { rootConfigSchema, ConfigSchemaType } from "./config-schema";
import cluster, { Worker } from "cluster";
import http from "http";
import url from "url";
import {
  WorkerMessageType,
  WorkerMessageSchema,
  WorkerMessageReplySchema,
  WorkerMessageReplyType,
} from "./server-schema";

import { validateConfig } from "./config";
interface CreateServerConfig {
  port: number;
  workerCount: number;
  config: ConfigSchemaType;
}

export async function createServer(config: CreateServerConfig) {
  const { workerCount, port } = config;
  const WORKER_POOL: Worker[] = [];

  if (cluster.isPrimary) {
    console.log("Master Process is up 🚀");
    for (let i = 0; i < workerCount; i++) {
      const w = cluster.fork({ config: JSON.stringify(config.config) });
      WORKER_POOL.push(w);
      console.log(`Worker ${i} is now  turned up 🚀`);
    }

    const server = http.createServer((req, res) => {
      const index = Math.floor(Math.random() * workerCount); //random workercccccc
      const worker: Worker = WORKER_POOL[index];
      console.log(`Request is being handled by Worker ${index}`);

      if (!worker) {
        throw new Error("Worker is not available");
      }
      //   console.log("worker", worker);

      const payload: WorkerMessageType = {
        requestType: "HTTPS",
        header: req.headers,
        body: null,
        url: `${req.url}`,
      };
      //   console.log("payload", payload);
      worker.send(JSON.stringify(payload));

      worker.once("message", async (workerReply: string) => {
        const replyvalidated = await WorkerMessageReplySchema.parseAsync(
          JSON.parse(workerReply)
        );
        if (replyvalidated.errorCode) {
          res.writeHead(parseInt(replyvalidated.errorCode));
          res.end(replyvalidated.error);
          return;
        } else {
          res.writeHead(200);
          res.end(replyvalidated.data);
          return;
        }
      });
    });
    const workers = Object.values(cluster.workers ?? []);
    console.log("(master cluster)worker length", workers.length);

    server.listen(config.port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } else {
    console.log("Worker Process is up 🚀");
    if (cluster.isWorker && cluster.worker) {
      console.log(`I am worker #${cluster.worker.id}`);
    }

    const config = await validateConfig(process.env.config ?? "{}");

    // console.log("config:", config);

    process.on("message", async (message: string) => {
      console.log("Worker received message:", message);
      const messagevalidated = await WorkerMessageSchema.parseAsync(
        JSON.parse(message)
      );
      console.log("messagevalidated", messagevalidated);
      const requestURL = messagevalidated.url;
      // console.log("requestURL", requestURL);

      // finding the rule
      // const rule = config.server.rules?.find((e) => e.path === requestURL);
      const rule = config.server.rules?.find((e) => {
        const regex = new RegExp(`^${e.path}.*$`);
        return regex.test(requestURL);
      });

      if (!rule) {
        const reply: WorkerMessageReplyType = {
          error: "Rule Not Found",
          errorCode: "404",
        };

        if (process.send) return process.send(JSON.stringify(reply));
      } else {
        console.log("rule", rule);
      }

      // selecting random upstream
      const numberOfUpstreams = rule?.upstreams.length;
      if (!numberOfUpstreams || numberOfUpstreams <= 0) {
        throw new Error("No upstreams available for selection.");
      }
      const index = Math.floor(Math.random() * numberOfUpstreams);
      // const index = 0;

      console.log("number of upstreams", numberOfUpstreams);
      const upstreamID = rule?.upstreams[index];

      console.log("upstreamID", upstreamID);
      if (!upstreamID) {
        const reply: WorkerMessageReplyType = {
          error: "Upstream Not Found",
          errorCode: "404",
        };

        if (process.send) return process.send(JSON.stringify(reply));
      }
      // searching upstreams
      const upstreams = config.server.upstreams.find(
        (e) => e.id === upstreamID
      );
      console.log("upstream", upstreams);

      const upstreamURL = upstreams?.url;
      console.log("upstreamURL", upstreamURL);

      if (!upstreamURL) {
        const reply: WorkerMessageReplyType = {
          error: "Invalid Upstream URL",
          errorCode: "400",
        };
        if (process.send) return process.send(JSON.stringify(reply));
        return;
      }

      // const parsedURL = new URL(upstreamURL);
      // console.log("parsedURL", parsedURL);

      const options = {
        // host: parsedURL.hostname,
        // port: parsedURL.port || 80, // Default to port 80 if not specified
        host: upstreamURL,
        // path: `${parsedURL.pathname}${requestURL}`,
        path: requestURL,
        // method : 'GET'
        // headers: messagevalidated.header,
      };
      console.log("options", options);
      const request = http.request(options, (Proxyresponse) => {
        let data = "";
        Proxyresponse.on("data", (chunk) => {
          data += chunk;
        });

        Proxyresponse.on("end", () => {
          const reply: WorkerMessageReplyType = {
            data: data,
          };
          if (process.send) return process.send(JSON.stringify(reply));
        });
      });
      request.end();
    });
  }
}
