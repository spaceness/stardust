import { createServer } from "node:http";
import { Socket } from "node:net";
import { getConfig } from "@/lib/config";
import docker from "@/lib/docker";
import { db, session } from "@/lib/drizzle/db";
import { consola } from "consola";
import { and, eq } from "drizzle-orm";
import next from "next";
import { getToken } from "next-auth/jwt";
import { WebSocketServer } from "ws";
const config = getConfig();
const port = Number.parseInt(process.env.PORT as string) || 3000;
const dev = process.env.NODE_ENV !== "production";
if (process.argv.includes("--turbo")) {
	process.env.TURBOPACK = "1";
}
const server = createServer();
const app = next({
	dev,
	port,
	httpServer: server,
	hostname: process.env.HOSTNAME,
});
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
		const ip = (await docker.getContainer(id).inspect()).NetworkSettings.Networks[config.docker.network].IPAddress;
		const socket = new Socket();
		socket.connect(5901, ip);
		ws.on("message", (message: Uint8Array) => {
			socket.write(message);
		});
		ws.on("close", (code, reason) => {
			consola.info(
				`✨ Stardust: Connection closed with code ${code} and ${
					reason.toString() ? `reason ${reason.toString()}` : "no reason"
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
		const cookie = req.headers.cookie?.includes("__Secure") ? "__Secure-authjs.session-token" : "authjs.session-token";
		const token = await getToken({
			req: { headers: req.headers as Record<string, string> },
			secret: config.auth.secret,
			secureCookie: req.headers.cookie?.includes("__Secure"),
			salt: cookie,
			cookieName: cookie,
		});
		const [dbSession] = await db
			.select()
			.from(session)
			.where(and(eq(session.userId, token?.id as string), eq(session.id, req.url?.split("/")[2] as string)));
		websockify.handleUpgrade(req, socket, head, (ws) => {
			if (dbSession) {
				websockify.emit("connection", ws, req, websockify);
			} else {
				ws.close(1008, "Unauthorized");
			}
		});
	} else {
		nextUpgrade(req, socket, head);
	}
});
server.listen(port, () => {
	consola.success(`✨ Stardust: Server listening on ${port}`);
});
