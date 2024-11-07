import { getConfig } from "@/lib/config";
import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
export default async function Turnstile() {
	const config = getConfig();
	if (config?.auth.turnstile?.siteKey) {
		return <BaseTurnstile siteKey={config.auth.turnstile.siteKey} />;
	}
	return null;
}
