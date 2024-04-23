import { execSync } from "node:child_process";
import fs from "node:fs";
import { getAuthSession } from "@/lib/auth";
import { getSession } from "@/lib/util/get-session";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { id } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	execSync(`docker exec ${id} mkdir -p /home/stardust/Downloads`);
	const files = execSync(`docker exec ${id} ls /home/stardust/Downloads`).toString().split("\n").filter(Boolean);
	return Response.json(files);
}
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	const { fileName } = await req.json();
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { id } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	try {
		const dirPath = `${process.cwd()}/.assets/uploads/${id}`;
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		execSync(`docker cp "${id}:/home/stardust/Downloads/${fileName}" "${dirPath}/${fileName}"`);
		const blob = new Blob([fs.readFileSync(`${dirPath}/${fileName}`)]);
		fs.unlinkSync(`${dirPath}/${fileName}`);
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
	const { id } = (await getSession(params.slug, userSession)) || {};
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	const dirPath = `${process.cwd()}/.assets/uploads/${id}`;
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
	const path = `${dirPath}/${fileName}`;
	fs.writeFileSync(path, Buffer.from(buffer));
	execSync(`docker exec ${id} mkdir -p /home/stardust/Uploads`);
	execSync(`docker cp "${path}" "${id}:/home/stardust/Uploads/${fileName}"`);
	fs.unlinkSync(`${dirPath}/${fileName}`);
	return Response.json({ success: true });
}
