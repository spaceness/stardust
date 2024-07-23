import { addImage } from "@/actions/image";
import { StyledSubmit } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SelectImage } from "@/lib/drizzle/schema";
export function ManageForm({
	showState,
	setShowState,
	trigger = true,
	updateValue,
}: {
	showState?: boolean;
	setShowState?: (v: boolean) => void;
	trigger?: boolean;
	updateValue?: SelectImage;
}) {
	return (
		<Dialog
			open={typeof showState === "boolean" ? showState : undefined}
			onOpenChange={typeof setShowState === "function" ? setShowState : undefined}
		>
			{trigger ? (
				<DialogTrigger asChild>
					<Button className="ml-2">Add Image</Button>
				</DialogTrigger>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{updateValue ? `Edit ${updateValue?.dockerImage}` : "Add Image"}</DialogTitle>
					<DialogDescription>The image will automatically save after you click the button.</DialogDescription>
				</DialogHeader>
				<form action={addImage} className="flex flex-col gap-2 w-full">
					<Label htmlFor="name">Name</Label>
					<Input
						defaultValue={updateValue?.friendlyName}
						id="name"
						placeholder="Name"
						name="friendlyName"
						minLength={2}
						required
					/>
					<Label htmlFor="cat">Category (comma seperated)</Label>
					<Input
						defaultValue={updateValue?.category?.join(", ")}
						id="cat"
						placeholder="Category"
						name="category"
						required
					/>
					{!updateValue ? (
						<>
							<Label htmlFor="img">Docker pull URL</Label>
							<Input id="img" placeholder="ghcr.io/spaceness/xxxx" name="dockerImage" required />
						</>
					) : (
						<input hidden readOnly value={updateValue?.dockerImage} name="dockerImage" />
					)}

					<Label htmlFor="icon">Icon</Label>
					<Input defaultValue={updateValue?.icon} id="icon" placeholder="Icon URL" name="icon" required />
					<div className="flex gap-2">
						<Checkbox id="update" name="repull" defaultChecked={!updateValue} />
						<Label htmlFor="update">{updateValue ? "Update image" : "Pull image"}</Label>
					</div>
					<StyledSubmit>Save</StyledSubmit>
				</form>
			</DialogContent>
		</Dialog>
	);
}
