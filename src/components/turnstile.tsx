import { getConfig } from "@/lib/config";
import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
import { headers } from "next/headers";
export default async function Turnstile() {
	const config = getConfig();
	const headersList = await headers();
	const host = headersList.get("x-forwarded-host") || headersList.get("host");
	if (
		config?.auth.turnstile?.siteKey &&
		(!config.auth.turnstile.hosts || config.auth.turnstile.hosts.includes(host as string))
	) {
		return <BaseTurnstile siteKey={config.auth.turnstile.siteKey} />;
	}
	return null;
}
