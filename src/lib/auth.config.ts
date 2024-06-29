import { AppleIcon, DiscordIcon, GitHubIcon, GitLabIcon, GoogleIcon } from "@/components/icons";
import { LogIn } from "lucide-react";
import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Apple from "next-auth/providers/apple";
import Auth0 from "next-auth/providers/auth0";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import Okta from "next-auth/providers/okta";
import type { FC, SVGProps } from "react";
const providersArray = process.env.AUTH_PROVIDERS?.split(",").filter(Boolean) || [];
const providersList: Record<string, { provider: Provider; Icon: FC<SVGProps<SVGSVGElement>> }> = {
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
	apple: {
		provider: Apple,
		Icon: AppleIcon,
	},
};

const providers: Provider[] = [];
for (const [name, { provider }] of Object.entries(providersList)) {
	if (providersArray.includes(name)) providers.push(provider);
}
const config: NextAuthConfig = {
	trustHost: true,
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	providers,
};

export { providersList as providers, config };
