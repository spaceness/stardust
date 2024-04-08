CREATE TABLE IF NOT EXISTS "Image" (
	"dockerImage" text PRIMARY KEY NOT NULL,
	"friendlyName" text NOT NULL,
	"category" text[],
	"icon" text NOT NULL,
	"pulled" boolean DEFAULT false,
	"supportedArch" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"dockerImage" text NOT NULL,
	"createdAt" integer NOT NULL,
	"expiresAt" integer NOT NULL,
	"userId" text NOT NULL,
	"vncPort" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"email" text NOT NULL,
	"name" text,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "createdAt" integer USING "createdAt"::integer;
ALTER TABLE "Session" ALTER COLUMN "expiresAt" integer USING "expiresAt"::integer;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Image_dockerImage_key" ON "Image" ("dockerImage");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
