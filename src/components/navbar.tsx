"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { SelectUser } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { ComputerIcon, HelpCircle, LogOut, Settings, Sparkles, SwatchBook, User } from "lucide-react";
import type { Route } from "next";
import type { Session } from "next-auth";
import Link from "next/link";
import { Fragment } from "react";
import { useTheme } from "next-themes";

export default function Navigation({ dbUser, session }: { dbUser: SelectUser; session: Session | null }) {
	const { name, email, image } = session?.user || {};
	const { themes, setTheme } = useTheme();
	const navigationItems: {
		icon: React.ReactNode;
		label: string;
		href: Route;
		adminOnly: boolean;
	}[] = [
		{
			icon: <ComputerIcon />,
			label: "Dashboard",
			href: "/",
			adminOnly: false,
		},
		{
			label: "Admin",
			href: "/admin",
			icon: <Settings />,
			adminOnly: true,
		},
	];
	return (
		<nav className="flex h-16 min-w-full items-center justify-between bg-transparent p-4">
			<div className="flex items-center justify-start gap-2">
				<Sparkles />
				<span className="text-2xl font-bold md:block hidden mr-2">Stardust</span>
				<NavigationMenu className="flex items-center justify-start">
					<NavigationMenuList>
						{navigationItems.map((item) => (
							<Fragment key={item.href}>
								{!item.adminOnly || (item.adminOnly && dbUser.isAdmin) ? (
									<NavigationMenuItem key={item.href}>
										<Link href={item.href} legacyBehavior passHref>
											<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
												<span className="mr-2 flex size-4 items-center justify-center">{item.icon}</span> {item.label}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								) : null}
							</Fragment>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src={image || ""} />
							<AvatarFallback>{name ? name?.charAt(0) : email?.charAt(0)}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="mr-4 mt-4 w-48">
						<DropdownMenuLabel className="flex flex-col">
							<span className="flex flex-row items-center justify-between gap-1">
								<p className="text-lg">{name || email}</p>
								{dbUser.isAdmin ? (
									<span className="flex items-center justify-center rounded-lg bg-primary px-2 py-[1px] text-xs font-bold text-primary-foreground">
										Admin
									</span>
								) : null}
							</span>
							<p className="text-xs font-light text-muted-foreground">{name ? email : name}</p>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className="size-4 mr-2" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<SwatchBook className="size-4 mr-2" />
								<span>Theme</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									{themes.map((theme) => (
										<DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
											{theme.charAt(0).toUpperCase() + theme.slice(1)}
										</DropdownMenuItem>
									))}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem asChild>
							<a href="https://stardust.spaceness.one/docs" target="_blank" rel="noreferrer nopener">
								<HelpCircle className="size-4 mr-2" />
								<span>Help</span>
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/auth/logout">
								<LogOut className="size-4 mr-2" />

								<span>Log Out</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
}
