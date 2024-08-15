import { getConfig } from "@/lib/config";
import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
import { headers } from "next/headers";
export default function Turnstile() {
	const config = getConfig();
	const host = headers().get("x-forwarded-host") || headers().get("host");
	if (
		config?.auth.turnstile?.siteKey &&
		(!config.auth.turnstile.hosts || config.auth.turnstile.hosts.includes(host as string))
	) {
		return <BaseTurnstile siteKey={config.auth.turnstile.siteKey} />;
	}
	return null;
}
