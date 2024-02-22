import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
export default function Settings() {
	return (
		<main className="mx-auto flex min-h-screen items-center justify-center">
			<Card className="mx-auto flex h-[576px] w-[576px] flex-col items-center justify-center p-0">
				<h2 className="text-3xl font-bold text-text-primary">Settings</h2>
				<section className="flex flex-col justify-center gap-4 p-6">
					<label className="text-text-primary">Reset Password</label>
					<Input
						type="password"
						className="w-96 text-text-primary"
						placeholder="New Password"
					/>
					<Button className="w-48" variants={{ variant: "primary" }}>
						Reset Password
					</Button>
					<label className="text-text-primary">Cloaking</label>
					<Select>
						<SelectTrigger className="text-text-primary">
							<SelectValue placeholder="Select a cloaking site" />
						</SelectTrigger>
						<SelectContent className="text-text-primary">
							<SelectItem value="schoology">Schoology</SelectItem>
							<SelectItem value="classroom">Google Classroom</SelectItem>
							<SelectItem value="canvas">Canvas</SelectItem>
						</SelectContent>
					</Select>
				</section>
			</Card>
		</main>
	);
}
