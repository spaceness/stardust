import { auth } from "@/lib/auth";
import docker from "@/lib/docker";
import { getSession } from "@/lib/session/get-session";
import { sessionRunning } from "@/lib/session/session-running";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await auth();
	const containerSession = await getSession(params.slug, userSession);
	if (!containerSession) {
		return Response.json({ exists: false, error: "Container not found" }, { status: 404 });
	}
	const container = docker.getContainer(containerSession.id);
	const { State } = await container.inspect();
	if (!State.Running) {
		await container.start();
	}
	if (State.Paused) {
		await container.unpause();
	}
	await sessionRunning(containerSession.ip);
	const password = await (await fetch(`http://${containerSession.ip}:6080/password`)).text();
	return Response.json({
		exists: true,
		password,
		url: `/websockify/${containerSession.id}`,
	});
}
export const dynamic = "force-dynamic";
