import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	out: "./src/lib/drizzle",
	schema: "./src/lib/drizzle/schema.ts",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
});
