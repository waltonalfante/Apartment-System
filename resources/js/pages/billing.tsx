import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Bill = {
    room: string;
    tenant: string;
    monthYear: string;
    rent: string;
    electricity: string;
    water: string;
    total: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    dueDate: string;
};

const bills: Bill[] = [
    {
        room: 'Room 10',
        tenant: 'John Santos',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 800',
        water: 'P 300',
        total: 'P 7,100',
        status: 'Paid',
        dueDate: 'Mar 5, 2026',
    },
    {
        room: 'Room 11',
        tenant: 'Maria Cruz',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 750',
        water: 'P 280',
        total: 'P 7,030',
        status: 'Pending',
        dueDate: 'Mar 5, 2026',
    },
    {
        room: 'Room 12',
        tenant: 'Pedro Reyes',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 900',
        water: 'P 320',
        total: 'P 7,220',
        status: 'Overdue',
        dueDate: 'Mar 5, 2026',
    },
    {
        room: 'Room 13',
        tenant: 'Ana Lopez',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 850',
        water: 'P 310',
        total: 'P 7,160',
        status: 'Paid',
        dueDate: 'Mar 5, 2026',
    },
    {
        room: 'Room 14',
        tenant: 'Carlos Bautista',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 780',
        water: 'P 290',
        total: 'P 7,070',
        status: 'Pending',
        dueDate: 'Mar 5, 2026',
    },
    {
        room: 'Room 15',
        tenant: 'Martina Garcia',
        monthYear: 'March 2026',
        rent: 'P 6,000',
        electricity: 'P 820',
        water: 'P 295',
        total: 'P 7,115',
        status: 'Paid',
        dueDate: 'Mar 5, 2026',
    },
];

const statusStyles: Record<Bill['status'], string> = {
    Paid: 'bg-[#0bbf4b] text-white',
    Pending: 'bg-[#e6ab00] text-white',
    Overdue: 'bg-[#ff2a3b] text-white',
};

const parseAmount = (amount: string) => Number(amount.replace(/[^\d]/g, ''));

const toPeso = (value: number) => `P ${value.toLocaleString()}`;

export default function Billing() {
    const [activeFilter, setActiveFilter] = useState<'All' | Bill['status']>('All');
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    const filteredBills = useMemo(
        () =>
            activeFilter === 'All'
                ? bills
                : bills.filter((bill) => bill.status === activeFilter),
        [activeFilter],
    );

    const totals = useMemo(() => {
        const totalRevenue = bills.reduce(
            (sum, bill) => sum + parseAmount(bill.total),
            0,
        );
        const collected = bills
            .filter((bill) => bill.status === 'Paid')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const pending = bills
            .filter((bill) => bill.status === 'Pending')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const overdue = bills
            .filter((bill) => bill.status === 'Overdue')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);

        return {
            totalRevenue,
            collected,
            pending,
            overdue,
        };
    }, []);

    return (
        <ApartmentLayout title="Billing and Finance">
            <Head title="Billing" />

            <section className="min-w-0 space-y-6 rounded-2xl bg-white px-7 py-6 shadow-sm">
                <div className="flex flex-wrap gap-3 text-base font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveFilter('All')}
                        className={`rounded-xl px-4 py-2 ${
                            activeFilter === 'All'
                                ? 'bg-[#56798b] text-white'
                                : 'border border-black/15 text-slate-800'
                        }`}
                    >
                        All Bills
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('Paid')}
                        className={`rounded-xl px-4 py-2 ${
                            activeFilter === 'Paid'
                                ? 'bg-[#56798b] text-white'
                                : 'border border-black/15 text-slate-800'
                        }`}
                    >
                        Paid
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('Pending')}
                        className={`rounded-xl px-4 py-2 ${
                            activeFilter === 'Pending'
                                ? 'bg-[#56798b] text-white'
                                : 'border border-black/15 text-slate-800'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('Overdue')}
                        className={`rounded-xl px-4 py-2 ${
                            activeFilter === 'Overdue'
                                ? 'bg-[#56798b] text-white'
                                : 'border border-black/15 text-slate-800'
                        }`}
                    >
                        Overdue
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] border-collapse text-left text-base">
                        <thead>
                            <tr className="border-b border-black/10 text-slate-900">
                                <th className="py-3 font-semibold">Room</th>
                                <th className="py-3 font-semibold">Tenant</th>
                                <th className="py-3 font-semibold">Month/Year</th>
                                <th className="py-3 font-semibold">Rent</th>
                                <th className="py-3 font-semibold">Electricity</th>
                                <th className="py-3 font-semibold">Water</th>
                                <th className="py-3 font-semibold">Total</th>
                                <th className="py-3 font-semibold">Status</th>
                                <th className="py-3 font-semibold">Due Date</th>
                                <th className="py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.map((bill) => (
                                <tr
                                    key={bill.room}
                                    className="border-b border-black/10 text-slate-800"
                                >
                                    <td className="py-4">{bill.room}</td>
                                    <td className="py-4">{bill.tenant}</td>
                                    <td className="py-4">{bill.monthYear}</td>
                                    <td className="py-4">{bill.rent}</td>
                                    <td className="py-4">{bill.electricity}</td>
                                    <td className="py-4">{bill.water}</td>
                                    <td className="py-4">{bill.total}</td>
                                    <td className="py-4">
                                        <span
                                            className={`rounded-xl px-3 py-1 text-sm font-semibold ${statusStyles[bill.status]}`}
                                        >
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="py-4">{bill.dueDate}</td>
                                    <td className="py-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBill(bill)}
                                            className="rounded-xl border border-black/15 px-4 py-2 font-semibold"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-100 px-5 py-4">
                        <p className="text-sm text-slate-500">Total Revenue</p>
                        <p className="text-4xl font-semibold text-slate-900">{toPeso(totals.totalRevenue)}</p>
                    </div>
                    <div className="rounded-2xl bg-[#edf8f0] px-5 py-4">
                        <p className="text-sm text-slate-500">Collected</p>
                        <p className="text-4xl font-semibold text-[#0c9f45]">{toPeso(totals.collected)}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fff9e7] px-5 py-4">
                        <p className="text-sm text-slate-500">Pending</p>
                        <p className="text-4xl font-semibold text-[#d28a00]">{toPeso(totals.pending)}</p>
                    </div>
                    <div className="rounded-2xl bg-[#ffeff1] px-5 py-4">
                        <p className="text-sm text-slate-500">Overdue</p>
                        <p className="text-4xl font-semibold text-[#e32638]">{toPeso(totals.overdue)}</p>
                    </div>
                </div>
            </section>

            {selectedBill ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 lg:pl-[280px]"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedBill(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold text-slate-900">Bill Details</h3>
                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                Tenant: <span className="font-semibold">{selectedBill.tenant}</span>
                            </p>
                            <p>
                                Room: <span className="font-semibold">{selectedBill.room}</span>
                            </p>
                            <p>
                                Billing: <span className="font-semibold">{selectedBill.monthYear}</span>
                            </p>
                            <p>
                                Rent: <span className="font-semibold">{selectedBill.rent}</span>
                            </p>
                            <p>
                                Electricity: <span className="font-semibold">{selectedBill.electricity}</span>
                            </p>
                            <p>
                                Water: <span className="font-semibold">{selectedBill.water}</span>
                            </p>
                            <p>
                                Total: <span className="font-semibold">{selectedBill.total}</span>
                            </p>
                            <p>
                                Status: <span className="font-semibold">{selectedBill.status}</span>
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedBill(null)}
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
