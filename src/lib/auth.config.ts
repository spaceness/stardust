import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Auth0 from "next-auth/providers/auth0";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
const providersArray = process.env.AUTH_PROVIDERS?.split(",").filter(Boolean) || [];
const providerMap: Record<string, Provider> = {
	auth0: Auth0,
	discord: Discord,
	github: GitHub,
};

const providers: Provider[] = [];
for (const [name, provider] of Object.entries(providerMap)) {
	if (providersArray.includes(name)) providers.push(provider);
}
export const config: NextAuthConfig = {
	trustHost: true,
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	providers,
};
