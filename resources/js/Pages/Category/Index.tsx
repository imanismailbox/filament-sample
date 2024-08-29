import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { useState } from "react";
import { Switch } from "@/Components/ui/switch";

import type { Category } from "@/types/category";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import Checkbox from "@/Components/Checkbox";

export default function Index({
    auth,
    categories,
}: PageProps<{ categories: Category[] }>) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] =
        useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [autoSlug, setAutoSlug] = useState(true);
    const [sortColumn, setSortColumn] = useState<keyof Category>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedCategories(
                paginatedCategories.map((category) => category.id)
            );
        } else {
            setSelectedCategories([]);
        }
    };
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: "",
        slug: "",
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        setData({
            name: category.name,
            slug: category.slug,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("categories.store"), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
                toast.success("Category Created", {
                    description: "The category has been successfully created.",
                });
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            put(route("categories.update", selectedCategory.id), {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    reset();
                    toast.success("Category Updated", {
                        description:
                            "The category has been successfully updated.",
                    });
                },
            });
        }
    };

    const submitDelete = () => {
        if (selectedCategory) {
            destroy(route("categories.destroy", selectedCategory.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success("Category Deleted", {
                        description:
                            "The category has been successfully deleted.",
                        action: "close",
                    });
                },
            });
        }
    };

    const submitBatchDelete = () => {
        destroy(route("categories.batchDestroy"), {
            data: { ids: selectedCategories },
            onSuccess: () => {
                setSelectedCategories([]);
                toast.success("Categories Deleted", {
                    description: `${selectedCategories.length} categories have been successfully deleted.`,
                });
            },
        });
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
            return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
            return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const filteredCategories = sortedCategories.filter((category) =>
        Object.values(category).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />

            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                Add New Category
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="destructive"
                                disabled={selectedCategories.length === 0}
                                onClick={() => setIsBatchDeleteDialogOpen}
                            >
                                Delete Selected ({selectedCategories.length})
                            </Button>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                        </div>
                    </div>
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submitCreate}>
                                <div className="mb-4">
                                    <label htmlFor="name">Name</label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setData({
                                                ...data,
                                                name: name,
                                                slug: autoSlug
                                                    ? generateSlug(name)
                                                    : data.slug,
                                            });
                                        }}
                                    />
                                    {errors.name && (
                                        <div className="text-red-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="slug">Slug</label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData("slug", e.target.value)
                                            }
                                            disabled={autoSlug}
                                        />
                                        <Switch
                                            checked={autoSlug}
                                            onCheckedChange={setAutoSlug}
                                        />
                                        <span>Auto</span>
                                    </div>
                                    {errors.slug && (
                                        <div className="text-red-500">
                                            {errors.slug}
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Create Category
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={
                                            selectedCategories.length ===
                                            paginatedCategories.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">ID</span>
                                </TableHead>
                                {["id", "name", "slug"].map((column) => (
                                    <TableHead
                                        key={column}
                                        onClick={() => {
                                            if (sortColumn === column) {
                                                setSortDirection(
                                                    sortDirection === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                );
                                            } else {
                                                setSortColumn(
                                                    column as keyof Category
                                                );
                                                setSortDirection("asc");
                                            }
                                        }}
                                    >
                                        {column.charAt(0).toUpperCase() +
                                            column.slice(1)}
                                        {sortColumn === column &&
                                            (sortDirection === "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCategories.includes(
                                                category.id
                                            )}
                                            onChange={(e) => {
                                                const checked =
                                                    e.target.checked;
                                                if (checked) {
                                                    setSelectedCategories([
                                                        ...selectedCategories,
                                                        category.id,
                                                    ]);
                                                } else {
                                                    setSelectedCategories(
                                                        selectedCategories.filter(
                                                            (id) =>
                                                                id !==
                                                                category.id
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {category.id}
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.slug}</TableCell>
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
                                                    onClick={() =>
                                                        openEditDialog(category)
                                                    }
                                                >
                                                    <SquarePen className="mr-2 h-4 w-4" />{" "}
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            category
                                                        )
                                                    }
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />{" "}
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
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredCategories.length
                            )}{" "}
                            of {filteredCategories.length} entries
                        </div>
                        <div>
                            <Button
                                className="mr-2"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            Math.ceil(
                                                filteredCategories.length /
                                                    itemsPerPage
                                            )
                                        )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    Math.ceil(
                                        filteredCategories.length / itemsPerPage
                                    )
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        <div className="mb-4">
                            <label htmlFor="edit-name">Name</label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setData({
                                        ...data,
                                        name: name,
                                        slug: autoSlug
                                            ? generateSlug(name)
                                            : data.slug,
                                    });
                                }}
                            />
                            {errors.name && (
                                <div className="text-red-500">
                                    {errors.name}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="edit-slug">Slug</label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="edit-slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    disabled={autoSlug}
                                />
                                <Switch
                                    checked={autoSlug}
                                    onCheckedChange={setAutoSlug}
                                />
                                <span>Auto</span>
                            </div>
                            {errors.slug && (
                                <div className="text-red-500">
                                    {errors.slug}
                                </div>
                            )}
                        </div>
                        <Button type="submit" disabled={processing}>
                            Update Category
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this category?</p>
                    <Button
                        onClick={submitDelete}
                        variant="destructive"
                        disabled={processing}
                    >
                        Delete
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isBatchDeleteDialogOpen}
                onOpenChange={setIsBatchDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this category?</p>
                    <Button
                        onClick={submitBatchDelete}
                        variant="destructive"
                        disabled={processing}
                    >
                        Delete
                    </Button>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
