import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
export default function Turnstile() {
	return process.env.TURNSTILE_SITEKEY ? <BaseTurnstile siteKey={process.env.TURNSTILE_SITEKEY} /> : null;
}
