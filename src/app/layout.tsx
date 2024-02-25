import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/route";
import { GeistSans } from "geist/font/sans";
import { Computer, Settings } from "@/components/icons";
import "./globals.css";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuMainLink,
} from "@/components/ui/navigation-menu";
const session = await getServerSession(authOptions);
const navItems: {
	name: string;
	href: string;
	icon: React.ReactNode;
}[] = [
	{
		name: "Workspaces",
		href: "/",
		icon: <Computer className="mr-3" />,
	},
	{
		name: "Settings",
		href: "/settings",
		icon: <Settings className="mr-3" />,
	},
];
const fontSans = GeistSans;
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
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={`${fontSans.className} overflow-scroll bg-[url('/images/background.webp')] bg-cover`}
			>
				<NavigationMenu className="fixed left-1/2 top-12 -translate-x-1/2">
					<NavigationMenuList>
						{navItems.map((item, key) => (
							<NavigationMenuItem key={key}>
								<NavigationMenuMainLink
									href={item.href}
									className="flex items-center justify-center"
								>
									{item.icon}
									{item.name}
								</NavigationMenuMainLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
				{children}
			</body>
		</html>
	);
}
