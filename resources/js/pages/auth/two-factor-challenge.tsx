import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

export default function TwoFactorChallenge() {
    return (
        <AuthLayout
            title="Two-factor authentication"
            description="Two-factor authentication has been disabled for this application."
        >
            <Head title="Two-factor authentication" />

            <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
                <h1 className="text-xl font-semibold text-foreground">
                    Two-factor authentication is disabled
                </h1>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    This application no longer requires two-factor authentication.
                    Please continue using your standard login method.
                </p>
            </div>
        </AuthLayout>
    );
}
