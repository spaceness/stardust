import { db } from "@repo/drizzle";
import { user } from "@repo/drizzle";
import { NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
const authConfig: NextAuthOptions = {
	pages: {
		signIn: "/auth/login",
		verifyRequest: "/auth/verify",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	callbacks: {
		signIn: async ({ profile }) => {
			const { email, name, sub: id } = profile || {};
			if (email && id) {
				await db
					.insert(user)
					.values({ id, email, name })
					.onConflictDoUpdate({ target: user.id, set: { name, email } });
			}
			return true;
		},
	},
	providers: [
		Auth0({
			clientId: process.env.AUTH0_ID!,
			clientSecret: process.env.AUTH0_SECRET!,
			issuer: process.env.AUTH0_ISSUER,
		}),
	],
};
export default authConfig;
