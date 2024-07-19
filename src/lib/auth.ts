import { db, user as userSchema } from "@/lib/drizzle/db";
import { createId } from "@paralleldrive/cuid2";
import { verify } from "argon2";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { config } from "./auth.config";
import { getConfig } from "./config";
const newProvider: Provider[] = [];
const { auth: authConfig } = getConfig();
if (authConfig.credentials) {
	const provider = Credentials({
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
			if (await verify(maybeUser.password as string, credentials.password as string)) {
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
		async signIn({ profile }) {
			const { email, name } = profile || {};
			await db.transaction(async (tx) => {
				const id =
					(await tx.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email || "") }))?.id || createId();
				if (email) {
					await tx
						.insert(userSchema)
						.values({ id, email, name })
						.onConflictDoUpdate({ target: userSchema.id, set: { name, email } });
				}
			});
			return true;
		},
	},
	...config,
	providers: [...newProvider, ...config.providers],
});
