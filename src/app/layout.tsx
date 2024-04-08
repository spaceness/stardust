import { Toaster } from "@/components/ui/toaster";
import authConfig from "@/lib/auth.config";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { Session } from "./providers";

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
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Session session={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						themes={["light", "dark", "mocha", "macchiato", "frappe", "latte"]}
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
