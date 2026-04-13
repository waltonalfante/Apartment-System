import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

export default function AdminSettings() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <ApartmentLayout title="Admin Settings">
               <Head title="Admin Settings" />

            <section className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="mx-auto max-w-lg rounded-md border border-[#d8cdc3] bg-[#f8f7f3] p-4">
                    <div className="mb-4 flex items-center gap-3 border-b border-[#e3d9cf] pb-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#54758b] text-sm font-semibold text-white">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2f4e64]">Admin</p>
                            <p className="text-[11px] text-[#7a8993]">yournmail@gmail.com</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs text-[#445a6a]">
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Name</span>
                            <span>admin1</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Email account</span>
                            <span>admin@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#ece4de] pb-2">
                            <span>Mobile number</span>
                            <span>09032131232</span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                            <span>Password</span>
                            <span>••••••••••</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="mt-4 rounded-md bg-[#5f7f95] px-5 py-1.5 text-xs font-semibold text-white"
                    >
                        Edit Profile
                    </button>
                </div>
            </section>

            {isEditing ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsEditing(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-lg rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Edit Information
                        </h3>

                        <div className="grid gap-3">
                            <label className="text-xs text-[#4f6271]">
                                Name
                                <input
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="admin1"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email account
                                <input
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="admin@gmail.com"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Mobile number
                                <input
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="09032131232"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Password
                                <input
                                    type="password"
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="12345678"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
