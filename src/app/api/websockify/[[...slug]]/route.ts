import net from "net";
export function GET() {
	return Response.json({ message: "Hello, World!" });
}
export function SOCKET(
	ws: import("ws").WebSocket,
	_request: import("http").IncomingMessage,
	_server: import("ws").WebSocketServer,
) {
	const tcpSocket = net.connect(5901, "localhost");
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
