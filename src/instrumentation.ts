import { providers } from "@/lib/auth.config";
export async function register() {
  const provider = process.env.AUTH_PROVIDERS;
  if (!provider?.split(",").every((p) => Object.keys(providers).includes(p)))
    throw new Error("No provider specified in environment variables, or invalid provider specified");
  if (!process.env.DATABASE_URL) throw new Error("No database URL specified in environment variables");
  if (!process.env.AUTH_SECRET) throw new Error("No auth secret specified in environment variables");
  if (!process.env.DOCKER_NETWORK) throw new Error("No docker network specified in environment variables");
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/session/purge");
  }
}
