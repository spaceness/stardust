// @ts-check
import NextBundleAnalyzer from "@next/bundle-analyzer";
import { execSync } from "node:child_process";
const withBundleAnalyzer = NextBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });
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
		ppr: true,
		typedRoutes: true,
		instrumentationHook: true,
		webpackBuildWorker: true,
		reactCompiler: true,
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

export default withBundleAnalyzer(nextConfig);
