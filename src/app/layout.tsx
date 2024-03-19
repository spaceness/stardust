import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "stardust",
	description: "Open source kasm alternative powered by spaceness",
	openGraph: {
		title: "stardust",
		description: "Open source kasm alternative powered by spaceness",
		type: "website",
		url: "https://stardust.spaceness.one", // probably going to be a personal website for stardust,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
