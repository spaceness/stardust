import { getConfig } from "@/lib/config";
import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
import { headers } from "next/headers";
export default function Turnstile() {
	const config = getConfig();
	const host = headers().get("x-forwarded-host") || headers().get("host");
	const TurnstileComponent = (props: { siteKey: string }) => <BaseTurnstile {...props} />;
	if (
		config?.auth.turnstile?.siteKey &&
		(!config.auth.turnstile.hosts || config.auth.turnstile.hosts.includes(host as string))
	) {
		return <TurnstileComponent siteKey={config.auth.turnstile.siteKey} />;
	}
	return null;
}
