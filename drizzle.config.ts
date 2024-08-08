import { readFileSync } from "node:fs";
import type { Config } from "@/types/config";
import { defineConfig } from "drizzle-kit";
const config: Config = JSON.parse(readFileSync("./.config/config.json", "utf8"));
export default defineConfig({
	dialect: "postgresql",
	out: "./src/lib/drizzle",
	schema: "./src/lib/drizzle/schema.ts",
	dbCredentials: {
		url: config.databaseUrl,
	},
	verbose: true,
	strict: true,
});
