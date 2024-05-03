// @ts-check
import { execSync } from "node:child_process";
await import("next-ws/server/index.js").then((m) => m.verifyPatch());
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/**",
			},
		],
	},
	env: {
		GIT_COMMIT: execSync("git rev-parse HEAD").toString().trim(),
		BUILD_DATE: Date.now().toString(),
	},
	experimental: {
		typedRoutes: true,
		instrumentationHook: true,
		serverActions: {
			allowedOrigins: ["localhost:3000", "*.use.devtunnels.ms"],
		},
	},
	async redirects() {
		return [
			{
				source: "/api/auth/error",
				destination: "/auth/error",
				permanent: true,
			},
		];
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.node$/,
			loader: "node-loader",
		});
		return config;
	},
};

export default nextConfig;
