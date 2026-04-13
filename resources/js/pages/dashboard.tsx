import { Head } from '@inertiajs/react';
import ApartmentLayout from '@/layouts/apartment-layout';

type DashboardStats = {
    total_rooms: number;
    occupied: number;
    available: number;
    collection_rate: number;
};

type Props = {
    stats: DashboardStats;
};

const tenants = [
    { room: '01', name: 'Nicole Edrian', gender: 'Female', contact: '0909090909' },
    { room: '02', name: 'Faith Gawan', gender: 'Female', contact: '0909090909' },
    { room: '03', name: 'Jeron Montjejo', gender: 'Male', contact: '0909090909' },
    { room: '04', name: 'Justin Nabunturuan', gender: 'Male', contact: '0909090909' },
];

export default function Dashboard({ stats }: Props) {
    const quickStats = [
        { label: 'Total Rooms', value: String(stats.total_rooms) },
        { label: 'Occupied', value: String(stats.occupied) },
        { label: 'Available', value: String(stats.available) },
        { label: 'Collection Rate', value: `${stats.collection_rate}%` },
    ];

    return (
        <ApartmentLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-5">
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {quickStats.map((metric) => (
                        <article
                            key={metric.label}
                            className="rounded-md border border-[#c9bbb0] bg-white/70 px-4 py-3"
                        >
                            <p className="text-xs font-medium uppercase text-[#6c7f8b]">
                                {metric.label}
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-[#2a4254]">
                                {metric.value}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                    <article className="rounded-md border border-[#c9bbb0] bg-white/70 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                                Sales Funnel
                            </h2>
                            <span className="rounded-md bg-[#5f7f95] px-2 py-1 text-[10px] font-semibold text-white">
                                This Week
                            </span>
                        </div>

                        <div className="h-40 rounded-md border border-[#d8cdc3] bg-[#f9f8f3] px-4 py-3">
                            <div className="flex h-full items-end gap-2">
                                {[30, 55, 42, 70, 48, 65, 52].map((value, index) => (
                                    <div key={index} className="flex-1">
                                        <div
                                            className="rounded-sm bg-[#8ea8ba]"
                                            style={{ height: `${value}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    <article className="rounded-md border border-[#c9bbb0] bg-white/70 p-4">
                        <h2 className="mb-2 text-sm font-semibold uppercase text-[#2f4e64]">
                            June 2026
                        </h2>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[#6f7b86]">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <div key={day} className="py-1">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
                                <div
                                    key={day}
                                    className={`rounded-sm py-1 ${
                                        day === 14 || day === 21
                                            ? 'bg-[#5f7f95] text-white'
                                            : 'bg-[#f4f1e8]'
                                    }`}
                                >
                                    {day <= 30 ? day : ''}
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                    <div className="apartment-scrollbar max-h-[320px] overflow-auto">
                        <table className="w-full min-w-[720px] border-collapse text-left text-xs text-[#3d5363]">
                            <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                <tr className="border-b border-[#d6c8be] text-[#63717d]">
                                    <th className="px-3 py-2 font-semibold">Room</th>
                                    <th className="px-3 py-2 font-semibold">Name</th>
                                    <th className="px-3 py-2 font-semibold">Gender</th>
                                    <th className="px-3 py-2 font-semibold">Contact Number</th>
                                    <th className="px-3 py-2 text-right font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant) => (
                                    <tr key={tenant.room} className="border-b border-[#ece4de]">
                                        <td className="px-3 py-2">{tenant.room}</td>
                                        <td className="px-3 py-2">{tenant.name}</td>
                                        <td className="px-3 py-2">{tenant.gender}</td>
                                        <td className="px-3 py-2">{tenant.contact}</td>
                                        <td className="px-3 py-2 text-right">
                                            <span className="rounded-full bg-[#4f738b] px-2 py-1 text-[10px] font-semibold text-white">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </ApartmentLayout>
    );
}
