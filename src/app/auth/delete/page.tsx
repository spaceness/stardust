import { deleteUser } from "@/actions/user";
import { StyledSubmit } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signOut } from "@/lib/auth";
import { unstable_after } from "next/server";

export default async function Page() {
	const userSession = await auth();
	const delString = `I wish to delete ${userSession?.user.email}`;
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center gap-4">
			<CardDescription>Delete your account</CardDescription>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive" className="w-full">
						Get started
					</Button>
				</DialogTrigger>
				<DialogContent>
					<form
						className="flex flex-col gap-4"
						action={async (data) => {
							"use server";
							unstable_after(async () => deleteUser(userSession?.user.id as string, true));
							const delSure = data.get("delete-sure")?.toString();
							if (delSure !== delString) return;
							await signOut();
						}}
					>
						<DialogHeader>
							<DialogTitle>Are you sure you want to delete your account?</DialogTitle>
							<DialogDescription>
								Your account will be deleted and you will lose all sessions. After this action, you will be logged out.
							</DialogDescription>
						</DialogHeader>
						<Label htmlFor="delete-sure">Enter "{delString}"</Label>
						<Input
							id="delete-sure"
							name="delete-sure"
							required
							minLength={delString.length}
							maxLength={delString.length}
						/>
						<DialogFooter>
							<StyledSubmit>Continue</StyledSubmit>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</CardContent>
	);
}
