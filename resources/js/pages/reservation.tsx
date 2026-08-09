import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Room = {
    id: number;
    number: string;
    occupied: boolean;
    reserved?: boolean;
};

type PaginatedRooms = {
    data: Room[];
    current_page: number;
    last_page: number;
    total: number;
};

type RoomDetails = {
    inclusions: string;
    address: string;
    others: string;
    price: string;
};

const defaultRoomDetails: RoomDetails = {
    inclusions: 'Kitchen, Bed Frame, Comfort Room',
    address: 'Washington Village, Maa',
    others: 'Water is divided depending on bill 13 kWh',
    price: '6000',
};

type ReservationEntry = any;
type ReservationHistoryEntry = any;
type TenantEntry = any;

export default function Reservation({ rooms, reservations = [], reservationHistory = [], tenants = [] }: { rooms: PaginatedRooms; reservations?: ReservationEntry[]; reservationHistory?: ReservationHistoryEntry[]; tenants?: TenantEntry[] }) {
    const { props } = usePage<{ flash?: { success?: string | null; error?: string | null } }>();
    const [roomList, setRoomList] = useState<Room[]>(rooms.data);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [detailsByRoom, setDetailsByRoom] = useState<Record<number, RoomDetails>>({});
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [isEditDetailOpen, setIsEditDetailOpen] = useState(false);
    const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
    const [isRoomViewOpen, setIsRoomViewOpen] = useState(false);
    const [roomViewIndex, setRoomViewIndex] = useState(0);
    const photoList = [
        '/images/photos/kitchen.jpg',
        '/images/photos/room.jpg',
        '/images/photos/cr.jpg',
        '/images/photos/bed.jpg',
    ];

    const getRoomPhotos = (room: any) => {
        const photos: string[] = [];

        if (room?.kitchen_photo) {
photos.push(room.kitchen_photo);
}

        if (room?.room_photo) {
photos.push(room.room_photo);
}

        if (room?.cr_photo) {
photos.push(room.cr_photo);
}

        if (room?.bed_photo) {
photos.push(room.bed_photo);
}

        if (room?.photo_path) {
photos.push(room.photo_path);
}

        return photos.length ? photos : photoList;
    };

    const getRoomPrimaryPhoto = (room: any) => getRoomPhotos(room)[0] || photoList[1];
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [downPayment, setDownPayment] = useState<number | string>(500);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const checkInInputRef = useRef<HTMLInputElement | null>(null);
    const checkOutInputRef = useRef<HTMLInputElement | null>(null);
    const [gcashNumber, setGcashNumber] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [tableError, setTableError] = useState('');
    const [listSearch, setListSearch] = useState('');
    const [notice, setNotice] = useState('');
    const flashSuccess = props.flash?.success ?? '';
    const flashError = props.flash?.error ?? '';
    const [editedDetails, setEditedDetails] = useState<RoomDetails>(defaultRoomDetails);
    const [listTab, setListTab] = useState<'reservations' | 'history' | 'upcoming'>('reservations');
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<any | null>(null);
    const [cancelAction, setCancelAction] = useState<'refund' | 'forfeit'>('refund');
    const [cancelNotes, setCancelNotes] = useState('');

    useEffect(() => {
        // derive occupied and reserved flags from active tenants + reservations
        const tenantMap = new Map((tenants || []).map((t: any) => [t.room_id, t]));
        const reservationMap = new Map((reservations || []).map((r: any) => [r.room_id, r]));

        setRoomList(rooms.data.map((r: any) => ({
            ...r,
            occupied: tenantMap.has(r.id),
            reserved: reservationMap.has(r.id) && !tenantMap.has(r.id),
        })));

        setSelectedRoom((currentSelectedRoom) => {
            if (!currentSelectedRoom) {
                return null;
            }

            // preserve selection but update occupied flag from tenants
            const updated = rooms.data.find((room) => room.id === currentSelectedRoom.id) ?? null;

            if (!updated) {
return null;
}

            return {
                ...updated,
                occupied: tenantMap.has(updated.id),
                reserved: reservationMap.has(updated.id) && !tenantMap.has(updated.id),
            };
        });
    }, [rooms, tenants, reservations]);

    useEffect(() => {
        setDetailsByRoom((currentDetails) => {
            const nextDetails = { ...currentDetails };

            roomList.forEach((room) => {
                if (!nextDetails[room.id]) {
                    nextDetails[room.id] = defaultRoomDetails;
                }
            });

            return nextDetails;
        });
    }, [roomList]);

    useEffect(() => {
        if (flashSuccess || flashError) {
            setNotice('');
        }
    }, [flashSuccess, flashError]);

    

    const setRoomOccupied = (roomId: number, occupied: boolean) => {
        setRoomList((currentRooms) =>
            currentRooms.map((room) =>
                room.id === roomId
                    ? { ...room, occupied }
                    : room,
            ),
        );

        setSelectedRoom((currentSelectedRoom) => {
            if (!currentSelectedRoom || currentSelectedRoom.id !== roomId) {
                return currentSelectedRoom;
            }

            return {
                ...currentSelectedRoom,
                occupied,
            };
        });

        router.patch(`/reservation/rooms/${roomId}/toggle`, {
            occupied,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const activeRoom = selectedRoom ?? roomList[0] ?? null;
    const activeRoomDetails = activeRoom
        ? detailsByRoom[activeRoom.id] ?? defaultRoomDetails
        : defaultRoomDetails;

    const todayText = new Date().toISOString().slice(0, 10);

    const isCheckInPast = Boolean(checkInDate && checkInDate < todayText);
    const isCheckOutBeforeCheckIn = Boolean(checkOutDate && checkOutDate < checkInDate);
    const liveNameError = fullName && fullName.trim().length < 3
        ? 'Full name must be at least 3 characters.'
        : '';
    const liveContactError = contactNumber && !/^\d{11}$/.test(contactNumber)
        ? 'Contact must be an 11-digit number.'
        : '';
    const liveEmailError = emailAddress && !emailAddress.includes('@')
        ? 'Enter a valid email address.'
        : '';
    const liveDownpaymentError = String(downPayment).length > 0 && Number(downPayment) < 500
        ? 'Downpayment must be at least 500.'
        : '';

    const isValidReservation = useMemo(() => {
        const contactOk = /^\d{11}$/.test(contactNumber || '');
        const nameOk = (fullName || '').trim().length >= 3;
        const emailOk = (emailAddress || '').includes('@');
        const downOk = Number(downPayment) >= 500;
        const checkInOk = (checkInDate || '').length > 0 && !isCheckInPast;
        const checkOutOk = !checkOutDate || !isCheckOutBeforeCheckIn;
        const paymentOk = ['Cash', 'GCash'].includes(paymentMode || 'Cash');
        const gcashOk = paymentMode === 'GCash' ? /^\d{11}$/.test(gcashNumber || '') : true;

        return nameOk && contactOk && emailOk && downOk && checkInOk && checkOutOk && paymentOk && gcashOk;
    }, [fullName, contactNumber, emailAddress, downPayment, checkInDate, checkOutDate, paymentMode, gcashNumber, isCheckInPast, isCheckOutBeforeCheckIn]);

    const validateReservation = () => {
        const next: Record<string, string> = {};

        if (!fullName || fullName.trim().length < 3) {
next.name = 'Full name must be at least 3 characters.';
}

        if (!/^\d{11}$/.test(contactNumber || '')) {
next.contact = 'Contact must be an 11-digit number.';
}

        if (!emailAddress || !emailAddress.includes('@')) {
next.email = 'Enter a valid email address.';
}

        if (Number(downPayment) < 500) {
next.downpayment = 'Downpayment must be at least 500.';
}

        if (!checkInDate) {
next.check_in_date = 'Check-in date is required.';
}

        if (checkInDate && checkInDate < todayText) {
next.check_in_date = 'Check-in date must be today or later.';
}

        if (checkOutDate && checkOutDate < checkInDate) {
next.check_out_date = 'Check-out date must be after check-in date.';
}

        if (!['Cash', 'GCash'].includes(paymentMode)) {
next.payment_type = 'Payment type must be Cash or GCash.';
}

        if (paymentMode === 'GCash' && !/^\d{11}$/.test(gcashNumber || '')) {
next.gcash_number = 'GCash number must be 11 digits.';
}

        return next;
    };

    const reservationsByRoomId = useMemo(
        () => new Map((reservations || []).map((r: any) => [r.room_id, r])),
        [reservations],
    );

    const tenantsByRoomId = useMemo(
        () => new Map((tenants || []).map((t: any) => [t.room_id, t])),
        [tenants],
    );

    const sanitizeDigits = (value: string, max = 11) => value.replace(/\D/g, '').slice(0, max);

    const openReservationForm = () => {
        if (!activeRoom) {
            return;
        }

        setFullName('');
        setContactNumber('');
        setEmailAddress('');
        setPaymentMode('Cash');
        setIsReservationOpen(true);
    };

    const [isNewReserveOpen, setIsNewReserveOpen] = useState(false);
    const [newReserveRoomId, setNewReserveRoomId] = useState<number | null>(rooms.data?.[0]?.id ?? null);

    const confirmReservation = () => {
        if (!activeRoom) {
return;
}

        const nextErrors = validateReservation();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);

            return;
        }

        const payload: any = {
            name: fullName,
            contact: contactNumber,
            email: emailAddress,
            downpayment: Number(downPayment),
            payment_type: paymentMode.toLowerCase(),
            check_in_date: checkInDate,
            check_out_date: checkOutDate || null,
        };

        if (paymentMode === 'GCash') {
payload.gcash_number = gcashNumber;
}

        router.post(
            `/reservation/rooms/${activeRoom.id}/reserve`,
            payload,
            {
                preserveScroll: true,
                onError: (serverErrors: any) => {
                    const mapped: Record<string, string> = {};
                    Object.keys(serverErrors || {}).forEach((k) => {
                        mapped[k] = (serverErrors[k] || [])[0] || String(serverErrors[k]);
                    });
                    setErrors(mapped);
                },
                onSuccess: () => {
                    setIsReservationOpen(false);
                    setNotice(`Reservation submitted for ${activeRoom.number}.`);
                    router.reload();
                },
            },
        );
    };

    const confirmNewReservation = () => {
        if (!newReserveRoomId) {
return;
}

        const activeTenant = tenantsByRoomId.get(newReserveRoomId) ?? null;

        if (activeTenant?.check_out_date && checkInDate && checkInDate < activeTenant.check_out_date) {
            setErrors({
                check_in_date: `Check-in date must be after current tenant check-out (${activeTenant.check_out_date}).`,
            });

            return;
        }

        const nextErrors = validateReservation();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);

            return;
        }

        const payload: any = {
            name: fullName,
            contact: contactNumber,
            email: emailAddress,
            downpayment: Number(downPayment),
            payment_type: paymentMode.toLowerCase(),
            check_in_date: checkInDate,
            check_out_date: checkOutDate || null,
        };

        if (paymentMode === 'GCash') {
payload.gcash_number = gcashNumber;
}

        router.post(`/reservation/rooms/${newReserveRoomId}/reserve`, payload, {
            preserveScroll: true,
            preserveState: true,
            onError: (serverErrors: any) => {
                const mapped: Record<string, string> = {};
                Object.keys(serverErrors || {}).forEach((k) => {
                    mapped[k] = (serverErrors[k] || [])[0] || String(serverErrors[k]);
                });
                setErrors(mapped);
                setIsNewReserveOpen(true);
            },
            onSuccess: () => {
                setIsNewReserveOpen(false);
                setNotice('Reservation submitted.');
                router.reload();
            },
        });
    };

    const cancelReservation = () => {
        if (!activeRoom) {
return;
}

        const reservation = (reservations || []).find((r: any) => r.room_id === activeRoom.id) || null;

        if (!reservation) {
            setTableError('No active reservation found for this room.');

            return;
        }

        setCancelTarget(reservation);
        setCancelNotes('');
        setCancelAction('refund');
        setIsCancelOpen(true);
    };

    const openEditDetails = () => {
        if (!activeRoom) {
            return;
        }

        setEditedDetails(activeRoomDetails);
        setIsSaveConfirmationOpen(false);
        setIsEditDetailOpen(true);
    };

    const confirmSaveRoomDetails = () => {
        if (!activeRoom) {
            return;
        }

        setDetailsByRoom((currentDetails) => ({
            ...currentDetails,
            [activeRoom.id]: editedDetails,
        }));
        setIsSaveConfirmationOpen(false);
        setIsEditDetailOpen(false);
        setNotice(`Room details saved for ${activeRoom.number}.`);
    };

    const goToPage = (page: number) => {
        const per_page = page === 1 ? 10 : 5;

        router.get(
            '/reservation',
            { page, per_page },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const computedTotalPages = useMemo(() => {
        const total = (rooms && rooms.total) ? Number(rooms.total) : 0;

        if (total <= 10) {
return 1;
}

        return 1 + Math.ceil(Math.max(0, total - 10) / 5);
    }, [rooms]);

    const newReserveTenant = newReserveRoomId
        ? (tenantsByRoomId.get(newReserveRoomId) ?? null)
        : null;
    const isNewReserveTooEarly = Boolean(
        newReserveTenant?.check_out_date &&
        checkInDate &&
        checkInDate < newReserveTenant.check_out_date,
    );

    const handleConfirmCheckIn = (reservationId: number, name?: string) => {
        setTableError('');
        router.post(`/reservation/${reservationId}/check-in`, {}, {
            preserveScroll: true,
            onSuccess: () => setNotice(`Check-in confirmed for ${name || 'tenant'}.`),
            onError: (errs: any) => setTableError('Failed to confirm check-in.'),
        });
    };

    const handleCancelReservation = (roomId: number, roomIdentifier?: string) => {
        setTableError('');
        // Open the cancel modal so the user can choose refund/forfeit and add notes.
        const reservation = (reservations || []).find((r: any) => r.room_id === roomId) || null;
        setCancelTarget(reservation);
        setCancelNotes('');
        setCancelAction('refund');
        setIsCancelOpen(true);
    };

    const confirmCancelReservation = () => {
        if (!cancelTarget) {
return;
}

        const payload: any = {
            cancellation_action: cancelAction,
            cancellation_notes: cancelNotes || null,
        };

        router.patch(`/reservation/rooms/${cancelTarget.room_id}/cancel`, payload, {
            preserveScroll: true,
            onError: (serverErrors: any) => {
                setTableError('Failed to cancel reservation.');
            },
            onSuccess: () => {
                setIsCancelOpen(false);
                setNotice(`Reservation cancelled for ${cancelTarget.room_code || cancelTarget.room_id}.`);
                router.reload();
            },
        });
    };

    return (
        <ApartmentLayout title="Reservation">
            <Head title="Reservation" />

            {notice && !flashSuccess && !flashError ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {notice}
                </div>
            ) : null}

            {/* reservations/listing section moved below room grid */}

            <section className="grid min-w-0 items-start gap-4">
                <article className="min-w-0 self-start rounded-md border border-[#b79f93] bg-white/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            Room Reservation
                        </h2>
                            <span className="rounded-md bg-[#5f7f95] px-2 py-1 text-[10px] font-semibold text-white">Showing {roomList.length} of {rooms.total} Rooms</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {roomList.map((room) => (
                            <article
                                key={room.id}
                                className="overflow-hidden rounded-md border border-[#d7cbc2] bg-[#fffdf8]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoom(room)}
                                    className="w-full"
                                >
                                    <div className="grid h-24 place-items-center bg-[#e0ddd0] text-xs font-medium uppercase tracking-wide text-[#7a7d79] overflow-hidden">
                                        <img
                                            src={getRoomPrimaryPhoto(room)}
                                            alt={room.number}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <p className="py-2 text-center text-sm font-semibold text-[#2b4a5f]">
                                        {room.number}
                                    </p>
                                </button>

                                <div className="flex gap-2 px-2 pb-2">
                                    <span
                                        className={`flex-1 rounded-md px-2 py-1 text-center text-[11px] font-semibold text-white ${
                                            room.occupied
                                                ? 'bg-[#ff3434]'
                                                : room.reserved
                                                  ? 'bg-[#f0b01f] text-[#312400]'
                                                  : 'bg-[#2ca94e]'
                                        }`}
                                    >
                                        {room.occupied ? 'Occupied' : room.reserved ? 'Reserved' : 'Available'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setRoomViewIndex(0);
                                                setIsRoomViewOpen(true);
                                            }}
                                            className="rounded-md bg-[#5f7f95] px-3 py-1 text-[11px] font-semibold text-white"
                                        >
                                            {room.occupied ? 'Edit' : 'View'}
                                        </button>

                                        {room.occupied ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewReserveRoomId(room.id);
                                                    setFullName('');
                                                    setContactNumber('');
                                                    setEmailAddress('');
                                                    setPaymentMode('Cash');
                                                    setCheckInDate('');
                                                    setCheckOutDate('');
                                                    setErrors({});
                                                    setIsNewReserveOpen(true);
                                                }}
                                                className="rounded-md bg-[#2ca94e] px-3 py-1 text-[11px] font-semibold text-white"
                                            >
                                                New Reserve
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => goToPage(Math.max(1, rooms.current_page - 1))}
                            disabled={rooms.current_page === 1}
                            className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3f5667] disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: computedTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => goToPage(pageNumber)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                                    pageNumber === rooms.current_page
                                        ? 'bg-[#5f7f95] text-white'
                                        : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => goToPage(Math.min(computedTotalPages, rooms.current_page + 1))}
                            disabled={rooms.current_page === computedTotalPages}
                            className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3f5667] disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </article>

                {/* right-side details removed — room actions available via View modal */}
            </section>

            <section className="mt-4 rounded-md border border-[#b79f93] bg-white/70 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">Reservation Records</h2>
                    <div className="flex items-center gap-2">
                        <input value={listSearch} onChange={(e) => setListSearch(e.target.value)} placeholder="Search reservations, names, rooms" className="h-8 rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                        <div className="flex gap-2 text-xs font-semibold">
                            <button type="button" onClick={() => setListTab('reservations')} className={`rounded-md px-3 py-1.5 ${listTab === 'reservations' ? 'bg-[#5f7f95] text-white' : 'border border-[#c9bbb0] bg-white text-[#3f5667]'}`}>Reservations</button>
                            <button type="button" onClick={() => setListTab('history')} className={`rounded-md px-3 py-1.5 ${listTab === 'history' ? 'bg-[#5f7f95] text-white' : 'border border-[#c9bbb0] bg-white text-[#3f5667]'}`}>History</button>
                            <button type="button" onClick={() => setListTab('upcoming')} className={`rounded-md px-3 py-1.5 ${listTab === 'upcoming' ? 'bg-[#5f7f95] text-white' : 'border border-[#c9bbb0] bg-white text-[#3f5667]'}`}>Upcoming</button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border border-[#d8cdc3] bg-white">
                    {tableError ? <div className="p-3 text-sm text-[#d84a4a]">{tableError}</div> : null}
                    {listTab === 'reservations' && (
                        <div className="apartment-scrollbar max-h-[240px] overflow-auto">
                            <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]"><tr className="border-b border-[#ddd3c8] text-[#677482]"><th className="px-3 py-2 font-semibold">Room</th><th className="px-3 py-2 font-semibold">Name</th><th className="px-3 py-2 font-semibold">Check-in</th><th className="px-3 py-2 font-semibold">Payment</th><th className="px-3 py-2 text-right font-semibold">Action</th></tr></thead>
                                <tbody>
                                    {(reservations || []).filter((reservation: any) => {
                                        if (!listSearch) {
return true;
}

                                        const q = listSearch.toLowerCase();

                                        return `${reservation.name} ${reservation.room_code || ''}`.toLowerCase().includes(q);
                                    }).map((reservation: any) => (
                                        <tr key={`reservation-${reservation.id}`} className="border-b border-[#eee6e0] text-[#3e5262]"><td className="px-3 py-2">Room {reservation.room_code || reservation.room_id}</td><td className="px-3 py-2">{reservation.name}</td><td className="px-3 py-2">{reservation.check_in_date || '-'}</td><td className="px-3 py-2">{reservation.payment_type === 'gcash' ? 'GCash' : 'Cash'}</td><td className="px-3 py-2 text-right"><div className="flex justify-end gap-1"><button type="button" onClick={() => handleConfirmCheckIn(reservation.id, reservation.name)} className="rounded-md bg-[#f0b01f] px-2 py-1 text-[10px] font-semibold text-[#312400]">Confirm Check-in</button><button type="button" onClick={() => handleCancelReservation(reservation.room_id, reservation.room_code || reservation.room_id)} className="rounded-md bg-[#ff3434] px-2 py-1 text-[10px] font-semibold text-white">Cancel</button></div></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {listTab === 'history' && (
                        <div className="apartment-scrollbar max-h-[180px] overflow-auto">
                            <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]"><tr className="border-b border-[#ddd3c8] text-[#677482]"><th className="px-3 py-2 font-semibold">Room</th><th className="px-3 py-2 font-semibold">Name</th><th className="px-3 py-2 font-semibold">Cancelled</th><th className="px-3 py-2 font-semibold">Decision</th><th className="px-3 py-2 font-semibold">Notes</th></tr></thead>
                                <tbody>
                                    {(reservationHistory || []).filter((h: any) => {
                                        if (!listSearch) {
return true;
}

                                        const q = listSearch.toLowerCase();

                                        return `${h.name} ${h.room_code || ''}`.toLowerCase().includes(q);
                                    }).map((h: any) => (
                                        <tr key={`cancelled-${h.id}`} className="border-b border-[#eee6e0] text-[#3e5262]"><td className="px-3 py-2">Room {h.room_code}</td><td className="px-3 py-2">{h.name}</td><td className="px-3 py-2">{h.cancelled_at || '-'}</td><td className="px-3 py-2">{h.cancellation_action || '-'}</td><td className="px-3 py-2">{h.cancellation_notes || '-'}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {listTab === 'upcoming' && (
                        <div className="apartment-scrollbar max-h-[200px] overflow-auto">
                            <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                                <thead className="sticky top-0 z-10 bg-[#f5f3eb]"><tr className="border-b border-[#ddd3c8] text-[#677482]"><th className="px-3 py-2 font-semibold">Room</th><th className="px-3 py-2 font-semibold">Tenant</th><th className="px-3 py-2 font-semibold">Check-out Date</th><th className="px-3 py-2 font-semibold">Status</th></tr></thead>
                                <tbody>
                                    {(tenants || []).filter((tenant: any) => {
                                        if (!listSearch) {
return true;
}

                                        const q = listSearch.toLowerCase();

                                        return `${tenant.name} ${tenant.room_code || ''}`.toLowerCase().includes(q);
                                    }).slice(0, 5).map((tenant: any) => (
                                        <tr key={`upcoming-${tenant.room_id}`} className="border-b border-[#eee6e0] text-[#3e5262]"><td className="px-3 py-2">Room {tenant.room_code}</td><td className="px-3 py-2">{tenant.name}</td><td className="px-3 py-2">{tenant.check_out_date}</td><td className="px-3 py-2"><span className="rounded-full bg-[#f0b01f] px-2 py-0.5 text-[10px] font-semibold text-[#312400]">Soon</span></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Room View Modal — opens when user clicks View on a room card */}
            {isRoomViewOpen && activeRoom ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsRoomViewOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-3xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Room - {activeRoom.number}
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            {(() => {
                                const roomPhotos = getRoomPhotos(activeRoom);
                                const current = roomPhotos[roomViewIndex] || photoList[1];

                                return (
                                    <div className="grid h-64 place-items-center rounded-md border border-[#d8cdc3] bg-[#e0ddd0] text-xs font-medium uppercase tracking-wide text-[#7a7d79]">
                                        <img
                                            src={current}
                                            alt={`${activeRoom.number} - ${roomViewIndex + 1}`}
                                            className="max-h-[240px] max-w-full object-contain"
                                        />
                                        <div className="mt-2 flex gap-2">
                                            <button type="button" onClick={() => setRoomViewIndex((i) => Math.max(0, i - 1))} className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1 text-xs">Prev</button>
                                            <button type="button" onClick={() => setRoomViewIndex((i) => Math.min(roomPhotos.length - 1, i + 1))} className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1 text-xs">Next</button>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="rounded-md border border-[#d8cdc3] bg-[#f7f6f1] p-3 text-xs text-[#415566]">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="font-semibold text-[#2d4f66]">{activeRoom.number}</p>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                                        activeRoom.occupied
                                            ? 'bg-[#ff3434]'
                                            : activeRoom.reserved
                                              ? 'bg-[#f0b01f] text-[#312400]'
                                              : 'bg-[#2ca94e]'
                                    }`}>
                                        {activeRoom.occupied ? 'Occupied' : activeRoom.reserved ? 'Reserved' : 'Available'}
                                    </span>
                                </div>
                                <p>Inclusions: {activeRoomDetails.inclusions}</p>
                                <p>Address: {activeRoomDetails.address}</p>
                                <p>Others: {activeRoomDetails.others}</p>
                                <div className="mt-3 flex justify-end">
                                    <span className="rounded-full bg-[#5f7f95] px-3 py-1 text-xs font-semibold text-white">
                                        P {Number(activeRoomDetails.price).toLocaleString()}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={openEditDetails}
                                        className="rounded-md border border-[#c9bbb0] bg-white px-4 py-2 text-xs font-semibold text-[#3f5667]"
                                    >
                                        Edit Detail
                                    </button>

                                    <button
                                        type="button"
                                        onClick={activeRoom.occupied ? cancelReservation : openReservationForm}
                                        disabled={Boolean(activeRoom.reserved && !activeRoom.occupied)}
                                        className={`rounded-md px-4 py-2 text-xs font-semibold text-white ${
                                            activeRoom.occupied
                                                ? 'bg-[#ff3434]'
                                                : activeRoom.reserved
                                                  ? 'bg-[#c7b59a] text-[#4b3b28]'
                                                  : 'bg-[#2ca94e]'
                                        }`}
                                    >
                                        {activeRoom.occupied ? 'Cancel Reservation' : activeRoom.reserved ? 'Reserved' : 'Proceed Reservation'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {isReservationOpen && activeRoom ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsReservationOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Reservation Proceed - {activeRoom.number}
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Full Name
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" placeholder="Enter full name" />
                                {errors.name || liveNameError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.name || liveNameError}
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Contact Number
                                <input value={contactNumber} onChange={(e) => setContactNumber(sanitizeDigits(e.target.value,11))} inputMode="numeric" maxLength={11} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" placeholder="11-digit number" />
                                {errors.contact || liveContactError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.contact || liveContactError}
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email Address
                                <input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" placeholder="Enter email address" />
                                {errors.email || liveEmailError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.email || liveEmailError}
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Downpayment
                                <input type="number" value={downPayment as any} onChange={(e) => setDownPayment(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.downpayment || liveDownpaymentError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.downpayment || liveDownpaymentError}
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Check-in Date
                                <div className="mt-1 flex items-center gap-2">
                                    <input ref={checkInInputRef} type="date" min={todayText} value={checkInDate} onClick={() => {
 const el = checkInInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onFocus={() => {
 const el = checkInInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onChange={(e) => setCheckInDate(e.target.value)} className="relative z-10 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                    {/* calendar icon removed */}
                                </div>
                                {errors.check_in_date ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        {errors.check_in_date}
                                    </div>
                                ) : null}
                                {!errors.check_in_date && isCheckInPast ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        Check-in date must be today or later.
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Check-out Date (Optional)
                                <div className="mt-1 flex items-center gap-2">
                                    <input ref={checkOutInputRef} type="date" min={checkInDate || todayText} value={checkOutDate} onClick={() => {
 const el = checkOutInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onFocus={() => {
 const el = checkOutInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onChange={(e) => setCheckOutDate(e.target.value)} className="relative z-10 mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                    {/* calendar icon removed */}
                                </div>
                                {errors.check_out_date ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        {errors.check_out_date}
                                    </div>
                                ) : null}
                                {!errors.check_out_date && isCheckOutBeforeCheckIn ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        Check-out date must be after check-in date.
                                    </div>
                                ) : null}
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Mode of Payment
                                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none">
                                    <option>Cash</option>
                                    <option>GCash</option>
                                </select>
                                {errors.payment_type ? <div className="mt-1 text-xs text-[#d84a4a]">{errors.payment_type}</div> : null}
                            </label>
                            {paymentMode === 'GCash' ? (
                                <label className="text-xs text-[#4f6271]">
                                    GCash Number
                                    <input value={gcashNumber} onChange={(e) => setGcashNumber(sanitizeDigits(e.target.value,11))} inputMode="numeric" maxLength={11} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" placeholder="11-digit number" />
                                    {errors.gcash_number ? <div className="mt-1 text-xs text-[#d84a4a]">{errors.gcash_number}</div> : null}
                                </label>
                            ) : null}
                        </div>

                        {!isValidReservation ? (
                            <p className="mt-3 text-xs font-semibold text-[#d84a4a]">
                                Please review the highlighted fields above.
                            </p>
                        ) : null}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsReservationOpen(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!isValidReservation}
                                onClick={confirmReservation}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                                Confirm Reservation
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isNewReserveOpen ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsNewReserveOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">New Reservation</h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            {/* Room selection removed - new reserve uses the room chosen from the card */}

                            <label className="text-xs text-[#4f6271]">
                                Full Name
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.name || liveNameError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.name || liveNameError}
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Contact Number
                                <input value={contactNumber} onChange={(e) => setContactNumber(sanitizeDigits(e.target.value, 11))} inputMode="numeric" maxLength={11} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.contact || liveContactError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.contact || liveContactError}
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Email Address
                                <input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.email || liveEmailError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.email || liveEmailError}
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Downpayment
                                <input type="number" value={downPayment as any} onChange={(e) => setDownPayment(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.downpayment || liveDownpaymentError ? (
                                    <div className="mt-1 text-xs text-[#d84a4a]">
                                        {errors.downpayment || liveDownpaymentError}
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Check-in Date
                                <div className="mt-1 flex items-center gap-2">
                                    <input ref={checkInInputRef} type="date" min={todayText} value={checkInDate} onClick={() => {
 const el = checkInInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onFocus={() => {
 const el = checkInInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onChange={(e) => setCheckInDate(e.target.value)} className="relative z-10 mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                    {/* calendar icon removed */}
                                </div>
                                {errors.check_in_date ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        {errors.check_in_date}
                                    </div>
                                ) : null}
                                {!errors.check_in_date && isCheckInPast ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        Check-in date must be today or later.
                                    </div>
                                ) : null}
                                {!errors.check_in_date && isNewReserveTooEarly ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        Check-in date must be after current tenant check-out ({newReserveTenant?.check_out_date}).
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Check-out Date (Optional)
                                <input ref={checkOutInputRef} type="date" min={checkInDate || todayText} value={checkOutDate} onClick={() => {
 const el = checkOutInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onFocus={() => {
 const el = checkOutInputRef.current as any;

 if (el && typeof el.showPicker === 'function') {
 el.showPicker(); 
} 
}} onChange={(e) => setCheckOutDate(e.target.value)} className="relative z-10 mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" />
                                {errors.check_out_date ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        {errors.check_out_date}
                                    </div>
                                ) : null}
                                {!errors.check_out_date && isCheckOutBeforeCheckIn ? (
                                    <div className="mt-1 text-xs leading-relaxed text-[#d84a4a] break-words">
                                        Check-out date must be after check-in date.
                                    </div>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Mode of Payment
                                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"><option>Cash</option><option>GCash</option></select>
                                {errors.payment_type ? <div className="mt-1 text-xs text-[#d84a4a]">{errors.payment_type}</div> : null}
                            </label>

                            {paymentMode === 'GCash' ? (
                                <label className="text-xs text-[#4f6271]">
                                    GCash Number
                                    <input value={gcashNumber} onChange={(e) => setGcashNumber(sanitizeDigits(e.target.value, 11))} inputMode="numeric" maxLength={11} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none" placeholder="11-digit number" />
                                    {errors.gcash_number ? <div className="mt-1 text-xs text-[#d84a4a]">{errors.gcash_number}</div> : null}
                                </label>
                            ) : null}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsNewReserveOpen(false)} className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]">Cancel</button>
                            <button type="button" disabled={!isValidReservation || !newReserveRoomId} onClick={confirmNewReservation} className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Create Reservation</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isCancelOpen && cancelTarget ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsCancelOpen(false)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">Cancel Reservation</h3>

                        <div className="grid gap-3">
                            <p className="text-xs text-[#4f6271]">Room: <span className="font-semibold text-[#2d4f66]">{cancelTarget.room_code || cancelTarget.room_id}</span></p>

                            <label className="text-xs text-[#4f6271]">
                                Action
                                <select value={cancelAction} onChange={(e) => setCancelAction(e.target.value as any)} className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none">
                                    <option value="refund">refund</option>
                                    <option value="forfeit">forfeit</option>
                                </select>
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Notes (optional)
                                <textarea value={cancelNotes} onChange={(e) => setCancelNotes(e.target.value)} className="mt-1 h-24 w-full rounded-md border border-[#dbd2c8] bg-white px-2 py-2 text-xs outline-none" />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCancelOpen(false)} className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]">Close</button>
                            <button type="button" onClick={confirmCancelReservation} className="rounded-md bg-[#ff3434] px-4 py-1.5 text-xs font-semibold text-white">Confirm Cancel</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {isEditDetailOpen && activeRoom ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => {
                        setIsSaveConfirmationOpen(false);
                        setIsEditDetailOpen(false);
                    }}
                >
                    <div
                        className="apartment-modal-content relative w-full max-w-xl rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Edit Detail - {activeRoom.number}
                        </h3>

                        <div className="grid gap-3">
                            <label className="text-xs text-[#4f6271]">
                                Inclusions
                                <input
                                    value={editedDetails.inclusions}
                                    onChange={(event) =>
                                        setEditedDetails((current) => ({
                                            ...current,
                                            inclusions: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Address
                                <input
                                    value={editedDetails.address}
                                    onChange={(event) =>
                                        setEditedDetails((current) => ({
                                            ...current,
                                            address: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Others
                                <input
                                    value={editedDetails.others}
                                    onChange={(event) =>
                                        setEditedDetails((current) => ({
                                            ...current,
                                            others: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Price
                                <input
                                    value={editedDetails.price}
                                    onChange={(event) =>
                                        setEditedDetails((current) => ({
                                            ...current,
                                            price: event.target.value,
                                        }))
                                    }
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSaveConfirmationOpen(false);
                                    setIsEditDetailOpen(false);
                                }}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSaveConfirmationOpen(true)}
                                className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Save Details
                            </button>
                        </div>

                        {isSaveConfirmationOpen ? (
                            <div className="absolute inset-0 grid place-items-center rounded-md bg-black/25 p-4">
                                <div className="w-full max-w-[320px] rounded-md border border-[#d3c8bc] bg-white p-4 text-center shadow-lg">
                                    <h4 className="text-sm font-semibold text-[#2f4e64]">
                                        Save Changes
                                    </h4>
                                    <p className="mt-2 text-xs text-[#5f6f7c]">
                                        Are you sure you want to save changes?
                                    </p>

                                    <div className="mt-4 flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsSaveConfirmationOpen(false)}
                                            className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmSaveRoomDetails}
                                            className="rounded-md bg-[#5f7f95] px-4 py-1.5 text-xs font-semibold text-white"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
