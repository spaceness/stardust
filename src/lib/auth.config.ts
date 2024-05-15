import type { NextAuthConfig } from "next-auth";
import Auth0 from "next-auth/providers/auth0";

export const config: NextAuthConfig = {
	trustHost: true,
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	providers: [
		Auth0({
			clientId: process.env.AUTH0_ID as string,
			clientSecret: process.env.AUTH0_SECRET as string,
			issuer: process.env.AUTH0_ISSUER,
		}),
	],
};
