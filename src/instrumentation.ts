import { providers } from "./lib/providers";
export async function register() {
	const provider = process.env.AUTH_PROVIDERS;
	if (!provider?.split(",").every((p) => providers.includes(p)))
		throw new Error("No provider specified in environment variables, or invalid provider specified");
	if (!process.env.DATABASE_URL) throw new Error("No database URL specified in environment variables");

	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("@/lib/session/purge");
	}
}
