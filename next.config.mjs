// @ts-check
import { verifyPatch } from "next-ws/server/index.js";

verifyPatch();
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
	experimental: {
		typedRoutes: true,
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
