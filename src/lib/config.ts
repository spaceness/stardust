import type { Config } from "@/types/config";
export function getConfig(): Config {
	return JSON.parse(process.env.CONFIG as string);
}
