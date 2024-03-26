import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/schema";

export const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
export * from "./src/schema";
