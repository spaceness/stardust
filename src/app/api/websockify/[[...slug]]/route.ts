import net from "net";
import type { WebSocket, WebSocketServer } from "ws";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
import { db } from "@/lib/drizzle/db";
import { session, user } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
export async function GET() {
	return new Response("This is stardust's websockify thing", { status: 426 });
}
export async function SOCKET(
	ws: WebSocket,
	req: IncomingMessage,
	_server: WebSocketServer,
) {
	const containerId = req.url?.split("/")[3];
	if (!containerId) {
		ws.close();
		return;
	}
	const userSession = await getSession({ req });
	if (!userSession || !userSession.user) {
		ws.close();
		return;
	}
	const { userId } = (
		await db
			.select({
				userId: user.id,
			})
			.from(user)
			.where(eq(user.email, userSession.user.email as string))
	)[0];
	const containerSession = (
		await db
			.select()
			.from(session)
			.where(and(eq(session.id, containerId), eq(session.userId, userId)))
	)[0];
	if (!containerSession) {
		ws.close();
		return;
	}
	const tcpSocket = net.connect(containerSession.vncPort, "localhost");
	ws.on("message", (message: Uint8Array) => {
		tcpSocket.write(message);
	});
	ws.on("close", (code, reason) => {
		console.log(`Connection closed due to ${reason} with code ${code}`);
		tcpSocket.end();
	});

	tcpSocket.on("data", (data) => {
		ws.send(data);
	});

	tcpSocket.on("error", (err) => {
		console.error(err);
		ws.close();
	});

	tcpSocket.on("close", () => {
		ws.close();
	});
}
