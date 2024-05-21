"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Container, Layers, LayoutDashboard, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
	const pathname = usePathname();
	const links: {
		href: Route;
		label: string;
		Icon: LucideIcon;
	}[] = [
		{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
		{ href: "/admin/users", label: "Users", Icon: Users },
		{ href: "/admin/images", label: "Images", Icon: Layers },
		{ href: "/admin/sessions", label: "Sessions", Icon: Container },
	];
	return (
		<nav className="z-50">
			<Separator />
			<div className="w-20">
				<section className="w-[4.5rem] h-full fixed p-4 border-r items-start flex flex-col gap-2">
					<TooltipProvider>
						{links.map(({ href, label, Icon }) => (
							<Tooltip key={href}>
								<TooltipTrigger asChild>
									<Button
										asChild
										variant="ghost"
										size="icon"
										className={
											pathname === href
												? "text-primary bg-secondary hover:text-primary"
												: "text-muted-foreground hover:text-primary"
										}
									>
										<Link href={href}>
											<Icon className="size-5" />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right">{label}</TooltipContent>
							</Tooltip>
						))}
					</TooltipProvider>
				</section>
			</div>
		</nav>
	);
}
