import { db, user } from "@/lib/drizzle/db";
import { createId } from "@paralleldrive/cuid2";
import NextAuth from "next-auth";
import { config } from "./auth.config";
export const { auth, handlers, signIn, signOut } = NextAuth({
	callbacks: {
		async signIn({ profile }) {
			const { email, name } = profile || {};
			await db.transaction(async (tx) => {
				const id =
					(await tx.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email || "") }))?.id || createId();
				if (email) {
					await tx
						.insert(user)
						.values({ id, email, name })
						.onConflictDoUpdate({ target: user.id, set: { name, email } });
				}
			});
			return true;
		},
	},
	...config,
});
