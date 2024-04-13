import { relations } from "drizzle-orm";
import { bigint, boolean, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

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
export const userRelations = relations(user, ({ many }) => ({
	session: many(session),
}));
export const image = pgTable(
	"Image",
	{
		dockerImage: text("dockerImage").primaryKey().notNull(),
		friendlyName: text("friendlyName").notNull(),
		category: text("category").array(),
		icon: text("icon").notNull(),
		supportedArch: text("supportedArch").array(),
	},
	(table) => {
		return {
			dockerImageKey: uniqueIndex("Image_dockerImage_key").on(table.dockerImage),
		};
	},
);
export const imageRelations = relations(image, ({ many }) => ({
	session: many(session),
}));
export const session = pgTable("Session", {
	id: text("id").primaryKey().notNull(),
	dockerImage: text("dockerImage").notNull(),
	createdAt: bigint("createdAt", { mode: "number" }).notNull(),
	expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	vncPort: integer("vncPort").notNull(),
});
export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	image: one(image, {
		fields: [session.dockerImage],
		references: [image.dockerImage],
	}),
}));
