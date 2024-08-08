declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}
import { createHash } from "node:crypto";
import { db, user as userSchema } from "@/lib/drizzle/db";
import { createId } from "@paralleldrive/cuid2";
import { verify } from "argon2";
import NextAuth, { type DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { config } from "./auth.config";
import { getConfig } from "./config";
import HuProvider from "./hu-provider";
const newProvider: Provider[] = [];
const { auth: authConfig } = getConfig();
if (authConfig.credentials) {
	const provider = authConfig.credentials.huDb
		? HuProvider
		: Credentials({
				credentials: {
					email: {},
					password: {},
				},
				async authorize(credentials) {
					if (!credentials.email || !credentials.password) {
						throw new Error("Invalid credentials");
					}
					const maybeUser = await db.query.user.findFirst({
						where: (user, { eq }) => eq(user.email, credentials.email as string),
					});
					if (!maybeUser) throw new Error("User not found");
					if (!maybeUser?.password) throw new Error("User does not have password signin enabled.");
					if (await verify(maybeUser.password, credentials.password as string)) {
						maybeUser.password = null;
						return maybeUser;
					}
					throw new Error("Invalid password");
				},
			});
	newProvider.push(provider);
}
export const { auth, handlers, signIn, signOut } = NextAuth({
	callbacks: {
		async signIn({ profile: { email, name } = {} }) {
			await db.transaction(async (tx) => {
				const currentUsers = await tx.query.user.findMany();
				const id =
					(
						await tx.query.user.findFirst({
							where: (user, { eq }) => eq(user.email, email || ""),
						})
					)?.id || createId();
				if (email) {
					await tx
						.insert(userSchema)
						.values({ id, email, name, isAdmin: currentUsers.length === 0 })
						.onConflictDoUpdate({
							target: userSchema.id,
							set: { name, email },
						});
				}
			});
			return true;
		},
		async jwt({ token, user: authUser }) {
			const { id } =
				(await db.query.user.findFirst({
					where: (user, { eq }) => eq(user.email, authUser?.email || ""),
				})) || {};
			if (id) token.id = id;
			if (!token.image) {
				token.image = `https://gravatar.com/avatar/${createHash("sha256")
					.update(authUser?.email?.toLowerCase() || "")
					.digest("hex")}?d=404&s=128`;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = token.id as string;
			session.user.image = token.image as string;
			return session;
		},
	},
	...config,
	providers: [...newProvider, ...config.providers],
});
