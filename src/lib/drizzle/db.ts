import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const drizzleSingleton = () => drizzle(client, { schema });
// biome-ignore lint: this hack is for HMR to stop creating more instances
declare const globalThis: {
	db: ReturnType<typeof drizzleSingleton>;
} & typeof global;

const client = postgres(process.env.DATABASE_URL as string);
let db: ReturnType<typeof drizzleSingleton>;
if (process.env.NODE_ENV === "production") {
	db = drizzleSingleton();
} else {
	if (!globalThis.db) {
		globalThis.db = drizzleSingleton();
	}
	db = globalThis.db;
}
export { db, client };
export * from "./schema";
