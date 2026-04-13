import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Report = {
    tenant: string;
    room: string;
    repair: string;
    date: string;
    price: string;
    status: 'Done' | 'Ongoing';
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

const reports: Report[] = [
    { tenant: 'Jeron Montjejo', room: '03', repair: 'Light bulb', date: '06/15/25', price: 'P 140', status: 'Done' },
    { tenant: 'Nicole Edrian', room: '01', repair: 'Sink', date: '06/16/25', price: 'P 200', status: 'Ongoing' },
    { tenant: 'Faith Gawan', room: '12', repair: 'Door', date: '06/18/25', price: 'P 220', status: 'Ongoing' },
];

const statusStyles: Record<string, string> = {
    Done: 'bg-[#2ca94e] text-white',
    Ongoing: 'bg-[#f0b01f] text-[#312400]',
};

export default function Maintenance() {
    const [openReportForm, setOpenReportForm] = useState(false);
    const [reportList, setReportList] = useState<Report[]>(reports);
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState<'success' | 'error'>('success');
    const [reportErrors, setReportErrors] = useState<{
        repair?: string;
        tenant?: string;
        room?: string;
    }>({});
    const [newReport, setNewReport] = useState({
        repair: '',
        tenant: '',
        room: '',
        note: '',
        date: '06/20/25',
        price: 'P 200',
    });

    const updateReportStatus = (targetReport: Report) => {
        const nextStatus: Report['status'] =
            targetReport.status === 'Ongoing' ? 'Done' : 'Ongoing';

        setReportList((currentReports) =>
            currentReports.map((report) =>
                report.tenant === targetReport.tenant &&
                report.room === targetReport.room &&
                report.repair === targetReport.repair
                    ? { ...report, status: nextStatus }
                    : report,
            ),
        );
        setNoticeType('success');
        setNotice(`Maintenance status updated to ${nextStatus}.`);
    };

    const addReport = () => {
        const unitNumber = parseUnitNumber(newReport.room);
        const nextErrors: {
            repair?: string;
            tenant?: string;
            room?: string;
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

        if (nextErrors.repair || nextErrors.tenant || nextErrors.room) {
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
            status: 'Ongoing',
        };

        setReportList((currentReports) => [...currentReports, reportToAdd]);
        setOpenReportForm(false);
        setNoticeType('success');
        setNotice('Maintenance report added successfully.');
        setNewReport({
            repair: '',
            tenant: '',
            room: '',
            note: '',
            date: '06/20/25',
            price: 'P 200',
        });
        setReportErrors({});
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
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <article className="rounded-md border border-[#d8cdc3] bg-white p-3">
                        <h2 className="mb-2 text-center text-3xl font-bold tracking-wide text-[#2d4b60]">
                            JUNE 2025
                        </h2>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#6f7b86]">
                            {['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'].map((day) => (
                                <div key={day} className="py-1">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
                                <div
                                    key={day}
                                    className={`rounded-sm py-2 ${
                                        day === 15 || day === 22
                                            ? 'bg-[#fce2b9] text-[#9a5d00]'
                                            : 'bg-[#f7f5ee]'
                                    }`}
                                >
                                    {day <= 30 ? day : ''}
                                </div>
                            ))}
                        </div>
                    </article>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => setOpenReportForm(true)}
                            className="rounded-md bg-[#5f7f95] px-5 py-2 text-xs font-semibold text-white"
                        >
                            Add Report
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
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
                                {reportList.map((report) => (
                                    <tr key={`${report.tenant}-${report.room}`} className="border-b border-[#eee6e0] text-[#3e5262]">
                                        <td className="px-3 py-2">{report.tenant}</td>
                                        <td className="px-3 py-2">{report.room}</td>
                                        <td className="px-3 py-2">{report.repair}</td>
                                        <td className="px-3 py-2">{report.date}</td>
                                        <td className="px-3 py-2">{report.price}</td>
                                        <td className="px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() => updateReportStatus(report)}
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[report.status]}`}
                                            >
                                                {report.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                    onChange={(event) =>
                                        {
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
                                <input
                                    value={newReport.tenant}
                                    onChange={(event) =>
                                        {
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
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        reportErrors.tenant
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                    placeholder="e.g. Senta Claus"
                                />
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
                                    onChange={(event) =>
                                        {
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
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        reportErrors.room
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
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
                            <label className="text-xs text-[#4f6271] md:col-span-2">
                                Note
                                <textarea
                                    value={newReport.note}
                                    onChange={(event) =>
                                        setNewReport((current) => ({
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
        </ApartmentLayout>
    );
}
