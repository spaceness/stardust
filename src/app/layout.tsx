import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });

export const metadata: Metadata = {
	title: {
		default: "Stardust",
		template: "%s | Stardust",
	},
	description: "Stardust is the platform for streaming isolated desktop containers.",
	openGraph: {
		title: "Stardust",
		description: "Stardust is the platform for streaming isolated desktop containers.",
		type: "website",
		url: "https://stardust.spaceness.one",
	},
};
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} ${jetbrains.variable}`}>
				<SessionProvider session={await auth()}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						themes={["light", "dark", "slate", "zinc"]}
						enableSystem
						disableTransitionOnChange
					>
						<Toaster richColors theme="system" position="top-center" />
						{children}
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
