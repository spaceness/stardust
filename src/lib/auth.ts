import { db, user } from "@/lib/drizzle/db";
import NextAuth from "next-auth";
import { config } from "./auth.config";
export const { auth, handlers, signIn, signOut } = NextAuth({
	callbacks: {
		async signIn({ profile }) {
			const { email, name, sub: id } = profile || {};
			if (email && id) {
				await db.insert(user).values({ id, email, name }).onConflictDoUpdate({ target: user.id, set: { name, email } });
			}
			return true;
		},
	},
	...config,
});
