import { readFileSync } from "node:fs";
import { Toaster } from "@/components/ui/sonner";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Session } from "./providers";
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
		url: "https://stardust.spaceness.one", // probably going to be a personal website for stardust,
	},
};
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const config = JSON.parse(readFileSync(`${process.cwd()}/config.json`, "utf-8"));
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} ${jetbrains.variable}  bg-center bg-fixed bg-cover`}
				style={{
					backgroundImage: `url(${config.style.backgroundImage})`,
				}}
			>
				<Session session={await getAuthSession()}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						themes={["light", "dark", "slate", "mocha"]}
						enableSystem
						disableTransitionOnChange
					>
						<Toaster richColors theme="system" position="top-center" />
						{children}
					</ThemeProvider>
				</Session>
			</body>
		</html>
	);
}
