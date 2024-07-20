"use client";
import { changeUserAdminStatus, deleteUser, deleteUserSessions } from "@/actions/user";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SelectUserRelation } from "@/lib/drizzle/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		accessorKey: "isAdmin",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original;
			return (
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
			);
		},
	},
];
