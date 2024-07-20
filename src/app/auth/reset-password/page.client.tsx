"use client";
import { StyledSubmit } from "@/components/submit-button";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SelectUser } from "@/lib/drizzle/db";
import { toast } from "sonner";
import { resetPassword } from "./action";

export default function Page({ authUser }: { authUser: SelectUser | undefined }) {
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>{authUser?.password ? "Reset" : "Set"} your password</CardDescription>
			<form
				className="mx-auto my-4 flex w-full flex-col items-start justify-center gap-2"
				action={(data) =>
					toast.promise(() => resetPassword(authUser, data), {
						loading: "Setting password...",
						success: "Password set!",
						error: "Failed to set password",
					})
				}
			>
				<input type="text" name="email" value={authUser?.email} autoComplete="email" className="hidden" />
				{authUser?.password ? (
					<>
						<Label htmlFor="old-password">Old Password</Label>
						<Input
							required
							id="old-password"
							type="password"
							name="old-password"
							placeholder="Old Password"
							autoComplete="current-password"
							className="w-full"
						/>
					</>
				) : null}
				<Label htmlFor="new-password">New Password</Label>
				<Input
					required
					minLength={8}
					id="new-password"
					type="password"
					name="new-password"
					placeholder="New Password"
					autoComplete="new-password"
					className="w-full"
				/>
				<Label htmlFor="confirm-password">Confirm Password</Label>
				<Input
					required
					minLength={8}
					id="confirm-password"
					type="password"
					name="confirm-password"
					placeholder="Confirm Password"
					autoComplete="new-password"
					className="w-full"
				/>
				<StyledSubmit className="w-full">{authUser?.password ? "Reset" : "Set"} Password</StyledSubmit>
			</form>
		</CardContent>
	);
}
