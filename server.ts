import "dotenv/config";

import { createServer } from "node:http";
import { Socket } from "node:net";
import docker from "@/lib/docker";
import { consola } from "consola";
import next from "next";
import { WebSocketServer } from "ws";
const port = Number.parseInt(process.env.PORT as string) || 3000;
const dev = process.env.NODE_ENV !== "production";
if (process.argv.includes("--turbo")) {
  process.env.TURBOPACK = "1";
}
const server = createServer();
const app = next({ dev, port, httpServer: server, hostname: process.env.HOSTNAME });
consola.start(`✨ Stardust: Starting ${dev ? "development" : "production"} server...`);
await app.prepare();
const nextRequest = app.getRequestHandler();
const nextUpgrade = app.getUpgradeHandler();
const websockify = new WebSocketServer({ noServer: true });
websockify.on("connection", async (ws, req) => {
  try {
    const id = req.url?.split("/")[2];
    if (!id) {
      ws.close(1008, "Missing ID");
      return;
    }
    const ip = (await docker.getContainer(id).inspect()).NetworkSettings.Networks[process.env.DOCKER_NETWORK as string].IPAddress
    const socket = new Socket();
    socket.connect(5901, ip);
    ws.on("message", (message: Uint8Array) => {
      socket.write(message);
    });
    ws.on("close", (code, reason) => {
      consola.info(
        `✨ Stardust: Connection closed with code ${code} and ${reason.toString() ? `reason ${reason.toString()}` : "no reason"
        }`,
      );
      socket.end();
    });

    socket.on("data", (data) => {
      ws.send(data);
    });

    socket.on("error", (err) => {
      consola.warn(`✨ Stardust: ${err.message}`);
      ws.close();
    });

    socket.on("close", () => {
      ws.close();
    });
  } catch (error) {
    ws.close(1008, "Server error");
    consola.error(`✨ Stardust: ${(error as Error).message}`);
  }
});
server.on("request", nextRequest);
server.on("upgrade", async (req, socket, head) => {
  if (req.url?.includes("websockify")) {
    websockify.handleUpgrade(req, socket, head, (ws) => {
      websockify.emit("connection", ws, req, websockify);
    });
  } else {
    nextUpgrade(req, socket, head);
  }
});
server.listen(port, () => {
  consola.success(`✨ Stardust: Server listening on ${port}`);
});
