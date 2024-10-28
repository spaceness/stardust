export async function register() {
	if (!process.env.CONFIG) throw new Error("Configuration not loaded");
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("@/lib/session/purge");
	}
}
