import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
	driver: "pg",
	out: "./src/lib/drizzle",
	schema: "./src/lib/drizzle/schema.ts",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
};
export default config;
