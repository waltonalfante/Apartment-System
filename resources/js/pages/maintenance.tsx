import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Report = {
    id?: number;
    tenant: string;
    room: string;
    repair: string;
    date: string;
    price: string;
    status: 'Done' | 'Ongoing';
};

type ReportDraft = {
    repair: string;
    tenant: string;
    room: string;
    date: string;
    price: string;
    status: Report['status'];
};

type TenantEntry = {
    id: number;
    room_id: number;
    room_code: string;
    name: string;
};

const maxUnitNumber = 15;

const parseUnitNumber = (value: string) => {
    const normalized = value.trim();

    if (!/^\d{1,2}$/.test(normalized)) {
        return Number.NaN;
    }

    return Number(normalized);
};

const formatUnitNumber = (unitNumber: number) =>
    String(unitNumber).padStart(2, '0');

const sanitizeUnitInput = (value: string) =>
    value.replace(/[^\d]/g, '').slice(0, 2);

const defaultReportDate = new Date().toISOString().slice(0, 10);

const formatReportDate = (value: string) => {
    if (!value) {
        return '';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

const statusStyles: Record<string, string> = {
    Done: 'bg-[#2ca94e] text-white',
    Ongoing: 'bg-[#f0b01f] text-[#312400]',
};

const normalizeReport = (report: any): Report => ({
    id: report.id,
    tenant: report.tenant ?? report.tenant_name ?? '',
    room: report.room ?? report.room_code ?? '',
    repair: report.repair ?? '',
    date: report.date ?? '',
    price: report.price ?? '',
    status: report.status ?? 'Ongoing',
});

export default function Maintenance({ tenants = [] }: { tenants: TenantEntry[] }) {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthLabel = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
    const firstWeekday = currentMonth.getDay();
    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
    ).getDate();
    const calendarSlots = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const calendarDays = Array.from({ length: calendarSlots }, (_, index) => {
        const dayNumber = index - firstWeekday + 1;

        return dayNumber >= 1 && dayNumber <= daysInMonth ? dayNumber : null;
    });
    const [openReportForm, setOpenReportForm] = useState(false);
    const page = usePage();
    const initialReports = (page.props as any).reports ?? [];
    const [reportList, setReportList] = useState<Report[]>(initialReports as Report[]);
    const [listTab, setListTab] = useState<'current' | 'history'>('current');
    const [historySearch, setHistorySearch] = useState('');
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState<'success' | 'error'>('success');
    const [reportErrors, setReportErrors] = useState<{
        repair?: string;
        tenant?: string;
        room?: string;
        date?: string;
    }>({});
    const [newReport, setNewReport] = useState<ReportDraft>({
        repair: '',
        tenant: '',
        room: '',
        date: defaultReportDate,
        price: 'P 200',
        status: 'Ongoing',
    });
    const [newReportTenantId, setNewReportTenantId] = useState<number | 'manual'>(
        tenants[0]?.id ?? 'manual',
    );
    const [isEditReportOpen, setIsEditReportOpen] = useState(false);
    const [editingReportIndex, setEditingReportIndex] = useState<number | null>(null);
    const [editReport, setEditReport] = useState<ReportDraft>({
        repair: '',
        tenant: '',
        room: '',
        date: defaultReportDate,
        price: 'P 200',
        status: 'Ongoing',
    });
    const [editReportTenantId, setEditReportTenantId] = useState<number | 'manual'>('manual');
    const [editErrors, setEditErrors] = useState<{
        repair?: string;
        tenant?: string;
        room?: string;
        date?: string;
    }>({});

    useEffect(() => {
        setReportList((initialReports as any[]).map(normalizeReport));
    }, [initialReports]);

    const currentReports = useMemo(
        () => reportList.filter((report) => report.status !== 'Done'),
        [reportList],
    );

    const normalizedHistorySearch = historySearch.trim().toLowerCase();
    const historyReports = useMemo(
        () =>
            reportList.filter((report) => {
                if (report.status !== 'Done') {
                    return false;
                }

                if (!normalizedHistorySearch) {
                    return true;
                }

                return [report.tenant, report.room, report.repair, report.date, report.price]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedHistorySearch);
            }),
        [normalizedHistorySearch, reportList],
    );

    const openEditReport = (targetReport: Report) => {
        if (!targetReport.id) {
            return;
        }

        setEditingReportIndex(targetReport.id);
        setEditErrors({});
        setEditReport({
            repair: targetReport.repair,
            tenant: targetReport.tenant,
            room: targetReport.room,
            date: targetReport.date || defaultReportDate,
            price: targetReport.price,
            status: targetReport.status,
        });
        const matchedTenant = tenants.find(
            (tenant) => tenant.name === targetReport.tenant && tenant.room_code === targetReport.room,
        );
        setEditReportTenantId(matchedTenant?.id ?? 'manual');
        setIsEditReportOpen(true);
    };

    // When the selected tenant id for the add form changes, keep the newReport fields in sync
    useEffect(() => {
        if (newReportTenantId === 'manual') {
            setNewReport((current) => ({ ...current, tenant: '', room: '' }));

            return;
        }

        const selected = tenants.find((t) => t.id === newReportTenantId);

        if (selected) {
            setNewReport((current) => ({
                ...current,
                tenant: selected.name,
                room: selected.room_code,
            }));
        }
    }, [newReportTenantId, tenants]);

    const openAddReport = () => {
        const initialTenantId = tenants[0]?.id ?? 'manual';
        setNewReportTenantId(initialTenantId);

        if (initialTenantId === 'manual') {
            setNewReport({
                repair: '',
                tenant: '',
                room: '',
                date: defaultReportDate,
                price: 'P 200',
                status: 'Ongoing',
            });
        } else {
            const selected = tenants.find((t) => t.id === initialTenantId);
            setNewReport((current) => ({
                ...current,
                tenant: selected?.name ?? '',
                room: selected?.room_code ?? '',
                date: defaultReportDate,
                repair: '',
                price: 'P 200',
                status: 'Ongoing',
            }));
        }

        setReportErrors({});
        setOpenReportForm(true);
    };

    const saveEditedReport = () => {
        if (editingReportIndex === null) {
            return;
        }

        const unitNumber = parseUnitNumber(editReport.room);
        const nextErrors: {
            repair?: string;
            tenant?: string;
            room?: string;
            date?: string;
        } = {};

        if (editReport.repair.trim().length < 2) {
            nextErrors.repair = 'Maintenance item must be at least 2 characters.';
        }

        if (editReport.tenant.trim().length < 3) {
            nextErrors.tenant = 'Tenant name must be at least 3 characters.';
        }

        if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > maxUnitNumber) {
            nextErrors.room = 'Unit number must be between 01 and 15 only.';
        }

        if (!editReport.date) {
            nextErrors.date = 'Select a valid date.';
        }

        if (nextErrors.repair || nextErrors.tenant || nextErrors.room || nextErrors.date) {
            setEditErrors(nextErrors);

            return;
        }

        const target = reportList.find((report) => report.id === editingReportIndex);

        if (!target) {
return;
}

        router.patch(`/maintenance/reports/${target.id}`, {
            tenant_id: editReportTenantId === 'manual' ? null : editReportTenantId,
            tenant_name: editReport.tenant.trim(),
            room: formatUnitNumber(unitNumber),
            repair: editReport.repair.trim(),
            date: editReport.date,
            price: editReport.price,
            status: editReport.status,
            notes: editReport.note ?? '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNoticeType('success');
                setNotice('Maintenance report updated successfully.');
                setIsEditReportOpen(false);
                setEditingReportIndex(null);
                router.reload();
            },
        });
    };

    const addReport = () => {
        const unitNumber = parseUnitNumber(newReport.room);
        const nextErrors: {
            repair?: string;
            tenant?: string;
            room?: string;
            date?: string;
        } = {};

        if (newReport.repair.trim().length < 2) {
            nextErrors.repair = 'Maintenance item must be at least 2 characters.';
        }

        if (newReport.tenant.trim().length < 3) {
            nextErrors.tenant = 'Tenant name must be at least 3 characters.';
        }

        if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > maxUnitNumber) {
            nextErrors.room = 'Unit number must be between 01 and 15 only.';
        }

        if (!newReport.date) {
            nextErrors.date = 'Select a valid date.';
        }

        if (nextErrors.repair || nextErrors.tenant || nextErrors.room || nextErrors.date) {
            setReportErrors(nextErrors);
            setNotice('');

            return;
        }

        setReportErrors({});

        const reportToAdd: Report = {
            tenant: newReport.tenant.trim(),
            room: formatUnitNumber(unitNumber),
            repair: newReport.repair.trim(),
            date: newReport.date,
            price: newReport.price,
            status: newReport.status,
        };

        router.post('/maintenance/reports', {
            tenant_id: newReportTenantId === 'manual' ? null : newReportTenantId,
            tenant_name: reportToAdd.tenant,
            room: reportToAdd.room,
            repair: reportToAdd.repair,
            date: reportToAdd.date,
            price: reportToAdd.price,
            status: reportToAdd.status,
            notes: '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenReportForm(false);
                setNoticeType('success');
                setNotice('Maintenance report added successfully.');
                setNewReport({
                    repair: '',
                    tenant: '',
                    room: '',
                    date: defaultReportDate,
                    price: 'P 200',
                    status: 'Ongoing',
                });
                setNewReportTenantId(tenants[0]?.id ?? 'manual');
                setReportErrors({});
                router.reload();
            },
        });
    };

    const handleTenantSelect = (
        value: string,
        setTenantId: (next: number | 'manual') => void,
        updateReport: (tenantName: string, roomCode: string) => void,
    ) => {
        if (value === 'manual') {
            setTenantId('manual');
            updateReport('', '');

            return;
        }

        const selectedId = Number(value);
        const selectedTenant = tenants.find((tenant) => tenant.id === selectedId);

        if (!selectedTenant) {
            setTenantId('manual');
            updateReport('', '');

            return;
        }

        setTenantId(selectedId);
        updateReport(selectedTenant.name, selectedTenant.room_code);
    };

    return (
        <ApartmentLayout title="Maintenance">
            <Head title="Maintenance" />

            {notice && noticeType === 'success' ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {notice}
                </div>
            ) : null}

            <section className="space-y-4 rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                    <article className="rounded-md border border-[#d8cdc3] bg-white p-3">
                        <h2 className="mb-2 text-center text-3xl font-bold tracking-wide text-[#2d4b60]">
                            {monthLabel}
                        </h2>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#6f7b86]">
                            {['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'].map((day) => (
                                <div key={day} className="py-1">
                                    {day}
                                </div>
                            ))}
                            {calendarDays.map((day, index) => {
                                const isToday =
                                    day !== null &&
                                    day === today.getDate() &&
                                    currentMonth.getMonth() === today.getMonth() &&
                                    currentMonth.getFullYear() === today.getFullYear();

                                return (
                                    <div
                                        key={`day-${index}`}
                                        className={`rounded-sm py-2 ${
                                            isToday
                                                ? 'bg-[#5f7f95] text-white'
                                                : 'bg-[#f7f5ee] text-[#6f7b86]'
                                        }`}
                                    >
                                        {day ?? ''}
                                    </div>
                                );
                            })}
                        </div>
                    </article>

                    <div className="rounded-md border border-[#d8cdc3] bg-[#f8f7f3] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2f4e64]">
                            Maintenance log
                        </p>
                        <p className="mt-2 max-w-md text-sm text-[#5f6f7c]">
                            Track ongoing repairs here. Current items stay active, and completed jobs move to history.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setListTab('current')}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                                    listTab === 'current'
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                Current
                            </button>
                            <button
                                type="button"
                                onClick={() => setListTab('history')}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                                    listTab === 'history'
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                History
                            </button>
                            <button
                                type="button"
                                onClick={openAddReport}
                                className="rounded-md bg-[#5f7f95] px-5 py-2 text-xs font-semibold text-white"
                            >
                                Add Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#ddd3c8] px-3 py-2">
                        <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            {listTab === 'history' ? 'Maintenance History' : 'Current Maintenance'}
                        </h3>
                        {listTab === 'history' ? (
                            <input
                                value={historySearch}
                                onChange={(event) => setHistorySearch(event.target.value)}
                                placeholder="Search history"
                                className="h-8 w-48 rounded-md border border-[#c9bbb0] bg-white px-2 text-xs text-[#3f5667] outline-none"
                            />
                        ) : null}
                    </div>

                    {listTab === 'history' ? (
                        <>
                            <div className="apartment-scrollbar max-h-[280px] overflow-auto">
                                <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                                    <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                        <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                            <th className="px-3 py-2 font-semibold">Tenant Name</th>
                                            <th className="px-3 py-2 font-semibold">Room #</th>
                                            <th className="px-3 py-2 font-semibold">Repair</th>
                                            <th className="px-3 py-2 font-semibold">Start Date</th>
                                            <th className="px-3 py-2 font-semibold">Price</th>
                                            <th className="px-3 py-2 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyReports.map((report) => (
                                            <tr key={report.id ?? `${report.tenant}-${report.room}-${report.repair}`} className="border-b border-[#eee6e0] text-[#3e5262]">
                                                <td className="px-3 py-2">{report.tenant}</td>
                                                <td className="px-3 py-2">{report.room}</td>
                                                <td className="px-3 py-2">{report.repair}</td>
                                                <td className="px-3 py-2">{formatReportDate(report.date)}</td>
                                                <td className="px-3 py-2">{report.price}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[report.status]}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {historyReports.length === 0 ? (
                                <p className="px-3 py-3 text-xs text-[#6f7b86]">
                                    No maintenance history yet.
                                </p>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <div className="apartment-scrollbar max-h-[280px] overflow-auto">
                                <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                                    <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                        <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                            <th className="px-3 py-2 font-semibold">Tenant Name</th>
                                            <th className="px-3 py-2 font-semibold">Room #</th>
                                            <th className="px-3 py-2 font-semibold">Repair</th>
                                            <th className="px-3 py-2 font-semibold">Start Date</th>
                                            <th className="px-3 py-2 font-semibold">Price</th>
                                            <th className="px-3 py-2 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentReports.map((report) => (
                                            <tr key={report.id ?? `${report.tenant}-${report.room}-${report.repair}`} className="border-b border-[#eee6e0] text-[#3e5262]">
                                                <td className="px-3 py-2">{report.tenant}</td>
                                                <td className="px-3 py-2">{report.room}</td>
                                                <td className="px-3 py-2">{report.repair}</td>
                                                <td className="px-3 py-2">{formatReportDate(report.date)}</td>
                                                <td className="px-3 py-2">{report.price}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[report.status]}`}>
                                                            {report.status}
                                                        </span>
                                                        {report.id ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditReport(report)}
                                                                className="rounded-md border border-[#c9bbb0] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#3f5667]"
                                                                aria-label="Edit report"
                                                            >
                                                                ...
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {currentReports.length === 0 ? (
                                <p className="px-3 py-3 text-xs text-[#6f7b86]">
                                    No maintenance reports yet.
                                </p>
                            ) : null}
                        </>
                    )}
                </div>
            </section>

            {openReportForm ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setOpenReportForm(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-2xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-center text-lg font-semibold uppercase text-[#2f4e64]">
                            Add Report
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Maintenance
                                <input
                                    value={newReport.repair}
                                    onChange={(event) => {
                                            setNewReport((current) => ({
                                                ...current,
                                                repair: event.target.value,
                                            }));

                                            if (reportErrors.repair) {
                                                setReportErrors((current) => ({
                                                    ...current,
                                                    repair: undefined,
                                                }));
                                            }
                                        }
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        reportErrors.repair
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                    placeholder="e.g. Faucet"
                                />
                                {reportErrors.repair ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {reportErrors.repair}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <select
                                    value={String(newReportTenantId)}
                                    onChange={(event) =>
                                        handleTenantSelect(
                                            event.target.value,
                                            setNewReportTenantId,
                                            (tenantName, roomCode) =>
                                                setNewReport((current) => ({
                                                    ...current,
                                                    tenant: tenantName,
                                                    room: roomCode,
                                                })),
                                        )
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        reportErrors.tenant
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                >
                                    {tenants.length === 0 ? (
                                        <option value="manual">No tenants available</option>
                                    ) : null}
                                    <option value="manual">Manual Entry</option>
                                    {tenants.map((tenant) => (
                                        <option key={tenant.id} value={tenant.id}>
                                            {tenant.name} (Room {tenant.room_code})
                                        </option>
                                    ))}
                                </select>
                                {newReportTenantId === 'manual' ? (
                                    <input
                                        value={newReport.tenant}
                                        onChange={(event) => {
                                                setNewReport((current) => ({
                                                    ...current,
                                                    tenant: event.target.value,
                                                }));

                                                if (reportErrors.tenant) {
                                                    setReportErrors((current) => ({
                                                        ...current,
                                                        tenant: undefined,
                                                    }));
                                                }
                                            }
                                        }
                                        className={`mt-2 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                            reportErrors.tenant
                                                ? 'border border-[#d84a4a]'
                                                : 'border border-[#dbd2c8]'
                                        }`}
                                        placeholder="Enter tenant name"
                                    />
                                ) : null}
                                {reportErrors.tenant ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {reportErrors.tenant}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Room Number
                                <input
                                    value={newReport.room}
                                    onChange={(event) => {
                                            if (newReportTenantId !== 'manual') {
                                                return;
                                            }

                                            setNewReport((current) => ({
                                                ...current,
                                                room: sanitizeUnitInput(event.target.value),
                                            }));

                                            if (reportErrors.room) {
                                                setReportErrors((current) => ({
                                                    ...current,
                                                    room: undefined,
                                                }));
                                            }
                                        }
                                    }
                                    readOnly={newReportTenantId !== 'manual'}
                                    className={`mt-1 h-9 w-full rounded-md px-2 text-xs outline-none ${
                                        reportErrors.room
                                            ? 'border border-[#d84a4a]'
                                            : newReportTenantId !== 'manual'
                                              ? 'border border-[#dbd2c8] bg-[#f3f1ec]'
                                              : 'border border-[#dbd2c8] bg-white'
                                    }`}
                                    placeholder="01 - 15"
                                    inputMode="numeric"
                                    maxLength={2}
                                />
                                {reportErrors.room ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {reportErrors.room}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Date
                                <input
                                    type="date"
                                    value={newReport.date}
                                    onChange={(event) =>
                                        setNewReport((current) => ({
                                            ...current,
                                            date: event.target.value,
                                        }))
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        reportErrors.date
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                />
                                {reportErrors.date ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {reportErrors.date}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Price
                                <input
                                    value={newReport.price}
                                    onChange={(event) =>
                                        setNewReport((current) => ({
                                            ...current,
                                            price: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    placeholder="P 200"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setOpenReportForm(false)}
                                className="rounded-md bg-[#5f7f95] px-6 py-1.5 text-xs font-semibold text-white"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={addReport}
                                className="rounded-md bg-[#5f7f95] px-6 py-1.5 text-xs font-semibold text-white"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isEditReportOpen ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => {
                        setIsEditReportOpen(false);
                        setEditingReportIndex(null);
                        setEditErrors({});
                    }}
                >
                    <div
                        className="apartment-modal-content w-full max-w-2xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-center text-lg font-semibold uppercase text-[#2f4e64]">
                            Edit Report
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Maintenance
                                <input
                                    value={editReport.repair}
                                    onChange={(event) =>
                                        setEditReport((current) => ({
                                            ...current,
                                            repair: event.target.value,
                                        }))
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        editErrors.repair
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                    placeholder="e.g. Faucet"
                                />
                                {editErrors.repair ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {editErrors.repair}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <select
                                    value={String(editReportTenantId)}
                                    onChange={(event) =>
                                        handleTenantSelect(
                                            event.target.value,
                                            setEditReportTenantId,
                                            (tenantName, roomCode) =>
                                                setEditReport((current) => ({
                                                    ...current,
                                                    tenant: tenantName,
                                                    room: roomCode,
                                                })),
                                        )
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        editErrors.tenant
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                >
                                    <option value="manual">Manual Entry</option>
                                    {tenants.map((tenant) => (
                                        <option key={tenant.id} value={tenant.id}>
                                            {tenant.name} (Room {tenant.room_code})
                                        </option>
                                    ))}
                                </select>
                                {editReportTenantId === 'manual' ? (
                                    <input
                                        value={editReport.tenant}
                                        onChange={(event) =>
                                            setEditReport((current) => ({
                                                ...current,
                                                tenant: event.target.value,
                                            }))
                                        }
                                        className={`mt-2 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                            editErrors.tenant
                                                ? 'border border-[#d84a4a]'
                                                : 'border border-[#dbd2c8]'
                                        }`}
                                        placeholder="Enter tenant name"
                                    />
                                ) : null}
                                {editErrors.tenant ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {editErrors.tenant}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Room Number
                                <input
                                    value={editReport.room}
                                    onChange={(event) => {
                                            if (editReportTenantId !== 'manual') {
                                                return;
                                            }

                                            setEditReport((current) => ({
                                                ...current,
                                                room: sanitizeUnitInput(event.target.value),
                                            }));
                                        }
                                    }
                                    readOnly={editReportTenantId !== 'manual'}
                                    className={`mt-1 h-9 w-full rounded-md px-2 text-xs outline-none ${
                                        editErrors.room
                                            ? 'border border-[#d84a4a]'
                                            : editReportTenantId !== 'manual'
                                              ? 'border border-[#dbd2c8] bg-[#f3f1ec]'
                                              : 'border border-[#dbd2c8] bg-white'
                                    }`}
                                    placeholder="01 - 15"
                                    inputMode="numeric"
                                    maxLength={2}
                                />
                                {editErrors.room ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {editErrors.room}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Date
                                <input
                                    type="date"
                                    value={editReport.date}
                                    onChange={(event) =>
                                        setEditReport((current) => ({
                                            ...current,
                                            date: event.target.value,
                                        }))
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        editErrors.date
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                />
                                {editErrors.date ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {editErrors.date}
                                    </p>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Price
                                <input
                                    value={editReport.price}
                                    onChange={(event) =>
                                        setEditReport((current) => ({
                                            ...current,
                                            price: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    placeholder="P 200"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Status
                                <select
                                    value={editReport.status}
                                    onChange={(event) =>
                                        setEditReport((current) => ({
                                            ...current,
                                            status: event.target.value as Report['status'],
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                >
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Done">Done</option>
                                </select>
                            </label>
                            <label className="text-xs text-[#4f6271] md:col-span-2">
                                Note
                                <textarea
                                    value={editReport.note}
                                    onChange={(event) =>
                                        setEditReport((current) => ({
                                            ...current,
                                            note: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-md border border-[#dbd2c8] bg-white p-2 text-xs outline-none"
                                    rows={4}
                                    placeholder="Add a note..."
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditReportOpen(false);
                                    setEditingReportIndex(null);
                                    setEditErrors({});
                                }}
                                className="rounded-md border border-[#c9bbb0] bg-white px-6 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveEditedReport}
                                className="rounded-md bg-[#5f7f95] px-6 py-1.5 text-xs font-semibold text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
