// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "http.cat",
				port: "",
				pathname: "/**",
			},
		],
	},
	redirects: async () => {
		return [
			{
				source: "/api/auth/error",
				destination: "/auth/error",
				permanent: true,
			},
		];
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.node$/,
			loader: "node-loader",
		});
		return config;
	},
};

export default nextConfig;
