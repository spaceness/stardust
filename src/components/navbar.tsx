"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type SelectUser } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { ComputerIcon, Settings, Sparkles } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import ModeToggle from "./mode-toggle";

export default function Navigation({ dbUser, session }: { dbUser: SelectUser; session: Session | null }) {
	const { name, email, image } = session?.user || {};
	const navigationItems: {
		icon: React.ReactNode;
		label: string;
		href: string;
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
		<div className="fixed flex h-16 min-w-full items-center justify-between bg-background/90 px-6 backdrop-blur-md">
			<div className="flex items-center justify-start">
				<Sparkles />
				<span className="ml-2 mr-4 text-2xl font-bold">Stardust</span>
				<NavigationMenu className="flex items-center justify-start">
					<NavigationMenuList>
						{navigationItems.map((item, index) =>
							!item.adminOnly || (item.adminOnly && dbUser.isAdmin) ? (
								<NavigationMenuItem key={index}>
									<Link href={item.href} legacyBehavior passHref>
										<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
											<span className="mr-2 flex size-4 items-center justify-center">{item.icon}</span> {item.label}
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							) : null,
						)}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex justify-end gap-4">
				<ModeToggle />
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
								{dbUser.isAdmin && (
									<span className="flex items-center justify-center rounded-lg bg-primary px-2 py-[1px] text-xs font-bold text-primary-foreground">
										Admin
									</span>
								)}
							</span>
							<p className="text-xs font-light text-muted-foreground">{name ? email : name}</p>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/auth/logout">Log Out</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
