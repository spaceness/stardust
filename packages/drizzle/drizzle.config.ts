import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
	driver: "pg",
	out: "./src",
	schema: "./src/schema.ts",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
};
export default config;
