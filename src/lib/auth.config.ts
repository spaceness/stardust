import Discord from "next-auth/providers/discord";
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
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
			const userExists = await prisma.user.findFirst({
				where: {
					id,
				},
			});
			if (!userExists && id && email) {
				await prisma.user.create({
					data: {
						email,
						id,
						name,
					},
				});
			} else {
				await prisma.user.update({
					where: {
						id,
					},
					data: {
						email,
						name,
					},
				});
			}
			return true;
		},
	},
	providers: [
		Discord({
			clientId: process.env.DISCORD_ID!,
			clientSecret: process.env.DISCORD_SECRET!,
		}),
		Github({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
};
export default config;
