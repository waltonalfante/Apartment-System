// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const authInputClassName =
        'auth-input h-9 border-[#b9b7ad] bg-[#f7f6f2] text-xs text-[#223848] caret-[#223848] placeholder:text-[#97a2ab] focus-visible:border-[#7d93a4] focus-visible:ring-[2px] focus-visible:ring-[#5f7f95]/25';

    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-3 text-center text-xs font-medium text-[#2ca94e]">
                    {status}
                </div>
            )}

            <div className="space-y-4">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs text-[#4f6271]">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Email address"
                                    className={authInputClassName}
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-4 flex items-center justify-start">
                                <Button
                                    className="h-9 w-full bg-[#5f7f95] text-xs font-semibold text-white hover:bg-[#4f7088]"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Email password reset link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-xs text-[#657784]">
                    <span>Or, return to</span>
                    <TextLink href={login()} className="text-[#5f7f95]">log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
