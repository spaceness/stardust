import { auth } from "@/lib/auth";
import { getSession } from "@/lib/session/get-session";
import { sessionRunning } from "@/lib/session/session-running";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await auth();
	const fileName = req.nextUrl.searchParams.get("name");
	const { id, ip } = (await getSession(params.slug, userSession)) || {};
	if (!id || !ip) {
		return Response.json(["not found"], { status: 404 });
	}
	await sessionRunning(ip);
	if (fileName) {
		try {
			const download = await fetch(`http://${ip}:6080/files/download/${fileName}`);
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
	return fetch(`http://${ip}:6080/files/list`);
}
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await auth();
	const buffer = await req.arrayBuffer();
	const fileName = req.nextUrl.searchParams.get("name");
	const { id, ip } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	await fetch(`http://${ip}:6080/files/upload/${fileName}`, {
		method: "PUT",
		body: Buffer.from(buffer),
	});
	return Response.json({ success: true });
}
