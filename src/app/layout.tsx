import { Toaster } from "@/components/ui/sonner";
import authConfig from "@/lib/auth.config";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { Session } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Stardust",
	description: "Stardust is the platform for streaming isolated desktop containers.",
	openGraph: {
		title: "Stardust",
		description: "Stardust is the platform for streaming isolated desktop containers.",
		type: "website",
		url: "https://stardust.spaceness.one", // probably going to be a personal website for stardust,
	},
};
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Session session={await getServerSession(authConfig)}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						themes={["light", "dark", "mocha", "macchiato", "frappe", "latte"]}
						enableSystem
						disableTransitionOnChange
					>
						<Toaster richColors theme="dark" position="top-right" />
						{children}
					</ThemeProvider>
				</Session>
			</body>
		</html>
	);
}
