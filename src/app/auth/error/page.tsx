"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	return (
		<Card className="mx-auto flex h-[28rem] w-96 flex-col items-center justify-center">
			<CardTitle className="mx-auto mb-2 flex flex-col items-center justify-center">
				<ShieldX className="h-12 w-12" />
				There was an error logging in
			</CardTitle>
			<CardContent>
				<p className="text-center">
					An error occurred while trying to log in. Please try again.
					{error && (
						<span>
							<br />
							<span className="font-bold text-red-400">Error:</span> {error}
						</span>
					)}
				</p>
			</CardContent>
		</Card>
	);
}
