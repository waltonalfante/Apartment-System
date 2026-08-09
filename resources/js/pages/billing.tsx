import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Bill = {
    tenantId: number;
    room: string;
    tenant: string;
    monthYear: string;
    rent: string;
    electricity: string;
    water: string;
    total: string;
    downpayment: number;
    paymentType: 'cash' | 'gcash';
    gcashNumber?: string | null;
    billingPaidAmount?: number;
    billingPaymentMethod?: 'cash' | 'gcash' | null;
    billingReceiptPath?: string | null;
    status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
    dueDate: string;
};

type TenantEntry = {
    id: number;
    room_id: number;
    room_code: string;
    name: string;
    check_in_date?: string | null;
    downpayment?: number | string;
    payment_type?: 'cash' | 'gcash';
    gcash_number?: string | null;
    billing_status?: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
    billing_due_date?: string | null;
    billing_month_year?: string | null;
    billing_electricity?: number | string;
    billing_water?: number | string;
    billing_paid_amount?: number | string;
    billing_payment_method?: 'cash' | 'gcash' | null;
    billing_receipt_path?: string | null;
};

type BillingHistoryEntry = {
    id: number;
    room_code: string;
    name: string;
    billing_due_date?: string | null;
    billing_month_year?: string | null;
    billing_electricity?: number | string;
    billing_water?: number | string;
    downpayment?: number | string;
    billing_paid_amount?: number | string;
    billing_payment_method?: 'cash' | 'gcash' | null;
    billing_receipt_path?: string | null;
    payment_type?: 'cash' | 'gcash';
    gcash_number?: string | null;
};

type PayeeOption = {
    id: number;
    key: string;
    label: string;
    room: string;
    name: string;
    checkInDate?: string | null;
    downpayment?: string | number;
    paymentType?: 'cash' | 'gcash';
    gcashNumber?: string | null;
};

const buildBillsFromTenants = (
    tenants: TenantEntry[],
    nextDueDate: (date?: string | null) => string,
): Bill[] =>
    tenants.map((tenant) => ({
        tenantId: tenant.id,
        room: `Room ${tenant.room_code}`,
        tenant: tenant.name,
        monthYear: tenant.billing_month_year || 'April 2026',
        rent: 'P 6,000',
        electricity: `P ${Number(tenant.billing_electricity ?? 0).toLocaleString()}`,
        water: `P ${Number(tenant.billing_water ?? 0).toLocaleString()}`,
        total: `P ${(6000 + Number(tenant.billing_electricity ?? 0) + Number(tenant.billing_water ?? 0)).toLocaleString()}`,
        downpayment: Number(tenant.downpayment ?? 0),
        paymentType: tenant.payment_type ?? 'cash',
        gcashNumber: tenant.gcash_number ?? null,
        billingPaidAmount: Number(tenant.billing_paid_amount ?? 0),
        billingPaymentMethod: tenant.billing_payment_method ?? null,
        billingReceiptPath: tenant.billing_receipt_path ?? null,
        status: tenant.billing_status ?? 'Pending',
        dueDate: tenant.billing_due_date || nextDueDate(tenant.check_in_date),
    }));

const buildPaidHistoryBills = (history: BillingHistoryEntry[]): Bill[] =>
    history.map((item) => {
        const electricity = Number(item.billing_electricity ?? 0);
        const water = Number(item.billing_water ?? 0);
        const total = 6000 + electricity + water;

        return {
            tenantId: item.id,
            room: `Room ${item.room_code}`,
            tenant: item.name,
            monthYear: item.billing_month_year || 'April 2026',
            rent: 'P 6,000',
            electricity: `P ${electricity.toLocaleString()}`,
            water: `P ${water.toLocaleString()}`,
            total: `P ${total.toLocaleString()}`,
            downpayment: Number(item.downpayment ?? 0),
            billingPaidAmount: Number(item.billing_paid_amount ?? 0),
            billingPaymentMethod: item.billing_payment_method ?? item.payment_type ?? 'cash',
            billingReceiptPath: item.billing_receipt_path ?? null,
            paymentType: item.payment_type ?? 'cash',
            gcashNumber: item.gcash_number ?? null,
            status: 'Paid',
            dueDate: item.billing_due_date || '-',
        };
    });

const statusStyles: Record<Bill['status'], string> = {
    Paid: 'bg-[#2ca94e] text-white',
    Partial: 'bg-[#f7a928] text-[#2c1800]',
    Pending: 'bg-[#f0b01f] text-[#312400]',
    Overdue: 'bg-[#ef4242] text-white',
};


const parseAmount = (amount: string) => Number(amount.replace(/[^\d]/g, ''));

const toPeso = (value: number) => `P ${value.toLocaleString()}`;

const receiptUrl = (path?: string | null) =>
    path ? `/storage/${path}` : null;

const openDatePicker = (
    event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
) => {
    const input = event.currentTarget as HTMLInputElement & { showPicker?: () => void };
    input.showPicker?.();
};

const buildNextDueDate = (checkInDate?: string | null) => {
    if (!checkInDate) {
        return new Date().toISOString().slice(0, 10);
    }

    const today = new Date();
    const baseDate = new Date(checkInDate);
    const nextDue = new Date(today.getFullYear(), today.getMonth(), baseDate.getDate());

    if (nextDue < today) {
        nextDue.setMonth(nextDue.getMonth() + 1);
    }

    return nextDue.toISOString().slice(0, 10);
};

const resolveBillStatus = (bill: Bill): Bill['status'] => {
    if (bill.status === 'Paid' || bill.status === 'Partial') {
        return bill.status;
    }

    const dueDate = new Date(bill.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
        return bill.status;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
        return 'Overdue';
    }

    return bill.status;
};

export default function Billing({
    tenants,
    billingHistory,
}: {
    tenants: TenantEntry[];
    billingHistory: BillingHistoryEntry[];
}) {
    const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Overdue'>('All');
    const [billList, setBillList] = useState<Bill[]>(() =>
        buildBillsFromTenants(tenants, buildNextDueDate),
    );
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [selectedHistoryBill, setSelectedHistoryBill] = useState<BillingHistoryEntry | null>(null);
    const [editElectricity, setEditElectricity] = useState('');
    const [editWater, setEditWater] = useState('');
    const [notice, setNotice] = useState('');
    const [isAddPayeeOpen, setIsAddPayeeOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historySearch, setHistorySearch] = useState('');
    const [selectedPayeeKey, setSelectedPayeeKey] = useState('');
    const [editPaidAmount, setEditPaidAmount] = useState('');
    const [editPaymentMethod, setEditPaymentMethod] = useState<'cash' | 'gcash'>('cash');
    const [editReceiptFile, setEditReceiptFile] = useState<File | null>(null);
    const [newPayee, setNewPayee] = useState({
        tenant: '',
        room: '',
        monthYear: 'April 2026',
        rent: '6000',
        electricity: '0',
        water: '0',
        dueDate: buildNextDueDate(),
    });
    const { props } = usePage<{ flash?: { success?: string | null; error?: string | null } }>();
    const flash = props.flash;

    const filteredBills = useMemo(
        () =>
            billList.filter((bill) => {
                const displayStatus = resolveBillStatus(bill);

                if (displayStatus === 'Paid') {
                    return false;
                }

                return activeFilter === 'All'
                    ? true
                    : activeFilter === 'Pending'
                        ? displayStatus === 'Pending' || displayStatus === 'Partial'
                        : displayStatus === activeFilter;
            }),
        [activeFilter, billList],
    );

    const [localBillingHistory, setLocalBillingHistory] = useState<BillingHistoryEntry[]>(billingHistory);

    const paidHistoryBills = useMemo(
        () => buildPaidHistoryBills(localBillingHistory),
        [localBillingHistory],
    );

    const allBills = useMemo(
        () => [...billList, ...paidHistoryBills],
        [billList, paidHistoryBills],
    );

    const totals = useMemo(() => {
        const totalRevenue = allBills.reduce(
            (sum, bill) => sum + parseAmount(bill.total),
            0,
        );
        const collected = allBills
            .filter((bill) => resolveBillStatus(bill) === 'Paid')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const pending = allBills
            .filter((bill) => {
                const status = resolveBillStatus(bill);

                return status === 'Pending' || status === 'Partial';
            })
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const overdue = allBills
            .filter((bill) => resolveBillStatus(bill) === 'Overdue')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const gcashCollected = allBills
            .filter((bill) => resolveBillStatus(bill) === 'Paid' && bill.paymentType === 'gcash')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const cashCollected = allBills
            .filter((bill) => resolveBillStatus(bill) === 'Paid' && bill.paymentType === 'cash')
            .reduce((sum, bill) => sum + parseAmount(bill.total), 0);
        const overdueTenants = allBills.filter((bill) => resolveBillStatus(bill) === 'Overdue')
            .length;
        const collectionRate = totalRevenue > 0
            ? Math.round((collected / totalRevenue) * 1000) / 10
            : 0;

        return {
            totalRevenue,
            collected,
            pending,
            overdue,
            gcashCollected,
            cashCollected,
            overdueTenants,
            collectionRate,
        };
    }, [allBills]);

    const cycleBillStatus = (targetBill: Bill) => {
        setSelectedBill(targetBill);
        setNotice(`Update payment details for ${targetBill.tenant}.`);
    };

    const addPayee = () => {
        if (!selectedPayeeKey) {
            setNotice('Select a tenant or reserved name before adding payee.');

            return;
        }

        if (newPayee.tenant.trim().length < 3 || newPayee.room.trim().length < 1) {
            setNotice('Please complete tenant and unit details before adding payee.');

            return;
        }

        const rentValue = Number(newPayee.rent) || 0;
        const electricityValue = Number(newPayee.electricity) || 0;
        const waterValue = Number(newPayee.water) || 0;
        const totalValue = rentValue + electricityValue + waterValue;

        const billToAdd: Bill = {
            tenantId: selectedPayee?.id ?? 0,
            room: `Room ${newPayee.room.trim()}`,
            tenant: newPayee.tenant.trim(),
            monthYear: newPayee.monthYear,
            rent: `P ${rentValue.toLocaleString()}`,
            electricity: `P ${electricityValue.toLocaleString()}`,
            water: `P ${waterValue.toLocaleString()}`,
            total: `P ${totalValue.toLocaleString()}`,
            downpayment: Number(selectedPayee?.downpayment ?? 0),
            paymentType: selectedPayee?.paymentType ?? 'cash',
            gcashNumber: selectedPayee?.gcashNumber ?? null,
            status: 'Pending',
            dueDate: newPayee.dueDate,
        };

        setBillList((currentBills) => [...currentBills, billToAdd]);
        setNotice(`New payee added for ${billToAdd.tenant}.`);
        setIsAddPayeeOpen(false);
        setSelectedPayeeKey('');
        setNewPayee((current) => ({
            ...current,
            tenant: '',
            room: '',
        }));
    };

    const historyBills = useMemo(
        () =>
            billingHistory.map((item) => {
                const electricity = Number(item.billing_electricity ?? 0);
                const water = Number(item.billing_water ?? 0);
                const total = 6000 + electricity + water;

                return {
                    id: item.id,
                    room: `Room ${item.room_code}`,
                    room_code: item.room_code,
                    tenant: item.name,
                    total: `P ${total.toLocaleString()}`,
                    dueDate: item.billing_due_date || '-',
                    billing_electricity: item.billing_electricity,
                    billing_water: item.billing_water,
                    downpayment: item.downpayment,
                    billing_paid_amount: item.billing_paid_amount,
                    billing_payment_method: item.billing_payment_method,
                    billing_receipt_path: item.billing_receipt_path,
                    payment_type: item.payment_type,
                    gcash_number: item.gcash_number,
                    billing_month_year: item.billing_month_year,
                };
            }),
        [billingHistory],
    );

    const filteredHistoryBills = useMemo(() => {
        const normalized = historySearch.trim().toLowerCase();

        if (!normalized) {
            return historyBills;
        }

        return historyBills.filter((bill) =>
            `${bill.tenant} ${bill.room}`.toLowerCase().includes(normalized),
        );
    }, [historyBills, historySearch]);

    const payeeOptions = useMemo<PayeeOption[]>(
        () =>
            tenants
                .map((tenant) => ({
                    id: tenant.id,
                    key: `tenant-${tenant.id}`,
                    label: `${tenant.name} (Room ${tenant.room_code})`,
                    room: tenant.room_code,
                    name: tenant.name,
                    checkInDate: tenant.check_in_date ?? null,
                    downpayment: tenant.downpayment,
                    paymentType: tenant.payment_type ?? 'cash',
                    gcashNumber: tenant.gcash_number ?? null,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [tenants],
    );

    const selectedPayee = useMemo(
        () => payeeOptions.find((option) => option.key === selectedPayeeKey) ?? null,
        [payeeOptions, selectedPayeeKey],
    );

    const historyPageSize = 10;
    const historyPageCount = Math.max(1, Math.ceil(filteredHistoryBills.length / historyPageSize));
    const historyPageBills = useMemo(
        () => filteredHistoryBills.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize),
        [filteredHistoryBills, historyPage],
    );

    useEffect(() => {
        setHistoryPage((current) => Math.min(current, historyPageCount));
    }, [historyPageCount]);

    useEffect(() => {
        setBillList(buildBillsFromTenants(tenants, buildNextDueDate));
    }, [tenants]);

    useEffect(() => {
        if (!selectedBill) {
            return;
        }

        const refreshedSelectedBill = billList.find(
            (bill) => bill.tenantId === selectedBill.tenantId,
        );

        if (refreshedSelectedBill) {
            setSelectedBill(refreshedSelectedBill);
        }
    }, [billList, selectedBill]);

    useEffect(() => {
        if (!selectedHistoryBill) {
            return;
        }

        const refreshedHistoryBill = localBillingHistory.find(
            (item) => item.id === selectedHistoryBill.id,
        );

        if (refreshedHistoryBill) {
            setSelectedHistoryBill(refreshedHistoryBill);
        }
    }, [localBillingHistory, selectedHistoryBill]);

    useEffect(() => {
        if (!selectedPayee) {
            return;
        }

        setNewPayee((current) => ({
            ...current,
            tenant: selectedPayee.name,
            room: selectedPayee.room,
            dueDate: buildNextDueDate(selectedPayee.checkInDate),
        }));
    }, [selectedPayee]);

    useEffect(() => {
        if (!selectedBill) {
            setEditElectricity('');
            setEditWater('');
            setEditPaidAmount('');
            setEditPaymentMethod('cash');
            setEditReceiptFile(null);

            return;
        }

        setEditElectricity(String(parseAmount(selectedBill.electricity)));
        setEditWater(String(parseAmount(selectedBill.water)));
        setEditPaidAmount('');
        setEditPaymentMethod(selectedBill.billingPaymentMethod ?? selectedBill.paymentType ?? 'cash');
        setEditReceiptFile(null);
    }, [selectedBill]);

    const applyBillEdits = () => {
        if (!selectedBill) {
            return;
        }

        const rentValue = parseAmount(selectedBill.rent);
        const electricityValue = Number(editElectricity) || 0;
        const waterValue = Number(editWater) || 0;
        const totalValue = rentValue + electricityValue + waterValue;

        const updatedBill: Bill = {
            ...selectedBill,
            electricity: `P ${electricityValue.toLocaleString()}`,
            water: `P ${waterValue.toLocaleString()}`,
            total: `P ${totalValue.toLocaleString()}`,
        };

        setBillList((current) =>
            current.map((bill) => (bill.tenantId === selectedBill.tenantId ? updatedBill : bill)),
        );
        setSelectedBill(updatedBill);

        router.patch(
            `/billing/tenants/${selectedBill.tenantId}`,
            {
                due_date: selectedBill.dueDate,
                month_year: selectedBill.monthYear,
                electricity: electricityValue,
                water: waterValue,
                amount_paid: Number(editPaidAmount) || 0,
                payment_method: editPaymentMethod,
            },
            { preserveScroll: true },
        );

        setNotice(`Billing updated for ${selectedBill.tenant}.`);
    };

    const applyPaymentUpdate = () => {
        if (!selectedBill) {
            return;
        }

        const rentValue = parseAmount(selectedBill.rent);
        const electricityValue = Number(editElectricity) || 0;
        const waterValue = Number(editWater) || 0;
        const totalValue = rentValue + electricityValue + waterValue;
        const paidValue = Number(editPaidAmount) || 0;
        const previousPaidValue = Number(selectedBill.billingPaidAmount ?? 0);
        const cumulativePaidValue = Math.min(previousPaidValue + paidValue, totalValue);

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('due_date', selectedBill.dueDate);
        formData.append('month_year', selectedBill.monthYear);
        formData.append('electricity', String(electricityValue));
        formData.append('water', String(waterValue));
        formData.append('amount_paid', String(paidValue));
        formData.append('payment_method', editPaymentMethod);

        if (editPaymentMethod === 'gcash' && editReceiptFile) {
            formData.append('receipt', editReceiptFile);
        }

        router.post(`/billing/tenants/${selectedBill.tenantId}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const isFullyPaid = cumulativePaidValue >= totalValue;

                if (isFullyPaid) {
                    // create a history entry for immediate UI feedback
                    const newHistory: BillingHistoryEntry = {
                        id: Date.now(),
                        room_code: selectedBill.room.replace('Room ', ''),
                        name: selectedBill.tenant,
                        billing_due_date: selectedBill.dueDate,
                        billing_month_year: selectedBill.monthYear,
                        billing_electricity: electricityValue,
                        billing_water: waterValue,
                        downpayment: selectedBill.downpayment,
                        billing_paid_amount: cumulativePaidValue,
                        billing_payment_method: editPaymentMethod,
                        billing_receipt_path: editPaymentMethod === 'gcash'
                            ? (editReceiptFile ? URL.createObjectURL(editReceiptFile) : selectedBill.billingReceiptPath ?? null)
                            : null,
                        payment_type: selectedBill.paymentType,
                        gcash_number: selectedBill.gcashNumber ?? null,
                    };

                    setLocalBillingHistory((current) => [newHistory, ...current]);

                    // remove from the active bill list
                    setBillList((current) => current.filter((b) => b.tenantId !== selectedBill.tenantId));
                } else {
                    setBillList((current) =>
                        current.map((bill) =>
                            bill.tenantId === selectedBill.tenantId
                                ? {
                                    ...bill,
                                    electricity: `P ${electricityValue.toLocaleString()}`,
                                    water: `P ${waterValue.toLocaleString()}`,
                                    total: `P ${totalValue.toLocaleString()}`,
                                    billingPaidAmount: cumulativePaidValue,
                                    billingPaymentMethod: editPaymentMethod,
                                    status: cumulativePaidValue > 0 ? 'Partial' : 'Pending',
                                }
                                : bill,
                        ),
                    );
                }

                setSelectedBill(null);
                setNotice(`Payment updated for ${selectedBill.tenant}.`);
            },
        });
    };

    return (
        <ApartmentLayout title="Billing and Finance">
            <Head title="Billing" />

            {flash?.error ? (
                <div className="mb-4 rounded-md bg-[#d84a4a] px-3 py-2 text-xs font-semibold text-white">
                    {flash.error}
                </div>
            ) : null}
            {flash?.success ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {flash.success}
                </div>
            ) : null}

            { notice && !flash?.success && !flash?.error ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {notice}
                </div>
            ) : null}

            <section className="min-w-0 space-y-4 rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Total Payment Collected</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {toPeso(totals.collected)}
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">This Month</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Outstanding Balance</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {toPeso(totals.pending + totals.overdue)}
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">Current</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Overdue Tenant</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {totals.overdueTenants}
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">Accounts</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Collection Rates</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {totals.collectionRate}%
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">This Month</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">GCash Payments</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {toPeso(totals.gcashCollected)}
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">Collected</p>
                    </article>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Gross Revenue</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {toPeso(totals.totalRevenue)}
                        </p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Collected</p>
                        <p className="text-base font-semibold text-[#2ca94e]">
                            {toPeso(totals.collected)}
                        </p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Pending</p>
                        <p className="text-base font-semibold text-[#c68f16]">
                            {toPeso(totals.pending)}
                        </p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Overdue</p>
                        <p className="text-base font-semibold text-[#ef4242]">
                            {toPeso(totals.overdue)}
                        </p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#6e7c88]">Cash Payments</p>
                        <p className="text-base font-semibold text-[#2c475a]">
                            {toPeso(totals.cashCollected)}
                        </p>
                        <p className="text-[10px] text-[#8a96a0]">Collected</p>
                    </article>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        {(['All', 'Pending', 'Overdue'] as const).map((filter) => (
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
                            onClick={() => {
                                setIsHistoryOpen((current) => !current);
                                setHistoryPage(1);
                            }}
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
                                    <th className="px-3 py-2 font-semibold">Payment</th>
                                    <th className="px-3 py-2 font-semibold">Status</th>
                                    <th className="px-3 py-2 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill) => {
                                    const displayStatus = resolveBillStatus(bill);

                                    return (
                                        <tr
                                        key={`${bill.room}-${bill.tenant}`}
                                        className="border-b border-[#eee6e0] text-[#3e5262]"
                                    >
                                        <td className="px-3 py-2">{bill.tenant}</td>
                                        <td className="px-3 py-2">{bill.room.replace('Room ', '')}</td>
                                        <td className="px-3 py-2">{bill.total}</td>
                                        <td className="px-3 py-2">{bill.dueDate}</td>
                                        <td className="px-3 py-2">
                                            {bill.paymentType === 'gcash' ? 'GCash' : 'Cash'}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    statusStyles[displayStatus]
                                                }`}
                                            >
                                                {displayStatus === 'Pending'
                                                    ? 'Unpaid'
                                                    : displayStatus}
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
                                                {resolveBillStatus(bill) !== 'Paid' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => cycleBillStatus(bill)}
                                                        className="whitespace-nowrap rounded-md bg-[#f0b01f] px-2 py-1 text-[10px] font-semibold text-[#312400]"
                                                    >
                                                        Update Payment
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isHistoryOpen ? (
                    <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee6e0] px-3 py-2">
                            <div>
                                <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">Billing History</h3>
                                <p className="text-[11px] text-[#6f7b86]">Past paid invoices.</p>
                            </div>
                            <input
                                value={historySearch}
                                onChange={(event) => {
                                    setHistorySearch(event.target.value);
                                    setHistoryPage(1);
                                }}
                                placeholder="Search history"
                                className="h-8 w-56 rounded-md border border-[#c9bbb0] bg-white px-2 text-xs text-[#3f5667] outline-none"
                            />
                        </div>
                        <div className="apartment-scrollbar max-h-[420px] overflow-auto">
                            <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                    <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                        <th className="px-3 py-2 font-semibold">Tenant Name</th>
                                        <th className="px-3 py-2 font-semibold">Unit</th>
                                        <th className="px-3 py-2 font-semibold">Amount</th>
                                        <th className="px-3 py-2 font-semibold">Date</th>
                                        <th className="px-3 py-2 font-semibold">Status</th>
                                        <th className="px-3 py-2 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyPageBills.map((bill) => (
                                        <tr key={`history-${bill.room_code}-${bill.tenant}`} className="border-b border-[#eee6e0] text-[#3e5262]">
                                            <td className="px-3 py-2">{bill.tenant}</td>
                                            <td className="px-3 py-2">{bill.room_code}</td>
                                            <td className="px-3 py-2">{bill.total}</td>
                                            <td className="px-3 py-2">{bill.dueDate}</td>
                                            <td className="px-3 py-2">
                                                <span className="rounded-full bg-[#2ca94e] px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    Paid
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedHistoryBill(bill)}
                                                    className="whitespace-nowrap rounded-md bg-[#5f7f95] px-2 py-1 text-[10px] font-semibold text-white"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredHistoryBills.length > historyPageSize ? (
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eee6e0] px-3 py-2 text-[10px] text-[#5a6d7c]">
                                <span>
                                    Showing {(historyPage - 1) * historyPageSize + 1}-
                                    {Math.min(historyPage * historyPageSize, filteredHistoryBills.length)} of {filteredHistoryBills.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setHistoryPage((current) => Math.max(1, current - 1))}
                                        disabled={historyPage === 1}
                                        className="rounded-md border border-[#c9bbb0] bg-white px-2 py-1 font-semibold text-[#3f5667] disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: historyPageCount }, (_, index) => {
                                        const pageNumber = index + 1;

                                        return (
                                            <button
                                                key={`history-page-${pageNumber}`}
                                                type="button"
                                                onClick={() => setHistoryPage(pageNumber)}
                                                className={`rounded-md px-2 py-1 font-semibold ${
                                                    historyPage === pageNumber
                                                        ? 'bg-[#5f7f95] text-white'
                                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => setHistoryPage((current) => Math.min(historyPageCount, current + 1))}
                                        disabled={historyPage === historyPageCount}
                                        className="rounded-md border border-[#c9bbb0] bg-white px-2 py-1 font-semibold text-[#3f5667] disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : null}
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                                    Billing Details
                                </h3>
                                <p className="text-[11px] text-[#6f7b86]">Edit utilities and confirm.</p>
                            </div>
                            <span className="rounded-full bg-[#e8dfd6] px-2 py-0.5 text-[10px] font-semibold text-[#5a6d7c]">
                                {selectedBill.monthYear}
                            </span>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Tenant</span>
                                    <span className="font-semibold">{selectedBill.tenant}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Room</span>
                                    <span className="font-semibold">{selectedBill.room}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Rent</span>
                                    <span className="font-semibold">{selectedBill.rent}</span>
                                </div>
                            </div>

                            <div className="rounded-md border border-[#d8cdc3] bg-[#f6f3ee] px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Electricity</span>
                                    <input
                                        value={editElectricity}
                                        onChange={(event) => setEditElectricity(event.target.value)}
                                        className="h-8 w-24 rounded-md border border-[#dbd2c8] bg-white px-2 text-right text-xs outline-none"
                                        inputMode="decimal"
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Water</span>
                                    <input
                                        value={editWater}
                                        onChange={(event) => setEditWater(event.target.value)}
                                        className="h-8 w-24 rounded-md border border-[#dbd2c8] bg-white px-2 text-right text-xs outline-none"
                                        inputMode="decimal"
                                    />
                                </div>
                            </div>

                            <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Total</span>
                                    <span className="font-semibold">{selectedBill.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Downpayment</span>
                                    <span className="font-semibold">
                                        {toPeso(selectedBill.downpayment)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Balance Due</span>
                                    <span className="font-semibold">
                                        {toPeso(
                                            Math.max(
                                                parseAmount(selectedBill.total) -
                                                    Number(selectedBill.billingPaidAmount ?? 0),
                                                0,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[11px] text-[#465a69]">
                                <span className="rounded-full bg-[#dfe6ec] px-2 py-0.5 font-semibold text-[#3f5667]">
                                    {selectedBill.paymentType === 'gcash' ? 'GCash' : 'Cash'}
                                </span>
                                {selectedBill.paymentType === 'gcash' ? (
                                    <span className="rounded-full bg-[#dfe6ec] px-2 py-0.5 font-semibold text-[#3f5667]">
                                        {selectedBill.gcashNumber || 'No GCash number'}
                                    </span>
                                ) : null}
                                <span className="rounded-full bg-[#e8dfd6] px-2 py-0.5 font-semibold text-[#5a6d7c]">
                                    {Number(selectedBill.billingPaidAmount ?? 0) >= parseAmount(selectedBill.total)
                                        ? 'Full'
                                        : Number(selectedBill.billingPaidAmount ?? 0) > 0
                                          ? 'Partial'
                                          : 'Unpaid'}
                                </span>
                                <span className="rounded-full bg-[#f0e8de] px-2 py-0.5 font-semibold text-[#5a6d7c]">
                                    {selectedBill.status}
                                </span>
                            </div>

                            <div className="rounded-md border border-[#d8cdc3] bg-[#fffdf9] px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between gap-3">
                                    <span>Amount Paid</span>
                                    <input
                                        value={editPaidAmount}
                                        onChange={(event) => setEditPaidAmount(event.target.value)}
                                        className="h-8 w-28 rounded-md border border-[#dbd2c8] bg-white px-2 text-right text-xs outline-none"
                                        inputMode="decimal"
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between gap-3">
                                    <span>Payment Method</span>
                                    <select
                                        value={editPaymentMethod}
                                        onChange={(event) => {
                                            setEditPaymentMethod(event.target.value as 'cash' | 'gcash');

                                                   if (event.target.value === 'cash') {
                                                setEditReceiptFile(null);
                                            }
                                        }}
                                        className="h-8 w-28 rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="gcash">GCash</option>
                                    </select>
                                </div>
                                {editPaymentMethod === 'gcash' ? (
                                    <div className="mt-2 flex flex-col gap-1">
                                        <span className="font-semibold text-[#2f4e64]">Receipt Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => setEditReceiptFile(event.target.files?.[0] ?? null)}
                                            className="block w-full text-[11px] text-[#465a69]"
                                        />
                                        {selectedBill.billingReceiptPath ? (
                                            <div className="mt-2 space-y-2">
                                                <img
                                                    src={receiptUrl(selectedBill.billingReceiptPath) ?? ''}
                                                    alt="Current GCash receipt"
                                                    className="max-h-56 w-full rounded-md border border-[#d8cdc3] object-contain bg-white"
                                                />
                                                <a
                                                    href={receiptUrl(selectedBill.billingReceiptPath) ?? '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] font-semibold text-[#5f7f95] underline"
                                                >
                                                    Open receipt in new tab
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={applyBillEdits}
                                className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Update Billing
                            </button>
                            <button
                                type="button"
                                onClick={applyPaymentUpdate}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Update Payment
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

            {selectedHistoryBill ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedHistoryBill(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                                    Receipt
                                </h3>
                                <p className="text-[11px] text-[#6f7b86]">Billing record from history.</p>
                            </div>
                            <span className="rounded-full bg-[#e8dfd6] px-2 py-0.5 text-[10px] font-semibold text-[#5a6d7c]">
                                {selectedHistoryBill.billing_month_year || 'April 2026'}
                            </span>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Tenant</span>
                                    <span className="font-semibold">{selectedHistoryBill.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Room</span>
                                    <span className="font-semibold">Room {selectedHistoryBill.room_code}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Rent</span>
                                    <span className="font-semibold">P 6,000</span>
                                </div>
                            </div>

                            <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Electricity</span>
                                    <span className="font-semibold">P {Number(selectedHistoryBill.billing_electricity ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Water</span>
                                    <span className="font-semibold">P {Number(selectedHistoryBill.billing_water ?? 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                <div className="flex items-center justify-between">
                                    <span>Total Amount</span>
                                    <span className="font-semibold">
                                        {toPeso(6000 + Number(selectedHistoryBill.billing_electricity ?? 0) + Number(selectedHistoryBill.billing_water ?? 0))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Downpayment</span>
                                    <span className="font-semibold">
                                        {toPeso(Number(selectedHistoryBill.downpayment ?? 0))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Paid Amount</span>
                                    <span className="font-semibold">
                                        {toPeso(Number(selectedHistoryBill.billing_paid_amount ?? 0))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Balance Due</span>
                                    <span className="font-semibold">
                                        {toPeso(
                                            Math.max(
                                                6000 + Number(selectedHistoryBill.billing_electricity ?? 0) + Number(selectedHistoryBill.billing_water ?? 0) -
                                                    Number(selectedHistoryBill.billing_paid_amount ?? 0),
                                                0,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[11px] text-[#465a69]">
                                <span className="rounded-full bg-[#dfe6ec] px-2 py-0.5 font-semibold text-[#3f5667]">
                                    {selectedHistoryBill.billing_payment_method === 'gcash' || selectedHistoryBill.payment_type === 'gcash' ? 'GCash' : 'Cash'}
                                </span>
                                {(selectedHistoryBill.billing_payment_method === 'gcash' || selectedHistoryBill.payment_type === 'gcash') ? (
                                    <span className="rounded-full bg-[#dfe6ec] px-2 py-0.5 font-semibold text-[#3f5667]">
                                        {selectedHistoryBill.gcash_number || 'No GCash number'}
                                    </span>
                                ) : null}
                                {selectedHistoryBill.billing_receipt_path ? (
                                    <div className="w-full space-y-2 rounded-md border border-[#d8cdc3] bg-white p-2">
                                        <img
                                            src={receiptUrl(selectedHistoryBill.billing_receipt_path) ?? ''}
                                            alt="Saved GCash receipt"
                                            className="max-h-72 w-full rounded-md object-contain"
                                        />
                                        <a
                                            href={receiptUrl(selectedHistoryBill.billing_receipt_path) ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block rounded-full bg-[#dfe6ec] px-2 py-0.5 font-semibold text-[#5f7f95] underline"
                                        >
                                            Open receipt in new tab
                                        </a>
                                    </div>
                                ) : null}
                                <span className="rounded-full bg-[#e8dfd6] px-2 py-0.5 font-semibold text-[#5a6d7c]">
                                    Paid
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedHistoryBill(null)}
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
                                <select
                                    value={selectedPayeeKey}
                                    onChange={(event) => setSelectedPayeeKey(event.target.value)}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                >
                                    <option value="">
                                        {payeeOptions.length > 0
                                            ? 'Select tenant'
                                            : 'No tenants found'}
                                    </option>
                                    {payeeOptions.map((option) => (
                                        <option key={option.key} value={option.key}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Unit #
                                <input
                                    value={newPayee.room}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    readOnly
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
                                    type="date"
                                    value={newPayee.dueDate}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
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

                        {selectedPayee?.downpayment ? (
                            <p className="mt-3 text-xs font-semibold text-[#5f6f7c]">
                                Downpayment: {toPeso(Number(selectedPayee.downpayment) || 0)}
                            </p>
                        ) : null}

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

