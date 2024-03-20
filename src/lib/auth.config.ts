import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
const config: NextAuthOptions = {
	pages: {
		signIn: "/auth/login",
		verifyRequest: "/auth/verify",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	callbacks: {
		signIn: async ({ profile }) => {
			const { email, name, sub: id } = profile || {};
			const userExists = await prisma.user.findUnique({
				where: {
					id,
				},
			});
			if (!userExists && email && id) {
				await prisma.user.create({
					data: {
						id,
						email,
						name,
					},
				});
			} else {
				await prisma.user.update({
					where: {
						id,
					},
					data: {
						name,
						email,
					},
				});
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
export default config;
