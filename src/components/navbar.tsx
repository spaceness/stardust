"use client";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ComputerIcon, Settings, Sparkles } from "lucide-react";
export default function Navigation() {
	const navigationItems: {
		icon: React.ReactNode;
		label: string;
		href: string;
	}[] = [
		{
			icon: <ComputerIcon />,
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Admin",
			href: "/Dashboard",
			icon: <Settings />,
		},
	];
	return (
		<div className="fixed flex h-16 min-w-full items-center justify-between border-b px-6 backdrop-blur-md">
			<div className="flex items-center justify-center">
				<Sparkles />
				<span className="ml-2 text-2xl font-bold">Stardust</span>
			</div>
			<NavigationMenu>
				<NavigationMenuList>
					{navigationItems.map((item, index) => (
						<NavigationMenuItem key={index}>
							<Link href={item.href} legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									<span className="mr-2 flex size-4 items-center justify-center">
										{item.icon}
									</span>{" "}
									{item.label}
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
