"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export default function SignOut() {
	const router = useRouter();
	const { toast } = useToast();

	return (
		<>
			<CardContent>
				<p>Are you sure you want to log out?</p>
				<Button
					className="mt-6 w-full"
					onClick={async () => {
						await signOut();
						toast({
							title: "Logged out",
							description: "You have been logged out",
						});
						router.push("/auth/login");
					}}
				>
					<LogOut className="mr-2 size-4" /> Log out
				</Button>
			</CardContent>
		</>
	);
}
