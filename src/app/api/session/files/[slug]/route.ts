import { getAuthSession } from "@/lib/auth";
import { getSession } from "@/lib/util/get-session";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	if (!userSession) {
		return Response.json(["Unauthorized"], { status: 401 });
	}
	const { id, agentPort } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json(["not found"], { status: 404 });
	}
	const files: string[] = await fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/files/list`)
		.then((res) => res.json())
		.catch(() => [""]);
	return Response.json(files);
}
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	const fileName = req.nextUrl.searchParams.get("name");
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { id, agentPort } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	try {
		const blob = await fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/files/download/${fileName}`).then(
			(res) => res.blob(),
		);
		return new Response(blob, {
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
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	const buffer = await req.arrayBuffer();
	const fileName = req.nextUrl.searchParams.get("name");
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
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
