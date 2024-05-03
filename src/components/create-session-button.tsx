"use client";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createSession } from "@/lib/session";
import { useRouter } from "next/navigation";
export function CreateSessionButton({ image }: { image: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<Button
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					const toastId = toast.loading("Creating session...");
					await createSession(image)
						.then((session) => {
							if (!session) {
								throw new Error("Container not created");
							}
							toast.success("Session created", { id: toastId });
							router.push(`/view/${session[0].id}`);
						})
						.catch((err) => {
							toast.error(err.message, { id: toastId });
						});
				})
			}
		>
			{isPending ? "Loading..." : "Launch"}
		</Button>
	);
}
