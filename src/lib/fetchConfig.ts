export default async function fetchConfig(host: string | null) {
	const proxy: "https" | "http" =
		process?.env.SSL === "true" ? "https" : "http";
	const config = await fetch(`${proxy}://${host}/api/config`).then((res) =>
		res.json(),
	);
	return config;
}
