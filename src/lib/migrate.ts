import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./drizzle/db";

await migrate(db, { migrationsFolder: `${process.cwd()}/src/lib/drizzle` });
await client.end();
