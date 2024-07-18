import { readFileSync } from "node:fs";
import { getConfig } from "@/lib/config";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
process.env.CONFIG = readFileSync("./.config/config.json", "utf8");
export default defineConfig({
	dialect: "postgresql",
	out: "./src/lib/drizzle",
	schema: "./src/lib/drizzle/schema.ts",
	dbCredentials: {
		url: getConfig().databaseUrl,
	},
	verbose: true,
	strict: true,
});
