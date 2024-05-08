import { getAuthSession } from "@/lib/auth";
import { getSession } from "@/lib/session/get-session";
import { sessionRunning } from "@/lib/session/session-running";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	const fileName = req.nextUrl.searchParams.get("name");
	const { id, agentPort } = (await getSession(params.slug, userSession)) || {};
	if (!id || !agentPort) {
		return Response.json(["not found"], { status: 404 });
	}
	await sessionRunning(agentPort);
	if (fileName) {
		try {
			const download = await fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/files/download/${fileName}`);
			return new Response(download.body, {
				headers: {
					"Content-Disposition": `attachment; filename=${fileName}`,
					"Content-Type": "application/octet-stream",
				},
			});
		} catch (e) {
			console.error("Download failed: %e", e);
			return Response.json({ error: "Download failed" }, { status: 500 });
		}
	}
	return await fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/files/list`);
}
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	const buffer = await req.arrayBuffer();
	const fileName = req.nextUrl.searchParams.get("name");
	const { id, agentPort } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	await fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/files/upload/${fileName}`, {
		method: "PUT",
		body: Buffer.from(buffer),
	});
	return Response.json({ success: true });
}
