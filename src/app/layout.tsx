import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getConfig } from "@/lib/config";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });
const shouldDisplayMetadata = () => {
	const config = getConfig();
	return (
		config.metadataUrl &&
		(headers().get("x-forwarded-host") ?? headers().get("host"))?.includes(new URL(config.metadataUrl).host)
	);
};
export function generateMetadata(): Metadata {
	return {
		title: {
			default: "Stardust",
			template: "%s | Stardust",
		},
		description: shouldDisplayMetadata()
			? "Stardust is the platform for streaming isolated desktop containers."
			: undefined,
		openGraph: shouldDisplayMetadata()
			? {
					title: "Stardust",
					description: "Stardust is the platform for streaming isolated desktop containers.",
					type: "website",
					url: "https://stardust.spaceness.one",
				}
			: undefined,
	};
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} ${jetbrains.variable}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme={getConfig().auth.huDb ? "nord" : "system"}
					themes={["light", "dark", "nord", "zinc"]}
					enableSystem
					disableTransitionOnChange
				>
					<Toaster richColors theme="system" position="top-center" />
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
