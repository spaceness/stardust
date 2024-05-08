"use client";
import { createSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
export function CreateSessionButton({ image }: { image: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<Button
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					await createSession(image)
						.then((session) => {
							if (!session) {
								throw new Error("Container not created");
							}
							router.push(`/view/${session[0].id}`);
						})
						.catch((err) => {
							toast.error(err.message);
						});
				})
			}
		>
			{isPending ? "Loading..." : "Launch"}
		</Button>
	);
}
