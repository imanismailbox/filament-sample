import { CircleUser, LayoutDashboard, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";

import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import { User } from "@/types";
import { Toaster } from "@/Components/ui/sonner";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href={route("dashboard")}
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <LayoutDashboard className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <NavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        href={route("profile.edit")}
                        active={route().current("profile.edit")}
                    >
                        profile
                    </NavLink>

                    <NavLink
                        href={route("categories.index")}
                        active={route().current("categories.index")}
                    >
                        Categories
                    </NavLink>
                    {/* Add more navigation links as needed */}
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <LayoutDashboard className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>

                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </NavLink>
                            {/* Add more navigation links as needed */}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">
                                        Toggle user menu
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {user.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={route("profile.edit")}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"> */}
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="container mx-auto p-4">{children}</div>
            </main>
            <Toaster closeButton richColors />
        </div>
    );
}
