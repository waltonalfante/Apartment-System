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
        tenant: 'Sonca Claus',
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
        tenant: 'Scienta Claus',
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
    Paid: 'bg-[#2ca94e] text-white',
    Pending: 'bg-[#f0b01f] text-[#312400]',
    Overdue: 'bg-[#ef4242] text-white',
};

const parseAmount = (amount: string) => Number(amount.replace(/[^\d]/g, ''));

const toPeso = (value: number) => `P ${value.toLocaleString()}`;

export default function Billing() {
    const [activeFilter, setActiveFilter] = useState<'All' | Bill['status']>('All');
    const [billList, setBillList] = useState<Bill[]>(bills);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [notice, setNotice] = useState('');
    const [isAddPayeeOpen, setIsAddPayeeOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [newPayee, setNewPayee] = useState({
        tenant: '',
        room: '',
        monthYear: 'April 2026',
        rent: '6000',
        electricity: '0',
        water: '0',
        dueDate: 'Apr 10, 2026',
    });

    const filteredBills = useMemo(
        () =>
            activeFilter === 'All'
                ? billList
                : billList.filter((bill) => bill.status === activeFilter),
        [activeFilter, billList],
    );

    const totals = useMemo(() => {
        const totalRevenue = billList.reduce(
            (sum, bill) => sum + parseAmount(bill.total),
            0,
        );
        const collected = billList
            .filter((bill) => bill.status === 'Paid')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const pending = billList
            .filter((bill) => bill.status === 'Pending')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const overdue = billList
            .filter((bill) => bill.status === 'Overdue')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);

        return {
            totalRevenue,
            collected,
            pending,
            overdue,
        };
    }, [billList]);

    const cycleBillStatus = (targetBill: Bill) => {
        const nextStatus: Bill['status'] =
            targetBill.status === 'Pending'
                ? 'Paid'
                : targetBill.status === 'Paid'
                  ? 'Overdue'
                  : 'Pending';

        setBillList((currentBills) =>
            currentBills.map((bill) =>
                bill.room === targetBill.room && bill.tenant === targetBill.tenant
                    ? { ...bill, status: nextStatus }
                    : bill,
            ),
        );
        setNotice(`Status updated for ${targetBill.tenant}: ${nextStatus}.`);
    };

    const sendReminder = (targetBill: Bill) => {
        setNotice(`Reminder sent to ${targetBill.tenant} (${targetBill.room}).`);
    };

    const addPayee = () => {
        if (newPayee.tenant.trim().length < 3 || newPayee.room.trim().length < 1) {
            setNotice('Please complete tenant and unit details before adding payee.');
            return;
        }

        const rentValue = Number(newPayee.rent) || 0;
        const electricityValue = Number(newPayee.electricity) || 0;
        const waterValue = Number(newPayee.water) || 0;
        const totalValue = rentValue + electricityValue + waterValue;

        const billToAdd: Bill = {
            room: `Room ${newPayee.room.trim()}`,
            tenant: newPayee.tenant.trim(),
            monthYear: newPayee.monthYear,
            rent: `P ${rentValue.toLocaleString()}`,
            electricity: `P ${electricityValue.toLocaleString()}`,
            water: `P ${waterValue.toLocaleString()}`,
            total: `P ${totalValue.toLocaleString()}`,
            status: 'Pending',
            dueDate: newPayee.dueDate,
        };

        setBillList((currentBills) => [...currentBills, billToAdd]);
        setNotice(`New payee added for ${billToAdd.tenant}.`);
        setIsAddPayeeOpen(false);
    };

    const historyBills = useMemo(
        () => billList.filter((bill) => bill.status === 'Paid'),
        [billList],
    );

    return (
        <ApartmentLayout title="Billing and Finance">
            <Head title="Billing" />

            {notice ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {notice}
                </div>
            ) : null}

            <section className="min-w-0 space-y-4 rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Total Payment Collected</p>
                        <p className="text-lg font-semibold text-[#2c475a]">P42,000.00</p>
                        <p className="text-[10px] text-[#8a96a0]">This Month</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Outstanding Balance</p>
                        <p className="text-lg font-semibold text-[#2c475a]">P15,000</p>
                        <p className="text-[10px] text-[#8a96a0]">Current</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Overdue Tenant</p>
                        <p className="text-lg font-semibold text-[#2c475a]">1</p>
                        <p className="text-[10px] text-[#8a96a0]">Accounts</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Collection Rates</p>
                        <p className="text-lg font-semibold text-[#2c475a]">43.5%</p>
                        <p className="text-[10px] text-[#8a96a0]">This Month</p>
                    </article>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Gross Revenue</p>
                        <p className="text-lg font-semibold text-[#2c475a]">{toPeso(totals.totalRevenue)}</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Collected</p>
                        <p className="text-lg font-semibold text-[#2ca94e]">{toPeso(totals.collected)}</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Pending</p>
                        <p className="text-lg font-semibold text-[#c68f16]">{toPeso(totals.pending)}</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Overdue</p>
                        <p className="text-lg font-semibold text-[#ef4242]">{toPeso(totals.overdue)}</p>
                    </article>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-md px-3 py-1.5 ${
                                    activeFilter === filter
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAddPayeeOpen(true)}
                            className="rounded-md bg-[#5f7f95] px-6 py-2 text-xs font-semibold text-white"
                        >
                            Add Payee
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsHistoryOpen((current) => !current)}
                            className="rounded-md bg-[#5f7f95] px-6 py-2 text-xs font-semibold text-white"
                        >
                            View History
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                    <div className="apartment-scrollbar max-h-[380px] overflow-auto">
                        <table className="w-full min-w-[980px] border-collapse text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                    <th className="px-3 py-2 font-semibold">Tenant Name</th>
                                    <th className="px-3 py-2 font-semibold">Unit #</th>
                                    <th className="px-3 py-2 font-semibold">Amount Due</th>
                                    <th className="px-3 py-2 font-semibold">Due Date</th>
                                    <th className="px-3 py-2 font-semibold">Status</th>
                                    <th className="px-3 py-2 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill) => (
                                    <tr
                                        key={`${bill.room}-${bill.tenant}`}
                                        className="border-b border-[#eee6e0] text-[#3e5262]"
                                    >
                                        <td className="px-3 py-2">{bill.tenant}</td>
                                        <td className="px-3 py-2">{bill.room.replace('Room ', '')}</td>
                                        <td className="px-3 py-2">{bill.total}</td>
                                        <td className="px-3 py-2">{bill.dueDate}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[bill.status]}`}
                                            >
                                                {bill.status === 'Pending'
                                                    ? 'Unpaid'
                                                    : bill.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex flex-wrap justify-end gap-1 sm:flex-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedBill(bill)}
                                                    className="whitespace-nowrap rounded-md bg-[#5f7f95] px-2 py-1 text-[10px] font-semibold text-white"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => cycleBillStatus(bill)}
                                                    className="whitespace-nowrap rounded-md bg-[#f0b01f] px-2 py-1 text-[10px] font-semibold text-[#312400]"
                                                >
                                                    Change Status
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => sendReminder(bill)}
                                                    className="whitespace-nowrap rounded-md bg-[#4f7188] px-2 py-1 text-[10px] font-semibold text-white"
                                                >
                                                    Send Reminder
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isHistoryOpen ? (
                    <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                        <div className="apartment-scrollbar max-h-[260px] overflow-auto">
                            <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                    <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                        <th className="px-3 py-2 font-semibold">Tenant Name</th>
                                        <th className="px-3 py-2 font-semibold">Unit</th>
                                        <th className="px-3 py-2 font-semibold">Amount</th>
                                        <th className="px-3 py-2 font-semibold">Date</th>
                                        <th className="px-3 py-2 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyBills.map((bill) => (
                                        <tr key={`history-${bill.room}-${bill.tenant}`} className="border-b border-[#eee6e0] text-[#3e5262]">
                                            <td className="px-3 py-2">{bill.tenant}</td>
                                            <td className="px-3 py-2">{bill.room}</td>
                                            <td className="px-3 py-2">{bill.total}</td>
                                            <td className="px-3 py-2">{bill.dueDate}</td>
                                            <td className="px-3 py-2">Paid</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

            </section>

            {selectedBill ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedBill(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            Payment Confirmation
                        </h3>
                        <div className="mt-3 space-y-1 text-xs text-[#465a69]">
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
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedBill(null)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isAddPayeeOpen ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsAddPayeeOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Add New Payee
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <input
                                    value={newPayee.tenant}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            tenant: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Unit #
                                <input
                                    value={newPayee.room}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            room: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Rent
                                <input
                                    value={newPayee.rent}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            rent: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Electricity
                                <input
                                    value={newPayee.electricity}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            electricity: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Water
                                <input
                                    value={newPayee.water}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            water: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Due Date
                                <input
                                    value={newPayee.dueDate}
                                    onChange={(event) =>
                                        setNewPayee((current) => ({
                                            ...current,
                                            dueDate: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                        </div>

                        <p className="mt-3 text-xs font-semibold text-[#2f4e64]">
                            Total Amount: {toPeso((Number(newPayee.rent) || 0) + (Number(newPayee.electricity) || 0) + (Number(newPayee.water) || 0))}
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAddPayeeOpen(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addPayee}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Add Payee
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
