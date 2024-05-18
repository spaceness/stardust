// @ts-check
import NextBundleAnalyzer from "@next/bundle-analyzer";
import { execSync } from "node:child_process";
const withBundleAnalyzer = NextBundleAnalyzer();
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
		GIT_COMMIT: process.env.NODE_ENV === "production" ? execSync("git rev-parse HEAD").toString().trim() : "DEVELOP",
		BUILD_DATE: Date.now().toString(),
	},
	experimental: {
		typedRoutes: true,
		instrumentationHook: true,
		webpackBuildWorker: true,
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
	webpack(config, { webpack }) {
		config.module.rules.push({
			test: /\.node$/,
			loader: "node-loader",
		});
		config.plugins.push(
			new webpack.IgnorePlugin({
				resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
			}),
		);
		return config;
	},
};
let config = nextConfig;
if (process.env.ANALYZE) {
	config = withBundleAnalyzer(nextConfig);
}
export default config;
