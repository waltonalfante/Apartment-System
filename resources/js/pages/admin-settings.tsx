import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type PageProps = {
    auth?: {
        user?: {
            name?: string;
            email?: string;
        };
    };
};

const toInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export default function AdminSettings() {
    const { props } = usePage<PageProps>();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [notice, setNotice] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const currentName = props.auth?.user?.name ?? 'Admin';
    const currentEmail = props.auth?.user?.email ?? 'No email available';
    const initials = useMemo(() => toInitials(currentName), [currentName]);

    const profileForm = useForm({
        name: currentName,
        email: currentEmail,
        redirect_to: '/admin-settings',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const openProfileEditor = () => {
        profileForm.setData('name', currentName);
        profileForm.setData('email', currentEmail);
        profileForm.setData('redirect_to', '/admin-settings');
        profileForm.clearErrors();
        setNotice(null);
        setIsEditingProfile(true);
    };

    const openPasswordEditor = () => {
        passwordForm.reset();
        passwordForm.clearErrors();
        setNotice(null);
        setIsChangingPassword(true);
    };

    const submitProfile = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        profileForm.patch('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditingProfile(false);
                setNotice({
                    type: 'success',
                    message: 'Profile updated successfully.',
                });
            },
            onError: () => {
                setNotice({
                    type: 'error',
                    message: 'Please review your profile fields and try again.',
                });
            },
        });
    };

    const submitPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        passwordForm.put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                setIsChangingPassword(false);
                passwordForm.reset();
                setNotice({
                    type: 'success',
                    message: 'Password updated successfully.',
                });
            },
            onError: () => {
                setNotice({
                    type: 'error',
                    message: 'Please check your password fields and try again.',
                });
            },
        });
    };

    return (
        <ApartmentLayout title="Admin Settings">
            <Head title="Admin Settings" />

            {notice ? (
                <div
                    className={`mb-4 rounded-md px-3 py-2 text-xs font-semibold text-white ${
                        notice.type === 'success' ? 'bg-[#2ca94e]' : 'bg-[#d84a4a]'
                    }`}
                >
                    {notice.message}
                </div>
            ) : null}

            <section className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="mx-auto max-w-lg rounded-md border border-[#d8cdc3] bg-[#f8f7f3] p-4">
                    <div className="mb-4 flex items-center gap-3 border-b border-[#e3d9cf] pb-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#54758b] text-sm font-semibold text-white">
                            {initials || 'AD'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2f4e64]">{currentName}</p>
                            <p className="text-[11px] text-[#7a8993]">{currentEmail}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs text-[#445a6a]">
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Name</span>
                            <span>{currentName}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Email account</span>
                            <span>{currentEmail}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Profile endpoint</span>
                            <span className="text-[11px] text-[#6b7f8c]">/settings/profile</span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                            <span>Password</span>
                            <span>Hidden and securely hashed</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={openProfileEditor}
                            className="rounded-md bg-[#5f7f95] px-5 py-1.5 text-xs font-semibold text-white"
                        >
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            onClick={openPasswordEditor}
                            className="rounded-md bg-[#2f4e64] px-5 py-1.5 text-xs font-semibold text-white"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </section>

            {isEditingProfile ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsEditingProfile(false)}
                >
                    <form
                        className="apartment-modal-content w-full max-w-lg rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onSubmit={submitProfile}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Edit Profile Information
                        </h3>

                        <div className="grid gap-3">
                            <label className="text-xs text-[#4f6271]">
                                Name
                                <input
                                    value={profileForm.data.name}
                                    onChange={(event) =>
                                        profileForm.setData('name', event.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                                {profileForm.errors.name ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {profileForm.errors.name}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email account
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(event) =>
                                        profileForm.setData('email', event.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                                {profileForm.errors.email ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {profileForm.errors.email}
                                    </p>
                                ) : null}
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {isChangingPassword ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsChangingPassword(false)}
                >
                    <form
                        className="apartment-modal-content w-full max-w-lg rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onSubmit={submitPassword}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Change Password
                        </h3>

                        <div className="grid gap-3">
                            <label className="text-xs text-[#4f6271]">
                                Current password
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(event) =>
                                        passwordForm.setData('current_password', event.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                                {passwordForm.errors.current_password ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {passwordForm.errors.current_password}
                                    </p>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                New password
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(event) =>
                                        passwordForm.setData('password', event.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                                {passwordForm.errors.password ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {passwordForm.errors.password}
                                    </p>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Confirm password
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(event) =>
                                        passwordForm.setData('password_confirmation', event.target.value)
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                                {passwordForm.errors.password_confirmation ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {passwordForm.errors.password_confirmation}
                                    </p>
                                ) : null}
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsChangingPassword(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                {passwordForm.processing ? 'Saving...' : 'Save Password'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
