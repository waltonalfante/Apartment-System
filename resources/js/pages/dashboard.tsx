import { Head } from '@inertiajs/react';
import ApartmentLayout from '@/layouts/apartment-layout';

const metrics = [
    { label: 'Total Rooms', value: '24' },
    { label: 'Occupied', value: '20' },
    { label: 'Available', value: '4' },
    { label: 'Pending Tickets', value: '3' },
];

export default function Dashboard() {
    return (
        <ApartmentLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <article
                            key={metric.label}
                            className="rounded-2xl bg-white px-5 py-4 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {metric.label}
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {metric.value}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <article className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900">
                            Monthly Occupancy
                        </h2>
                        <div className="h-64 rounded-xl border border-dashed border-slate-300 bg-slate-50" />
                    </article>
                    <article className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900">
                            Recent Activity
                        </h2>
                        <ul className="space-y-3 text-sm text-slate-700">
                            <li className="rounded-lg bg-slate-50 px-3 py-2">
                                Room 15 changed to Available
                            </li>
                            <li className="rounded-lg bg-slate-50 px-3 py-2">
                                New tenant inquiry received
                            </li>
                            <li className="rounded-lg bg-slate-50 px-3 py-2">
                                Billing cycle generated for March
                            </li>
                        </ul>
                    </article>
                </section>
            </div>
        </ApartmentLayout>
    );
}
