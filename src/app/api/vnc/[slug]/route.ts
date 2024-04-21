import { getAuthSession } from "@/lib/auth"
import docker from "@/lib/docker"
import { getSession as getContainerSession } from "@/lib/util/get-session"
import type { IncomingMessage } from "node:http"
import net from "node:net"
import { getSession } from "next-auth/react"
import type { NextRequest } from "next/server"
import type { WebSocket, WebSocketServer } from "ws"

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession()
	if (!userSession || !userSession.user) {
		return Response.json({ error: "Unauthorized" }, { status: 401 })
	}
	const containerSession = await getContainerSession(params.slug, userSession)
	if (!containerSession) {
		return Response.json({ exists: false, error: "Container not found" }, { status: 404 })
	}
	const container = docker.getContainer(containerSession.id)
	const { State } = await container.inspect()
	if (!State.Running) {
		await container.start()
	}
	return Response.json({ exists: true, paused: State.Paused })
}
export async function SOCKET(ws: WebSocket, req: IncomingMessage, _server: WebSocketServer) {
	const containerId = req.url?.split("/")[3]
	if (!containerId) {
		ws.close()
		return
	}
	const userSession = await getSession({ req })
	if (!userSession || !userSession.user) {
		ws.close()
		return
	}
	const containerSession = await getContainerSession(containerId, userSession)
	if (!containerSession) {
		ws.close()
		return
	}
	const tcpSocket = net.connect(containerSession.vncPort, process.env.CONTAINER_HOST as string)
	ws.on("message", (message: Uint8Array) => {
		tcpSocket.write(message)
	})
	ws.on("close", (code, reason) => {
		console.log(`Connection closed due to ${reason} with code ${code}`)
		tcpSocket.end()
	})

	tcpSocket.on("data", (data) => {
		ws.send(data)
	})

	tcpSocket.on("error", (err) => {
		console.error(err)
		ws.close()
	})

	tcpSocket.on("close", () => {
		ws.close()
	})
}
