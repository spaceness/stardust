import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { CreateSessionButton } from "@/components/create-session-button";
import { Button } from "@/components/ui/button";
import { db, image } from "@/lib/drizzle/db";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

export default async function Dashboard() {
	const images = await db.select().from(image);
	return (
		<div className="m-auto flex w-full flex-col p-4">
			<h1 className="text-2xl font-bold mb-6">Workspaces</h1>
			<section className="flex flex-wrap gap-2">
				<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
					{images.map((image) => (
						<Dialog key={image.dockerImage}>
							<DialogTrigger>
								<div className="relative w-64 aspect-[5/3] rounded-lg overflow-hidden shadow-lg bg-accent/40 backdrop-blur-lg group">
									<Image
										src={image.icon}
										alt={image.friendlyName}
										fill
										className="object-cover group-hover:scale-105 duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent" />
									<div className="absolute bottom-2 left-2 text-white flex flex-col">
										<h3 className="text-lg font-bold">{image.friendlyName}</h3>
										<p className="text-left text-sm text-muted-foreground">{image.category}</p>
									</div>
								</div>
							</DialogTrigger>
							<DialogContent className="flex md:flex-col flex-row justify-center gap-2">
								<DialogHeader>
									<DialogTitle>New Session</DialogTitle>
									<DialogDescription>Would you like to launch a new {image.friendlyName} session?</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button type="button" variant="secondary" className="hidden md:block">
											Close
										</Button>
									</DialogClose>
									<CreateSessionButton image={image.dockerImage} />
								</DialogFooter>
							</DialogContent>
						</Dialog>
					))}
				</Suspense>
			</section>
		</div>
	);
}
export const experimental_ppr = false;
