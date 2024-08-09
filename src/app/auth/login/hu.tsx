"use client";
import { StyledSubmit } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { checkCode, logIn, otpCheck } from "./action";

export default function HuLogin() {
	const formData = useRef<FormData | null>(null);
	const formRef = useRef<HTMLFormElement | null>(null);
	const [otp, setOtp] = useState(false);
	const [otpVal, setOtpVal] = useState("");
	const [otpMessage, setOtpMessage] = useState("");
	useEffect(() => {
		if (formData.current) formData.current.set("otp", otpVal);
	}, [otpVal]);
	useEffect(() => {
		(async () => {
			if (otpVal.length === 6 && formData.current) {
				const check = await checkCode(formData.current, otpVal);
				if (check) {
					logIn(formData.current);
				} else {
					setOtpMessage("Invalid OTP");
				}
			}
		})();
	}, [otpVal]);
	return (
		<form
			className="mx-auto mb-4 flex w-full flex-col items-start justify-center gap-2"
			ref={formRef}
			onSubmit={async (e) => {
				e.preventDefault();
				if (!formData.current) {
					formData.current = new FormData(e.currentTarget);
				}
				const check = await otpCheck(formData.current);
				setOtp(check);
				if (!check || formData.current.has("otp")) {
					logIn(formData.current);
				}
			}}
		>
			{!otp ? (
				<>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="Email"
						autoComplete="email"
						required
						className="w-full"
					/>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Password"
						autoComplete="current-password"
						required
						className="w-full"
					/>
				</>
			) : (
				<div className="flex flex-col items-center gap-2 w-full mt-4">
					<Label htmlFor="otp">One-Time Password</Label>
					<InputOTP maxLength={6} id="otp" value={otpVal} onChange={setOtpVal} className="w-full">
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
					{otpMessage ? <div className="text-destructive">{otpMessage}</div> : null}
					<div className="text-xs">Please enter the one-time password sent to your phone.</div>
				</div>
			)}
			{!otp ? <StyledSubmit className="w-full">Log in</StyledSubmit> : null}
		</form>
	);
}
