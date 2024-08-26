import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { useState } from "react";

export default function Dashboard({ auth }: PageProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const handleSave = () => {
        // Implement save logic here
        console.log("Saving post:", { title, content, tags });
    };

    const handleCancel = () => {
        // Implement cancel logic here
        console.log("Editing cancelled");
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your post content here"
                            className="min-h-[200px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="Enter tags separated by commas"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
            </Card>
        </AuthenticatedLayout>
    );
}
