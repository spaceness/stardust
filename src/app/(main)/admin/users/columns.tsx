"use client";
import { changeUserAdminStatus, deleteUser, deleteUserSessions, resetUserPassword } from "@/actions/user";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { StyledSubmit } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SelectUserRelation } from "@/lib/drizzle/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<SelectUserRelation>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
	},
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "id",
	},
	{
		accessorKey: "isAdmin",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
	},
	{
		accessorKey: "password",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Password" />,
		cell: ({ row }) => (row.original.password ? "Set" : "Not set"),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const [resetDialogOpen, setResetDialogOpen] = useState(false);
			const user = row.original;
			return (
				<>
					<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Reset password for {user.name || user.email}</DialogTitle>
							</DialogHeader>
							<form
								action={(data) =>
									toast.promise(() => resetUserPassword(user.id, data), {
										loading: "Resetting password...",
										success: "Password reset",
										error: "Failed to reset password",
									})
								}
								className="flex flex-col gap-2 w-full"
							>
								<Label htmlFor="new-password">New password</Label>
								<Input
									id="new-password"
									placeholder="New password"
									name="new-password"
									minLength={8}
									type="password"
									required
								/>
								<StyledSubmit>Submit</StyledSubmit>
							</form>
						</DialogContent>
					</Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={user.isAdmin}
								onCheckedChange={() =>
									toast.promise(() => changeUserAdminStatus(user.id, !user.isAdmin), {
										loading: "Changing user's admin status...",
										success: ({ admin }) => `Admin status changed to ${admin}`,
										error: (error) => `Failed to change admin status: ${error}`,
									})
								}
							>
								Admin
							</DropdownMenuCheckboxItem>
							<DropdownMenuItem
								onClick={() =>
									toast.promise(() => deleteUserSessions(user.id), {
										loading: "Deleting user's sessions...",
										success: "Sessions deleted",
										error: (error) => `Failed to delete sessions: ${error}`,
									})
								}
							>
								Delete user's sessions
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setResetDialogOpen((prev) => !prev)}>Reset password</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									toast.promise(() => deleteUser(user.id), {
										loading: "Deleting user...",
										success: "User deleted",
										error: (error) => `Failed to delete user: ${error}`,
									})
								}
							>
								Delete user
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
