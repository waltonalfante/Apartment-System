import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    userEmail?: string;
};

export default function TwoFactorVerify({ userEmail }: Props) {
    const authInputClassName =
        'auth-input h-9 border-[#b9b7ad] bg-[#f7f6f2] text-xs text-[#223848] caret-[#223848] placeholder:text-[#97a2ab] focus-visible:border-[#7d93a4] focus-visible:ring-[2px] focus-visible:ring-[#5f7f95]/25';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState(userEmail || '');

    const sendCode = async () => {
        setSending(true);
        setError('');

        try {
            await axios.post('/auth/2fa/send');
        } catch (error: any) {
            setError(
                error.response?.data?.error ||
                'Failed to send code. Please try again.'
            );
        } finally {
            setSending(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/auth/2fa/verify', { code });

            if (response.data?.redirect) {
                window.location.href = response.data.redirect;
            }
        } catch (error: any) {
            if (error.response?.data?.errors?.code) {
                setError(error.response.data.errors.code[0]);
            } else {
                setError(
                    error.response?.data?.message ||
                    'Verification failed. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (value: string) => {
        // Only allow digits, max 6
        const digits = value.replace(/\D/g, '').slice(0, 6);
        setCode(digits);
    };

    return (
        <AuthLayout
            title="Verify Your Login"
            description="Enter the 6-digit code sent to your email"
        >
            <Head title="Two-Factor Authentication" />

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
                        <>
                            <div>
                                <p className="mb-4 text-sm text-[#657784]">
                                    We sent a 6-digit code to <strong>{email}</strong>.
                                    Check Gmail and enter the code here.
                                </p>

                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="code"
                                        className="text-xs text-[#4f6271]"
                                    >
                                        Verification Code
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        placeholder="Enter 6-digit code"
                                        value={code}
                                        onChange={(e) =>
                                            handleCodeChange(e.target.value)
                                        }
                                        autoFocus
                                        className={
                                            authInputClassName +
                                            ' text-center text-lg tracking-widest font-mono'
                                        }
                                        disabled={loading}
                                    />
                                    {error && <InputError message={error} />}
                                    <p className="text-[11px] text-[#97a2ab]">
                                        Code expires in 10 minutes
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-9 w-full bg-[#5f7f95] text-xs font-semibold text-white hover:bg-[#4f7088]"
                                disabled={loading || code.length !== 6}
                            >
                                {loading && <Spinner />}
                                Verify Code
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={sendCode}
                                    disabled={sending || loading}
                                    className="text-[11px] text-[#5f7f95] hover:text-[#4f7088] hover:underline disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : "Didn't receive code?"}
                                </button>
                            </div>
                        </>

                        {error && (
                    <div className="mt-2 text-center text-xs font-medium text-[#d9534f]">
                        {error}
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
