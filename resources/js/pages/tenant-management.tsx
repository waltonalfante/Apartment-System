import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import ApartmentLayout from '@/layouts/apartment-layout';

const tenants = [
    {
        name: 'Martina Garcia',
        room: 'Room 15',
        contact: '09123456789',
        status: 'Active',
    },
    {
        name: 'John Santos',
        room: 'Room 10',
        contact: '09234567890',
        status: 'Active',
    },
    {
        name: 'Maria Cruz',
        room: 'Room 11',
        contact: '09345678901',
        status: 'Active',
    },
    {
        name: 'Pedro Reyes',
        room: 'Room 12',
        contact: '09456789012',
        status: 'Active',
    },
    {
        name: 'Ana Lopez',
        room: 'Room 13',
        contact: '09567890123',
        status: 'Active',
    },
];

export default function TenantManagement() {
    const [selectedTenant, setSelectedTenant] = useState<(typeof tenants)[number] | null>(null);

    return (
        <ApartmentLayout title="Tenant Management">
            <Head title="Tenant Management" />

            <section className="min-w-0 rounded-2xl bg-white px-7 py-6 shadow-sm">
                <div className="mb-6 flex items-center gap-6 text-base font-semibold text-slate-900">
                    <button
                        type="button"
                        className="rounded-xl border border-black/15 px-4 py-2"
                    >
                        Tenants
                    </button>
                    <span>Rent</span>
                    <span>Name</span>
                    <span>Gender</span>
                    <span>Contact</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left text-base">
                        <thead>
                            <tr className="border-b border-black/10 text-slate-900">
                                <th className="py-3 font-semibold">Tenant Name</th>
                                <th className="py-3 font-semibold">Room</th>
                                <th className="py-3 font-semibold">Contact Number</th>
                                <th className="py-3 font-semibold">Status</th>
                                <th className="py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr
                                    key={tenant.name}
                                    className="border-b border-black/10 text-slate-800"
                                >
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <UserCircle2 className="h-10 w-10 text-slate-400" />
                                            <span>{tenant.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">{tenant.room}</td>
                                    <td className="py-4">{tenant.contact}</td>
                                    <td className="py-4 text-[#14a44d]">
                                        {tenant.status}
                                    </td>
                                    <td className="py-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTenant(tenant)}
                                            className="rounded-xl bg-[#56798b] px-5 py-2 font-semibold text-white"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedTenant ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 lg:pl-[280px]"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedTenant(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold text-slate-900">Tenant Details</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Showing details of the selected tenant record.
                        </p>
                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                Name: <span className="font-semibold">{selectedTenant.name}</span>
                            </p>
                            <p>
                                Room: <span className="font-semibold">{selectedTenant.room}</span>
                            </p>
                            <p>
                                Contact: <span className="font-semibold">{selectedTenant.contact}</span>
                            </p>
                            <p>
                                Status: <span className="font-semibold text-[#14a44d]">{selectedTenant.status}</span>
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedTenant(null)}
                                className="rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
