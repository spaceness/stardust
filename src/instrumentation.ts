import { getConfig } from "./lib/config";

export async function register() {
	if (!process.env.CONFIG) throw new Error("Configuration not loaded");
	const config = getConfig();
	if ((config.auth.credentials || config.auth.oauth) && config.auth.huDb)
		throw new Error("Cannot use credentials with HU authentication");
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("@/lib/session/purge");
	}
}
