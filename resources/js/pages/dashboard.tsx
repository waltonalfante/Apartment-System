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
    tenants: TenantEntry[];
    reservations: ReservationEntry[];
};

type TenantEntry = {
    id: number;
    room_id: number;
    room_code: string;
    name: string;
    gender: 'Male' | 'Female';
    contact: string;
    check_in_date?: string | null;
    check_out_date?: string | null;
};

type ReservationEntry = {
    id: number;
    room_id: number;
    room_code: string;
    name: string;
    check_in_date?: string | null;
    check_out_date?: string | null;
};

const buildMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const totalCells = 42;

    return Array.from({ length: totalCells }, (_, index) => {
        const dayNumber = index - startOffset + 1;

        if (dayNumber < 1 || dayNumber > lastDay) {
            return null;
        }

        return dayNumber;
    });
};

const formatDateKey = (year: number, month: number, day: number) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}`;
};

export default function Dashboard({ stats, tenants, reservations }: Props) {
    const quickStats = [
        { label: 'Total Rooms', value: String(stats.total_rooms) },
        { label: 'Occupied', value: String(stats.occupied), tone: 'alert' as const },
        { label: 'Available', value: String(stats.available), tone: 'success' as const },
        { label: 'Collection Rate', value: `${stats.collection_rate}%` },
    ];

    const funnelStats = [
        { label: 'Occupied', value: stats.occupied, tone: 'alert' as const },
        { label: 'Reserved', value: reservations.length, tone: 'neutral' as const },
        { label: 'Available', value: stats.available, tone: 'success' as const },
        { label: 'Total Rooms', value: stats.total_rooms, tone: 'total' as const },
    ];
    const funnelMax = Math.max(1, ...funnelStats.map((metric) => metric.value));

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const todayKey = formatDateKey(year, month, today.getDate());
    const reservationDates = new Set(
        reservations
            .map((reservation) => reservation.check_in_date)
            .filter(Boolean) as string[],
    );

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
                            <p
                                className={`mt-1 text-2xl font-semibold ${
                                    metric.tone === 'alert'
                                        ? 'text-[#c0392b]'
                                        : metric.tone === 'success'
                                          ? 'text-[#1f7a4f]'
                                          : 'text-[#2a4254]'
                                }`}
                            >
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

                        <div className="h-64 rounded-md border border-[#d8cdc3] bg-gradient-to-b from-[#fbfaf6] to-[#f3efe6] px-5 py-5">
                            <div className="flex h-full items-end gap-5">
                                                                {funnelStats.map((metric) => {
                                    const heightPx = Math.round((metric.value / funnelMax) * 140);
                                    const barHeight = metric.value > 0 ? Math.max(heightPx, 24) : 16;
                                                                        const barTone =
                                                                                metric.tone === 'alert'
                                                                                        ? 'bg-[#c0392b]'
                                                                                        : metric.tone === 'success'
                                                                                            ? 'bg-[#1f7a4f]'
                                                                                            : metric.tone === 'total'
                                                                                                ? 'bg-[#2f4e64]'
                                                                                                : 'bg-[#7a93a6]';

                                    return (
                                        <div key={metric.label} className="flex-1 text-center">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#2f4e64]">
                                                {metric.value}
                                            </p>
                                            <div className="mx-auto flex h-full w-20 flex-col justify-end">
                                                <div
                                                    className={`rounded-2xl ${barTone} shadow-[0_10px_24px_rgba(15,23,42,0.18)]`}
                                                    style={{ height: `${barHeight}px` }}
                                                />
                                            </div>
                                            <p className="mt-3 text-[10px] font-semibold text-[#5b6d7a]">
                                                {metric.label}
                                            </p>
                                            <p className="text-[10px] text-[#8a96a0]">
                                                {Math.round((metric.value / funnelMax) * 100)}% of max
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </article>

                    <article className="rounded-md border border-[#c9bbb0] bg-white/70 p-4">
                        <h2 className="mb-2 text-sm font-semibold uppercase text-[#2f4e64]">
                            {today.toLocaleString('default', { month: 'long' })} {year}
                        </h2>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[#6f7b86]">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <div key={day} className="py-1">
                                    {day}
                                </div>
                            ))}
                            {buildMonthDays(year, month).map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} className="py-1" />;
                                }

                                const dateKey = formatDateKey(year, month, day);
                                const isToday = dateKey === todayKey;
                                const hasReservation = reservationDates.has(dateKey);

                                return (
                                    <div
                                        key={dateKey}
                                        className={`rounded-sm py-1 ${
                                            isToday
                                                ? 'bg-[#2ca94e] text-white'
                                                : hasReservation
                                                  ? 'bg-[#5f7f95] text-white'
                                                  : 'bg-[#f4f1e8]'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
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
                                    <tr key={tenant.id} className="border-b border-[#ece4de]">
                                        <td className="px-3 py-2">{tenant.room_code}</td>
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
                    {tenants.length === 0 ? (
                        <p className="px-3 py-3 text-xs text-[#6f7b86]">
                            No active tenants yet.
                        </p>
                    ) : null}
                </section>
            </div>
        </ApartmentLayout>
    );
}
