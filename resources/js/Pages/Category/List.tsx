import { columns } from "./columns";
import { DataTable } from "@/Components/data-table/data-table";
import { Task, taskSchema } from "./data/schema";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { z } from "zod";

export default function List({ auth, tasks }: PageProps<{ tasks: Task[] }>) {
    const todos = z.array(taskSchema).parse(tasks);
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
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Welcome back!
                        </h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your tasks for this month!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2"></div>
                </div>
                <DataTable data={todos} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
