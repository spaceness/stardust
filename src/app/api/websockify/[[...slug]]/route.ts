import authConfig from "@/lib/auth.config";
import docker from "@/lib/docker";
import { db, session, user } from "@/lib/drizzle/db";
import { getSession as getContainerSession } from "@/lib/util/get-session";
import { and, eq } from "drizzle-orm";
import { IncomingMessage } from "http";
import net from "net";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";
import type { WebSocket, WebSocketServer } from "ws";

export async function GET(_req: NextRequest, { params }: { params: { slug?: string } }) {
	const userSession = await getServerSession(authConfig);
	if (!userSession || !userSession.user) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (!params.slug) {
		return Response.json({ error: "Bad Request" }, { status: 400 });
	}
	const containerId = params.slug[0];
	const containerSession = await getContainerSession(containerId, userSession);
	if (!containerSession) {
		return Response.json({ exists: false, error: "Container not found" }, { status: 404 });
	}
	const container = docker.getContainer(containerSession.id);
	const containerIsPaused = (await container.inspect()).State.Paused;
	if (!containerSession) {
		return Response.json({ exists: false, error: "Container not found" }, { status: 404 });
	}
	return Response.json({ exists: true, paused: containerIsPaused });
}
export async function SOCKET(ws: WebSocket, req: IncomingMessage, _server: WebSocketServer) {
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
	const tcpSocket = net.connect(containerSession.vncPort, process.env.CONTAINER_HOST!);
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
