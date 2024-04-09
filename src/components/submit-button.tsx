"use client";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
export function StyledSubmit({ ...props }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} {...props}>
			{pending ? "Loading..." : props.children}
		</Button>
	);
}
