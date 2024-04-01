import net from "net";
import type { WebSocket, WebSocketServer } from "ws";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
export async function GET() {
	return new Response("Hello World");
}
export async function SOCKET(
	ws: WebSocket,
	request: IncomingMessage,
	_server: WebSocketServer,
) {
	const session = await getSession({
		req: request,
	});
	if (!session) {
		ws.close();
		return;
	}
	const tcpSocket = net.connect(5900, "localhost");
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
