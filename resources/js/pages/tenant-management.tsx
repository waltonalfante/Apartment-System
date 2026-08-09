import { Head, router, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Tenant = {
    id: number;
    roomId: number;
    avatar: string;
    name: string;
    room: string;
    gender: 'Male' | 'Female';
    contact: string;
    optionalContact: string;
    email: string;
    checkInDate: string;
    checkOutDate: string;
    archivedAt?: string;
};

type TenantEntry = {
    id: number;
    room_id: number;
    room: string;
    name: string;
    gender: 'Male' | 'Female';
    contact: string;
    optional_contact: string | null;
    email: string;
    check_in_date?: string | null;
    check_out_date?: string | null;
    archived_at?: string | null;
};

type ReservationEntry = {
    id: number;
    room_id: number;
    room_code: string;
    name: string;
    check_in_date?: string | null;
    check_out_date?: string | null;
};

const parseRoomNumber = (value: string) => {
    const normalized = value.trim();

    if (!/^\d{1,3}$/.test(normalized)) {
        return Number.NaN;
    }

    return Number(normalized);
};

const formatRoomNumber = (roomNumber: number) =>
    String(roomNumber).padStart(2, '0');

const sanitizeRoomInput = (value: string) =>
    value.replace(/[^\d]/g, '').slice(0, 3);

const sanitizeContactInput = (value: string) =>
    value.replace(/[^\d]/g, '').slice(0, 11);

const openDatePicker = (
    event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
) => {
    const input = event.currentTarget as HTMLInputElement & { showPicker?: () => void };
    input.showPicker?.();
};

const isValidContactNumber = (value: string) =>
    /^\d{11}$/.test(value.trim());

const hasDuplicateContactNumber = (
    value: string,
    tenants: Tenant[],
    excludedTenantId?: number,
) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
        return false;
    }

    return tenants.some((tenant) => {
        if (tenant.id === excludedTenantId) {
            return false;
        }

        return (
            tenant.contact.trim() === normalizedValue ||
            tenant.optionalContact.trim() === normalizedValue
        );
    });
};

const buildAvatar = (name: string) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const mapTenantEntry = (tenant: TenantEntry): Tenant => ({
    id: tenant.id,
    roomId: tenant.room_id,
    avatar: buildAvatar(tenant.name),
    name: tenant.name,
    room: tenant.room,
    gender: tenant.gender,
    contact: tenant.contact,
    optionalContact: tenant.optional_contact ?? '',
    email: tenant.email,
    checkInDate: tenant.check_in_date ?? '',
    checkOutDate: tenant.check_out_date ?? '',
    archivedAt: tenant.archived_at ?? '',
});

export default function TenantManagement({
    roomLimit = 15,
    tenants,
    reservations,
    archivedTenants,
}: {
    roomLimit?: number;
    tenants: TenantEntry[];
    reservations: ReservationEntry[];
    archivedTenants: TenantEntry[];
}) {
    const maxRoomNumber = Math.max(roomLimit, 1);
    const [tenantList, setTenantList] = useState<Tenant[]>(
        tenants.map(mapTenantEntry),
    );
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState<'success' | 'error'>('success');
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCheckoutPromptOpen, setIsCheckoutPromptOpen] = useState(false);
    const [checkoutReservation, setCheckoutReservation] = useState<ReservationEntry | null>(null);
    const [earlyCheckInDate, setEarlyCheckInDate] = useState('');
    const [isExtendStayOpen, setIsExtendStayOpen] = useState(false);
    const [extendStayDate, setExtendStayDate] = useState('');
    const [isExtendStayConfirmOpen, setIsExtendStayConfirmOpen] = useState(false);
    const { props } = usePage<{
        flash?: {
            success?: string | null;
            error?: string | null;
        };
        errors?: Record<string, string>;
    }>();
    const flash = props.flash;
    const formErrors = props.errors ?? {};

    useEffect(() => {
        setTenantList(tenants.map(mapTenantEntry));
    }, [tenants]);

    const archivedTenantList = useMemo(
        () => archivedTenants.map(mapTenantEntry),
        [archivedTenants],
    );

    const reservationsByRoomId = useMemo(
        () => new Map(reservations.map((reservation) => [reservation.room_id, reservation])),
        [reservations],
    );

    const todayText = new Date().toISOString().slice(0, 10);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filterTenants = (list: Tenant[]) =>
        !normalizedSearch
            ? list
            : list.filter((tenant) =>
                  [
                      tenant.name,
                      tenant.room,
                      tenant.contact,
                      tenant.email,
                  ]
                      .join(' ')
                      .toLowerCase()
                      .includes(normalizedSearch),
              );

    const filteredActiveTenants = filterTenants(tenantList);
    const filteredArchivedTenants = filterTenants(archivedTenantList);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0) {
            return;
        }

        const firstError = Object.values(formErrors)[0];

        if (!firstError) {
            return;
        }

        setNoticeType('error');
        setNotice(firstError);
    }, [formErrors]);

    const saveTenantChanges = () => {
        if (!selectedTenant) {
            return;
        }

        const roomNumber = parseRoomNumber(selectedTenant.room);
        const primaryContact = selectedTenant.contact.trim();
        const backupContact = selectedTenant.optionalContact.trim();
        const checkInDate = selectedTenant.checkInDate.trim();
        const checkOutDate = selectedTenant.checkOutDate.trim();
        const hasDuplicateRoom = tenantList.some(
            (tenant) =>
                tenant.id !== selectedTenant.id &&
                parseRoomNumber(tenant.room) === roomNumber,
        );

        if (!Number.isInteger(roomNumber) || roomNumber < 1 || roomNumber > maxRoomNumber) {
            setNoticeType('error');
            setNotice(`Room number must be between 01 and ${formatRoomNumber(maxRoomNumber)} only.`);

            return;
        }

        if (!isValidContactNumber(primaryContact)) {
            setNoticeType('error');
            setNotice('Contact number must be exactly 11 digits.');

            return;
        }

        if (backupContact && !isValidContactNumber(backupContact)) {
            setNoticeType('error');
            setNotice('Optional contact number must be exactly 11 digits.');

            return;
        }

        if (primaryContact === backupContact && backupContact) {
            setNoticeType('error');
            setNotice('Primary and optional contact numbers must be different.');

            return;
        }

        if (!checkInDate) {
            setNoticeType('error');
            setNotice('Check-in date is required.');

            return;
        }

        if (checkOutDate && checkOutDate < checkInDate) {
            setNoticeType('error');
            setNotice('Check-out date must be after check-in date.');

            return;
        }

        if (hasDuplicateContactNumber(primaryContact, tenantList, selectedTenant.id)) {
            setNoticeType('error');
            setNotice('This contact number is already assigned to another tenant.');

            return;
        }

        if (
            backupContact &&
            hasDuplicateContactNumber(backupContact, tenantList, selectedTenant.id)
        ) {
            setNoticeType('error');
            setNotice('This optional contact number is already assigned to another tenant.');

            return;
        }

        if (hasDuplicateRoom) {
            setNoticeType('error');
            setNotice(`Room ${formatRoomNumber(roomNumber)} already has a tenant.`);

            return;
        }

        router.patch(
            `/tenant-management/tenants/${selectedTenant.id}`,
            {
                name: selectedTenant.name.trim(),
                room: formatRoomNumber(roomNumber),
                gender: selectedTenant.gender,
                contact: primaryContact,
                optional_contact: backupContact || null,
                email: selectedTenant.email.trim(),
                check_in_date: checkInDate,
                check_out_date: checkOutDate || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedTenant(null);
                },
            },
        );
    };

    const deleteTenant = () => {
        if (!selectedTenant) {
            return;
        }

        router.delete(`/tenant-management/tenants/${selectedTenant.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedTenant(null);
            },
        });
    };

    const submitCheckout = (action: 'normal' | 'reschedule' | 'checkin_now') => {
        if (!selectedTenant) {
            return;
        }

        if (action === 'reschedule' && !earlyCheckInDate) {
            setNoticeType('error');
            setNotice('New check-in date is required for rescheduling.');

            return;
        }

        const reservation = checkoutReservation
            ?? reservationsByRoomId.get(selectedTenant.roomId)
            ?? null;

        router.patch(
            `/tenant-management/tenants/${selectedTenant.id}/checkout`,
            {
                action,
                reservation_id: reservation?.id ?? null,
                reschedule_check_in: action === 'reschedule' ? earlyCheckInDate || todayText : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCheckoutPromptOpen(false);
                    setCheckoutReservation(null);
                    setSelectedTenant(null);
                },
            },
        );
    };

    const openCheckoutPrompt = () => {
        if (!selectedTenant) {
            return;
        }

        const reservation = reservationsByRoomId.get(selectedTenant.roomId) ?? null;
        const isEarlyCheckout = Boolean(
            selectedTenant.checkOutDate && selectedTenant.checkOutDate > todayText,
        );

        if (reservation && isEarlyCheckout) {
            setCheckoutReservation(reservation);
            setEarlyCheckInDate(todayText);
            setIsCheckoutPromptOpen(true);

            return;
        }

        submitCheckout('normal');
    };

    const openExtendStay = () => {
        if (!selectedTenant) {
            return;
        }

        setExtendStayDate(selectedTenant.checkOutDate || todayText);
        setIsExtendStayConfirmOpen(false);
        setIsExtendStayOpen(true);
    };

    const submitExtendStay = (pushReservation: boolean) => {
        if (!selectedTenant) {
            return;
        }

        if (!extendStayDate) {
            setNoticeType('error');
            setNotice('New check-out date is required.');

            return;
        }

        if (selectedTenant.checkInDate && extendStayDate < selectedTenant.checkInDate) {
            setNoticeType('error');
            setNotice('New check-out date must be after check-in date.');

            return;
        }

        router.patch(
            `/tenant-management/tenants/${selectedTenant.id}/extend-stay`,
            {
                new_check_out_date: extendStayDate,
                push_reservation: pushReservation,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsExtendStayConfirmOpen(false);
                    setIsExtendStayOpen(false);
                    setSelectedTenant(null);
                },
            },
        );
    };


    return (
        <ApartmentLayout title="Tenant Management">
            <Head title="Tenant Management" />

            {notice && !flash?.success && !flash?.error ? (
                <div
                    className={`mb-4 rounded-md px-3 py-2 text-xs font-semibold text-white ${
                        noticeType === 'success' ? 'bg-[#2ca94e]' : 'bg-[#d84a4a]'
                    }`}
                >
                    {notice}
                </div>
            ) : null}

            <section className="min-w-0 rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                        Tenant Management
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex gap-2 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab('active')}
                                className={`rounded-md px-3 py-1.5 ${
                                    activeTab === 'active'
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                Active
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('archived')}
                                className={`rounded-md px-3 py-1.5 ${
                                    activeTab === 'archived'
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                Archived
                            </button>
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search tenant"
                            className="h-8 w-48 rounded-md border border-[#c9bbb0] bg-white px-2 text-xs text-[#3f5667] outline-none"
                        />
                    </div>
                </div>

                {activeTab === 'active' ? (
                    <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                        <div className="apartment-scrollbar max-h-[520px] overflow-x-auto overflow-y-auto">
                            <table className="w-full min-w-[920px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                    <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                        <th className="px-3 py-2 font-semibold">Tenants</th>
                                        <th className="px-3 py-2 font-semibold">Room</th>
                                        <th className="px-3 py-2 font-semibold">Name</th>
                                        <th className="px-3 py-2 font-semibold">Contact Number</th>
                                        <th className="px-3 py-2 font-semibold">Optional Number</th>
                                        <th className="px-3 py-2 font-semibold">Email</th>
                                        <th className="px-3 py-2 font-semibold">Check-in</th>
                                        <th className="px-3 py-2 font-semibold">Check-out</th>
                                        <th className="px-3 py-2 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredActiveTenants.map((tenant) => (
                                        <tr
                                            key={tenant.id}
                                            className="border-b border-[#eee6e0] text-[#3e5262]"
                                        >
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#54758b] text-[11px] font-semibold text-white">
                                                        {tenant.avatar}
                                                    </div>
                                                    <span>Tenant</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">{tenant.room}</td>
                                            <td className="px-3 py-2">{tenant.name}</td>
                                            <td className="px-3 py-2">{tenant.contact}</td>
                                            <td className="px-3 py-2">{tenant.optionalContact || '-'}</td>
                                            <td className="px-3 py-2">{tenant.email}</td>
                                            <td className="px-3 py-2">{tenant.checkInDate || '-'}</td>
                                            <td className="px-3 py-2">{tenant.checkOutDate || '-'}</td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedTenant(tenant)}
                                                    className="rounded-md bg-[#5f7f95] px-3 py-1 text-[11px] font-semibold text-white"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredActiveTenants.length === 0 ? (
                            <p className="px-3 py-3 text-xs text-[#6f7b86]">
                                No tenants found.
                            </p>
                        ) : null}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                        <div className="apartment-scrollbar max-h-[520px] overflow-x-auto overflow-y-auto">
                            <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                    <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                        <th className="px-3 py-2 font-semibold">Room</th>
                                        <th className="px-3 py-2 font-semibold">Name</th>
                                        <th className="px-3 py-2 font-semibold">Contact Number</th>
                                        <th className="px-3 py-2 font-semibold">Email</th>
                                        <th className="px-3 py-2 font-semibold">Check-in</th>
                                        <th className="px-3 py-2 font-semibold">Check-out</th>
                                        <th className="px-3 py-2 font-semibold">Archived</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArchivedTenants.map((tenant) => (
                                        <tr
                                            key={`archived-${tenant.id}`}
                                            className="border-b border-[#eee6e0] text-[#3e5262]"
                                        >
                                            <td className="px-3 py-2">{tenant.room}</td>
                                            <td className="px-3 py-2">{tenant.name}</td>
                                            <td className="px-3 py-2">{tenant.contact}</td>
                                            <td className="px-3 py-2">{tenant.email}</td>
                                            <td className="px-3 py-2">{tenant.checkInDate || '-'}</td>
                                            <td className="px-3 py-2">{tenant.checkOutDate || '-'}</td>
                                            <td className="px-3 py-2">{tenant.archivedAt || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredArchivedTenants.length === 0 ? (
                            <p className="px-3 py-3 text-xs text-[#6f7b86]">
                                No archived tenants yet.
                            </p>
                        ) : null}
                    </div>
                )}
            </section>

            {selectedTenant ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedTenant(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-2xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                                Tenant Management View + Edit
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedTenant(null)}
                                className="text-xs font-semibold text-[#7f95a3]"
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <div className="mt-1 flex items-center rounded-md border border-[#dbd2c8] bg-white px-2">
                                    <input
                                        className="h-8 w-full bg-transparent text-xs outline-none"
                                        value={selectedTenant.name}
                                        onChange={(event) =>
                                            setSelectedTenant((current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          name: event.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                    />
                                    <Pencil className="h-3.5 w-3.5 text-[#7b8d99]" />
                                </div>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Room Number
                                <div className="mt-1 flex items-center rounded-md border border-[#dbd2c8] bg-white px-2">
                                    <input
                                        className="h-8 w-full bg-transparent text-xs outline-none"
                                        value={selectedTenant.room}
                                        onChange={(event) =>
                                            setSelectedTenant((current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          room: sanitizeRoomInput(event.target.value),
                                                      }
                                                    : null,
                                            )
                                        }
                                        inputMode="numeric"
                                    />
                                    <Pencil className="h-3.5 w-3.5 text-[#7b8d99]" />
                                </div>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Contact Number
                                <div className="mt-1 flex items-center rounded-md border border-[#dbd2c8] bg-white px-2">
                                    <input
                                        className="h-8 w-full bg-transparent text-xs outline-none"
                                        value={selectedTenant.contact}
                                        onChange={(event) =>
                                            setSelectedTenant((current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          contact: sanitizeContactInput(event.target.value),
                                                      }
                                                    : null,
                                            )
                                        }
                                        inputMode="numeric"
                                        maxLength={11}
                                    />
                                    <Pencil className="h-3.5 w-3.5 text-[#7b8d99]" />
                                </div>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Optional Contact Number
                                <div className="mt-1 flex items-center rounded-md border border-[#dbd2c8] bg-white px-2">
                                    <input
                                        className="h-8 w-full bg-transparent text-xs outline-none"
                                        value={selectedTenant.optionalContact}
                                        onChange={(event) =>
                                            setSelectedTenant((current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          optionalContact: sanitizeContactInput(event.target.value),
                                                      }
                                                    : null,
                                            )
                                        }
                                        inputMode="numeric"
                                        maxLength={11}
                                    />
                                    <Pencil className="h-3.5 w-3.5 text-[#7b8d99]" />
                                </div>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email Address
                                <div className="mt-1 flex items-center rounded-md border border-[#dbd2c8] bg-white px-2">
                                    <input
                                        className="h-8 w-full bg-transparent text-xs outline-none"
                                        value={selectedTenant.email}
                                        onChange={(event) =>
                                            setSelectedTenant((current) =>
                                                current
                                                    ? {
                                                          ...current,
                                                          email: event.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                    />
                                    <Pencil className="h-3.5 w-3.5 text-[#7b8d99]" />
                                </div>
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Check-in Date
                                <input
                                    type="date"
                                    className="mt-1 h-8 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    value={selectedTenant.checkInDate}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
                                    onChange={(event) =>
                                        setSelectedTenant((current) =>
                                            current
                                                ? {
                                                      ...current,
                                                      checkInDate: event.target.value,
                                                  }
                                                : null,
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Check-out Date
                                <input
                                    type="date"
                                    className="mt-1 h-8 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    value={selectedTenant.checkOutDate}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
                                    onChange={(event) =>
                                        setSelectedTenant((current) =>
                                            current
                                                ? {
                                                      ...current,
                                                      checkOutDate: event.target.value,
                                                  }
                                                : null,
                                        )
                                    }
                                />
                            </label>
                        </div>

                        <div className="mb-4 flex flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={openExtendStay}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Extend Stay
                            </button>
                            <button
                                type="button"
                                onClick={openCheckoutPrompt}
                                className="rounded-md bg-[#f0b01f] px-4 py-1.5 text-xs font-semibold text-[#312400]"
                            >
                                Confirm Check-out
                            </button>
                            <button
                                type="button"
                                onClick={saveTenantChanges}
                                className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={deleteTenant}
                                className="rounded-md bg-[#d84a4a] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isExtendStayOpen && selectedTenant ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsExtendStayOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            Extend Stay - Room {selectedTenant.room}
                        </h3>
                        <p className="mt-1 text-xs text-[#6f7b86]">
                            Set the new check-out date for this tenant.
                        </p>
                        <label className="mt-3 block text-xs text-[#4f6271]">
                            New Check-out Date
                            <input
                                type="date"
                                value={extendStayDate}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(event) => setExtendStayDate(event.target.value)}
                                className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                            />
                        </label>

                        {reservationsByRoomId.get(selectedTenant.roomId) ? (
                            <div className="mt-3 rounded-md border border-[#e2d6cc] bg-white px-3 py-2 text-xs text-[#5f6f7c]">
                                <p className="font-semibold text-[#2f4e64]">
                                    Incoming reservation detected.
                                </p>
                                <p className="mt-1">
                                    Reservation check-in:{' '}
                                    {reservationsByRoomId.get(selectedTenant.roomId)?.check_in_date || 'N/A'}
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsExtendStayConfirmOpen(false);
                                    setIsExtendStayOpen(false);
                                }}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (reservationsByRoomId.get(selectedTenant.roomId)) {
                                        setIsExtendStayConfirmOpen(true);

                                        return;
                                    }

                                    submitExtendStay(false);
                                }}
                                className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Continue
                            </button>
                        </div>

                        {isExtendStayConfirmOpen ? (
                            <div className="mt-4 rounded-md border border-[#e2d6cc] bg-white px-3 py-3 text-xs text-[#5f6f7c]">
                                <p className="font-semibold text-[#2f4e64]">Push reservation date?</p>
                                <p className="mt-1">
                                    This will update the reservation check-in date to{' '}
                                    {extendStayDate || 'the new date'}.
                                </p>
                                <div className="mt-3 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsExtendStayConfirmOpen(false)}
                                        className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3f5667]"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => submitExtendStay(true)}
                                        className="rounded-md bg-[#f0b01f] px-3 py-1.5 text-xs font-semibold text-[#312400]"
                                    >
                                        Push Reservation
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {isCheckoutPromptOpen && selectedTenant && checkoutReservation ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => {
                        setIsCheckoutPromptOpen(false);
                        setCheckoutReservation(null);
                    }}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            Early Check-out Alert
                        </h3>
                        <p className="mt-1 text-xs text-[#6f7b86]">
                            This room has an incoming reservation.
                        </p>
                        <div className="mt-3 rounded-md border border-[#e2d6cc] bg-white px-3 py-2 text-xs text-[#5f6f7c]">
                            <p>Reservation check-in: {checkoutReservation.check_in_date || 'N/A'}</p>
                        </div>
                        <label className="mt-3 block text-xs text-[#4f6271]">
                            New Check-in Date (if rescheduling)
                            <input
                                type="date"
                                value={earlyCheckInDate}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(event) => setEarlyCheckInDate(event.target.value)}
                                className="mt-1 h-8 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                            />
                        </label>
                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => submitCheckout('reschedule')}
                                className="rounded-md bg-[#5f7f95] px-3 py-1.5 text-xs font-semibold text-white"
                            >
                                Update Check-in to Today
                            </button>
                            <button
                                type="button"
                                onClick={() => submitCheckout('checkin_now')}
                                className="rounded-md bg-[#2ca94e] px-3 py-1.5 text-xs font-semibold text-white"
                            >
                                Confirm Check-in Now
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCheckoutPromptOpen(false);
                                    setCheckoutReservation(null);
                                }}
                                className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
