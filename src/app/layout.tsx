import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Session } from "./providers";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth.config";

import { Toaster } from "@/components/ui/toaster";

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
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authConfig);

	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<Session session={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Toaster />
						{children}
					</ThemeProvider>
				</Session>
			</body>
		</html>
	);
}
