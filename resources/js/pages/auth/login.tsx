import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const authInputClassName =
        'auth-input h-9 border-[#b9b7ad] bg-[#f7f6f2] text-xs text-[#223848] caret-[#223848] placeholder:text-[#97a2ab] focus-visible:border-[#7d93a4] focus-visible:ring-[2px] focus-visible:ring-[#5f7f95]/25';

    return (
        <AuthLayout
            title="Login"
            description="Enter your email and password"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-3"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs text-[#4f6271]">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Email"
                                    className={authInputClassName}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs text-[#4f6271]"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-[11px] text-[#5f7f95]"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className={authInputClassName}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-9 w-full bg-[#5f7f95] text-xs font-semibold text-white hover:bg-[#4f7088]"
                                tabIndex={3}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-[11px] text-[#657784]">
                                Create Account{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={4}
                                    className="text-[#5f7f95]"
                                >
                                    here
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-2 text-center text-xs font-medium text-[#2ca94e]">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
