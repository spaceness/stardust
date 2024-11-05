import { DiscordIcon, GitHubIcon, GitLabIcon, GoogleIcon, MattermostIcon } from "@/components/icons";
import { LogIn } from "lucide-react";
import type { NextAuthConfig } from "next-auth";
import type { OAuthUserConfig, OIDCUserConfig, Provider } from "next-auth/providers";
import Auth0 from "next-auth/providers/auth0";
import Authentik from "next-auth/providers/authentik";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import Mattermost from "next-auth/providers/mattermost";
import Okta from "next-auth/providers/okta";
import { getConfig } from "./config";
const { auth: authConfig } = getConfig();
const providerArgs = <T>(provider: string): OIDCUserConfig<T> | OAuthUserConfig<T> => ({
	clientId: authConfig.oauth?.providers[provider].clientId,
	clientSecret: authConfig.oauth?.providers[provider].clientSecret,
	issuer: authConfig.oauth?.providers[provider].issuer,
});
const providersList = {
	auth0: {
		provider: Auth0,
		Icon: LogIn,
	},
	discord: {
		provider: Discord,
		Icon: DiscordIcon,
	},
	github: {
		provider: GitHub,
		Icon: GitHubIcon,
	},
	google: {
		provider: Google,
		Icon: GoogleIcon,
	},
	gitlab: {
		provider: GitLab,
		Icon: GitLabIcon,
	},
	okta: {
		provider: Okta,
		Icon: LogIn,
	},
	authentik: {
		provider: Authentik,
		Icon: LogIn,
	},
	mattermost: {
		provider: Mattermost,
		Icon: MattermostIcon,
	},
} as const;

const providers: Provider[] = [];
for (const [name, { provider }] of Object.entries(providersList)) {
	if (authConfig.oauth && name in authConfig.oauth.providers)
		// @ts-expect-error This is fine
		providers.push(provider(providerArgs(name)));
}

const config: NextAuthConfig = {
	secret: authConfig.secret,
	trustHost: true,
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	providers,
};

export { providersList as providers, config };
