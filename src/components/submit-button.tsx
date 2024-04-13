"use client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
export function StyledSubmit({ ...props }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} {...props}>
			{pending ? props.size === "icon" ? <Loader2 className="animate-spin" /> : "Loading..." : props.children}
		</Button>
	);
}
