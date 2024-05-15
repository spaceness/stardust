import { auth } from "@/lib/auth";
import { getSession } from "@/lib/session/get-session";
import { sessionRunning } from "@/lib/session/session-running";
import type { NextRequest } from "next/server";
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await auth();
	const { agentPort } = (await getSession(params.slug, userSession)) || {};
	if (!agentPort) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	await sessionRunning(agentPort);
	return fetch(`http://${process.env.CONTAINER_HOST}:${agentPort}/screenshot`);
}
