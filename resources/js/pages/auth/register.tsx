import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const authInputClassName =
        'auth-input h-9 border-[#b9b7ad] bg-[#f7f6f2] text-xs text-[#223848] caret-[#223848] placeholder:text-[#97a2ab] focus-visible:border-[#7d93a4] focus-visible:ring-[2px] focus-visible:ring-[#5f7f95]/25';

    return (
        <AuthLayout
            title="Create an account"
            description="Fill up the form to continue"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-3"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-xs text-[#4f6271]">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Name"
                                    className={authInputClassName}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs text-[#4f6271]">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Email"
                                    className={authInputClassName}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="contact_number" className="text-xs text-[#4f6271]">
                                    Contact Number
                                </Label>
                                <Input
                                    id="contact_number"
                                    type="text"
                                    tabIndex={3}
                                    placeholder="Contact Number"
                                    className={authInputClassName}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-xs text-[#4f6271]">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className={authInputClassName}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs text-[#4f6271]"
                                >
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className={authInputClassName}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-9 w-full bg-[#5f7f95] text-xs font-semibold text-white hover:bg-[#4f7088]"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create Account
                            </Button>
                        </div>

                        <div className="text-center text-[11px] text-[#657784]">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={7} className="text-[#5f7f95]">
                                Login here
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
