import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Email Verification
                    </CardTitle>
                    <CardDescription>Verify your email address</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 text-sm text-gray-600">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you? If you didn't receive the email, we
                        will gladly send you another.
                    </div>

                    {status === "verification-link-sent" && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            A new verification link has been sent to the email
                            address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit} className="grid gap-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Resend Verification Email
                        </Button>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Log Out
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
