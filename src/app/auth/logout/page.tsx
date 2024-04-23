"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignOut() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	return (
		<CardContent>
			<p className="text-center">Are you sure you want to log out?</p>
			<Button
				disabled={loading}
				className="mt-6 w-full"
				onClick={async () => {
					setLoading(true);
					await signOut();
					toast("You have been logged out");
					router.push("/auth/login");
				}}
			>
				{!loading ? <LogOut className="mr-2 size-4" /> : <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
				{loading ? "Logging out" : "Log out"}
			</Button>
			<Button
				disabled={loading}
				variant="outline"
				className="mt-4 w-full bg-background/50 transition-all duration-200 hover:bg-background/65"
				onClick={() => router.back()}
			>
				<ChevronLeft className="mr-2 size-4" />
				Go back
			</Button>
		</CardContent>
	);
}
