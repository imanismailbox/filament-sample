import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Checkbox from "@/Components/Checkbox";

interface DataTableProps<T> {
    columns: { key: keyof T; label: string }[];
    data: T[];
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    selectedItems: number[];
    onSelectItem: (id: number, checked: boolean) => void;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function DataTable<T extends { id: number }>({
    columns,
    data,
    onEdit,
    onDelete,
    selectedItems,
    onSelectItem,
    onSelectAll,
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}: DataTableProps<T>) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={selectedItems.length === data.length}
                                onChange={onSelectAll}
                            />
                        </TableHead>
                        {columns.map((column) => (
                            <TableHead key={column.key as string}>
                                {column.label}
                            </TableHead>
                        ))}
                        <TableHead className="text-right">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedItems.includes(item.id)}
                                    onChange={(e) =>
                                        onSelectItem(item.id, e.target.checked)
                                    }
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column.key as string}>
                                    {item[column.key] as React.ReactNode}
                                </TableCell>
                            ))}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => onEdit(item)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(item)}
                                            className="text-red-500"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} entries
                </div>
                <div>
                    <Button
                        className="mr-2"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
