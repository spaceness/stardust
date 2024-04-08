import {
	pgTable,
	uniqueIndex,
	text,
	boolean,
	integer,
} from "drizzle-orm/pg-core";

export const user = pgTable(
	"User",
	{
		email: text("email").notNull(),
		name: text("name"),
		isAdmin: boolean("isAdmin").default(false).notNull(),
		id: text("id").primaryKey().notNull(),
	},
	(table) => {
		return {
			emailKey: uniqueIndex("User_email_key").on(table.email),
		};
	},
);

export const session = pgTable("Session", {
	id: text("id").primaryKey().notNull(),
	dockerImage: text("dockerImage").notNull(),
	vncPort: integer("vncPort").notNull(),
	createdAt: text("createdAt").notNull(),
	expiresAt: text("expiresAt").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

export const image = pgTable(
	"Image",
	{
		dockerImage: text("dockerImage").primaryKey().notNull(),
		friendlyName: text("friendlyName").notNull(),
		category: text("category").array(),
		icon: text("icon").notNull(),
		pulled: boolean("pulled").default(false),
		supportedArch: text("supportedArch").array(),
	},
	(table) => {
		return {
			dockerImageKey: uniqueIndex("Image_dockerImage_key").on(
				table.dockerImage,
			),
		};
	},
);
