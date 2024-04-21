import { Toaster } from "@/components/ui/sonner"
import { getAuthSession } from "@/lib/auth"
import { readFileSync } from "node:fs"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { Session } from "./providers"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Stardust",
	description: "Stardust is the platform for streaming isolated desktop containers.",
	openGraph: {
		title: "Stardust",
		description: "Stardust is the platform for streaming isolated desktop containers.",
		type: "website",
		url: "https://stardust.spaceness.one", // probably going to be a personal website for stardust,
	},
}
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const config = JSON.parse(readFileSync(`${process.cwd()}/config.json`, "utf-8"))
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} bg-cover bg-fixed`}
				style={{
					backgroundImage: `url(${config.style.backgroundImage})`,
				}}
			>
				<Session session={await getAuthSession()}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						themes={["light", "dark", "mocha", "macchiato", "frappe", "latte"]}
						enableSystem
						disableTransitionOnChange
					>
						<Toaster richColors theme="dark" position="top-center" />
						{children}
					</ThemeProvider>
				</Session>
			</body>
		</html>
	)
}
