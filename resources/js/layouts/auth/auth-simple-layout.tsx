import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const safeTitle = title ?? 'Login';
    const safeDescription = description ?? '';
    const isCreateAccount = safeTitle.toLowerCase().includes('create');
    const heading = isCreateAccount ? 'Create Account' : safeTitle;
    const loginSideImagePath = '/images/auth/login-side.jpg';
    const registerSideImagePath = '/images/auth/register-side.jpg';
    const sideImagePath = isCreateAccount ? registerSideImagePath : loginSideImagePath;
    const cardWidthClass = isCreateAccount ? 'max-w-[430px]' : 'max-w-[390px]';

    const photoPanel = (
        <section className="relative hidden w-[470px] shrink-0 overflow-hidden lg:block">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(16, 24, 34, 0.24), rgba(16, 24, 34, 0.18)), url('${sideImagePath}')`,
                }}
            />
        </section>
    );

    const formPanel = (
        <section className="relative flex min-h-screen min-w-0 flex-1 items-center justify-center bg-[#214f71] px-4 py-7 sm:px-7 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.2),transparent_42%),radial-gradient(circle_at_8%_80%,rgba(255,255,255,0.12),transparent_42%)]" />

            <div className={`relative z-10 w-full ${cardWidthClass} rounded-lg border border-[#c6bba5] bg-[#f0ead7] px-5 py-6 shadow-[0_14px_30px_rgba(0,0,0,0.2)] sm:px-7 sm:py-7`}>
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-wide text-[#314f65]">
                    The Sammie's Apartment
                </p>
                <h1 className="text-center text-xl font-semibold text-[#223848]">
                    {heading}
                </h1>
                <p className="mb-4 mt-1 text-center text-[11px] text-[#647684]">
                    {safeDescription}
                </p>

                {children}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen min-h-svh bg-[#131722]">
            <div className="flex min-h-screen w-full">
                {isCreateAccount ? (
                    <>
                        {formPanel}
                        {photoPanel}
                    </>
                ) : (
                    <>
                        {photoPanel}
                        {formPanel}
                    </>
                )}
            </div>
        </div>
    );
}
