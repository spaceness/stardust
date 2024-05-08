"use client";
import { Suspense } from "react";
import { useHydration } from "@/hooks/use-hydration";

export function SessionDate({ expiresAt }: { expiresAt: Date }) {
	const hydrated = useHydration();
	return (
		<Suspense key={hydrated ? "hydrated" : "server"}>
			<p className="text-xs text-muted-foreground">
				Expires at {`${expiresAt.toLocaleTimeString()} on ${expiresAt.toLocaleDateString("en-US")}`}
				{hydrated ? "" : " (UTC)"}
			</p>
		</Suspense>
	);
}
