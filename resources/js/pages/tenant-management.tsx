import { Head } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Tenant = {
    id: number;
    avatar: string;
    name: string;
    room: string;
    gender: 'Male' | 'Female';
    contact: string;
    optionalContact: string;
    email: string;
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

const initialTenants: Tenant[] = [
    {
        id: 1,
        avatar: 'MG',
        name: 'Nicole Edrian',
        room: '01',
        gender: 'Female',
        contact: '09123456789',
        optionalContact: '09987654321',
        email: 'n.edrian.sekirei@edu.ph',
    },
    {
        id: 2,
        avatar: 'FG',
        name: 'Faith Gawan',
        room: '02',
        gender: 'Female',
        contact: '09234567890',
        optionalContact: '',
        email: 'f.gawan.sekirei@edu.ph',
    },
    {
        id: 3,
        avatar: 'JM',
        name: 'Jeron Montjejo',
        room: '03',
        gender: 'Male',
        contact: '09345678901',
        optionalContact: '09012345678',
        email: 'j.montjejo.sekirei@edu.ph',
    },
    {
        id: 4,
        avatar: 'SB',
        name: 'Spongiebob',
        room: '04',
        gender: 'Male',
        contact: '09456789012',
        optionalContact: '',
        email: 's.bob.sekirei@edu.ph',
    },
    {
        id: 5,
        avatar: 'JN',
        name: 'Justin Nabunturuan',
        room: '05',
        gender: 'Male',
        contact: '09567890123',
        optionalContact: '',
        email: 'j.nabu.sekirei@edu.ph',
    },
];

export default function TenantManagement({ roomLimit = 15 }: { roomLimit?: number }) {
    const maxRoomNumber = Math.max(roomLimit, 1);
    const [tenantList, setTenantList] = useState<Tenant[]>(initialTenants);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState<'success' | 'error'>('success');
    const [draftTenant, setDraftTenant] = useState({
        name: '',
        room: '',
        gender: 'Male' as Tenant['gender'],
        contact: '',
        optionalContact: '',
        email: '',
    });

    const saveTenantChanges = () => {
        if (!selectedTenant) {
            return;
        }

        const roomNumber = parseRoomNumber(selectedTenant.room);
        const primaryContact = selectedTenant.contact.trim();
        const backupContact = selectedTenant.optionalContact.trim();
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

        setTenantList((currentTenants) =>
            currentTenants.map((tenant) =>
                tenant.id === selectedTenant.id
                    ? {
                          ...selectedTenant,
                          room: formatRoomNumber(roomNumber),
                                                    contact: primaryContact,
                                                    optionalContact: backupContact,
                      }
                    : tenant,
            ),
        );
        setNoticeType('success');
        setNotice(`Tenant information saved for ${selectedTenant.name}.`);
        setSelectedTenant(null);
    };

    const deleteTenant = () => {
        if (!selectedTenant) {
            return;
        }

        setTenantList((currentTenants) =>
            currentTenants.filter((tenant) => tenant.id !== selectedTenant.id),
        );
        setNoticeType('success');
        setNotice(`Tenant removed: ${selectedTenant.name}.`);
        setSelectedTenant(null);
    };

    const addNewTenant = () => {
        const roomNumber = parseRoomNumber(draftTenant.room);
        const primaryContact = draftTenant.contact.trim();
        const backupContact = draftTenant.optionalContact.trim();
        const hasDuplicateRoom = tenantList.some(
            (tenant) => parseRoomNumber(tenant.room) === roomNumber,
        );

        if (
            draftTenant.name.trim().length < 3 ||
            !isValidContactNumber(primaryContact) ||
            !draftTenant.email.includes('@')
        ) {
            setNoticeType('error');
            setNotice('Please fill in valid tenant details before adding.');

            return;
        }

        if (!Number.isInteger(roomNumber) || roomNumber < 1 || roomNumber > maxRoomNumber) {
            setNoticeType('error');
            setNotice(`Room number must be between 01 and ${formatRoomNumber(maxRoomNumber)} only.`);

            return;
        }

        if (hasDuplicateRoom) {
            setNoticeType('error');
            setNotice(`Room ${formatRoomNumber(roomNumber)} already has a tenant.`);

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

        if (hasDuplicateContactNumber(primaryContact, tenantList)) {
            setNoticeType('error');
            setNotice('This contact number is already assigned to another tenant.');

            return;
        }

        if (backupContact && hasDuplicateContactNumber(backupContact, tenantList)) {
            setNoticeType('error');
            setNotice('This optional contact number is already assigned to another tenant.');

            return;
        }

        const nextTenant: Tenant = {
            id: Date.now(),
            avatar: draftTenant.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
            name: draftTenant.name.trim(),
            room: formatRoomNumber(roomNumber),
            gender: draftTenant.gender,
            contact: primaryContact,
            optionalContact: backupContact,
            email: draftTenant.email.trim(),
        };

        setTenantList((currentTenants) => [...currentTenants, nextTenant]);
        setNoticeType('success');
        setNotice(`Tenant added successfully: ${nextTenant.name}.`);
        setIsAddTenantOpen(false);
        setDraftTenant({
            name: '',
            room: '',
            gender: 'Male',
            contact: '',
            optionalContact: '',
            email: '',
        });
    };

    return (
        <ApartmentLayout title="Tenant Management">
            <Head title="Tenant Management" />

            {notice ? (
                <div
                    className={`mb-4 rounded-md px-3 py-2 text-xs font-semibold text-white ${
                        noticeType === 'success' ? 'bg-[#2ca94e]' : 'bg-[#d84a4a]'
                    }`}
                >
                    {notice}
                </div>
            ) : null}

            <section className="min-w-0 rounded-md border border-[#b79f93] bg-white/75 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                        Tenant Management
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsAddTenantOpen(true)}
                        className="rounded-md bg-[#5f7f95] px-4 py-2 text-xs font-semibold text-white"
                    >
                        + Add Tenant
                    </button>
                </div>

                <div className="overflow-hidden rounded-md border border-[#b79f93] bg-white">
                    <div className="apartment-scrollbar max-h-[320px] overflow-x-auto overflow-y-auto">
                        <table className="w-full min-w-[1040px] border-collapse text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-[#f5f3eb]">
                                <tr className="border-b border-[#ddd3c8] text-[#677482]">
                                    <th className="px-3 py-2 font-semibold">Tenants</th>
                                    <th className="px-3 py-2 font-semibold">Room</th>
                                    <th className="px-3 py-2 font-semibold">Name</th>
                                    <th className="px-3 py-2 font-semibold">Gender</th>
                                    <th className="px-3 py-2 font-semibold">Contact Number</th>
                                    <th className="px-3 py-2 font-semibold">Optional Number</th>
                                    <th className="px-3 py-2 font-semibold">Email</th>
                                    <th className="px-3 py-2 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenantList.map((tenant) => (
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
                                        <td className="px-3 py-2">{tenant.gender}</td>
                                        <td className="px-3 py-2">{tenant.contact}</td>
                                        <td className="px-3 py-2">{tenant.optionalContact || '-'}</td>
                                        <td className="px-3 py-2">{tenant.email}</td>
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
                </div>
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
                                Date Started
                                <input
                                    className="mt-1 h-8 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="09/11/2025"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Date of Birth
                                <input
                                    className="mt-1 h-8 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    defaultValue="09/11/2003"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={saveTenantChanges}
                                className="rounded-md bg-[#5f7f95] px-5 py-1.5 text-xs font-semibold text-white"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={deleteTenant}
                                className="rounded-md bg-[#d84a4a] px-5 py-1.5 text-xs font-semibold text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isAddTenantOpen ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsAddTenantOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Add New Tenant
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <input
                                    value={draftTenant.name}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Room Number
                                <input
                                    value={draftTenant.room}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            room: sanitizeRoomInput(event.target.value),
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    inputMode="numeric"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Contact Number
                                <input
                                    value={draftTenant.contact}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            contact: sanitizeContactInput(event.target.value),
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    inputMode="numeric"
                                    maxLength={11}
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Optional Contact Number
                                <input
                                    value={draftTenant.optionalContact}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            optionalContact: sanitizeContactInput(event.target.value),
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    inputMode="numeric"
                                    maxLength={11}
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email Address
                                <input
                                    value={draftTenant.email}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            email: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Gender
                                <select
                                    value={draftTenant.gender}
                                    onChange={(event) =>
                                        setDraftTenant((current) => ({
                                            ...current,
                                            gender: event.target.value as Tenant['gender'],
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAddTenantOpen(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addNewTenant}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Add Tenant
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
