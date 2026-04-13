import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Room = {
    id: number;
    number: string;
    occupied: boolean;
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

export default function Reservation({ rooms }: { rooms: PaginatedRooms }) {
    const [roomList, setRoomList] = useState<Room[]>(rooms.data);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [detailsByRoom, setDetailsByRoom] = useState<Record<number, RoomDetails>>({});
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [isEditDetailOpen, setIsEditDetailOpen] = useState(false);
    const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [notice, setNotice] = useState('');
    const [editedDetails, setEditedDetails] = useState<RoomDetails>(defaultRoomDetails);

    useEffect(() => {
        setRoomList(rooms.data);
        setSelectedRoom((currentSelectedRoom) => {
            if (!currentSelectedRoom) {
                return null;
            }

            return (
                rooms.data.find((room) => room.id === currentSelectedRoom.id) ?? null
            );
        });
    }, [rooms]);

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

    const isValidReservation = useMemo(
        () =>
            fullName.trim().length > 2 &&
            contactNumber.trim().length >= 7 &&
            emailAddress.trim().includes('@'),
        [fullName, contactNumber, emailAddress],
    );

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

    const confirmReservation = () => {
        if (!activeRoom || !isValidReservation) {
            return;
        }

        setRoomOccupied(activeRoom.id, true);
        setIsReservationOpen(false);
        setNotice(`Reservation confirmed for ${activeRoom.number}.`);
    };

    const cancelReservation = () => {
        if (!activeRoom) {
            return;
        }

        setRoomOccupied(activeRoom.id, false);
        setNotice(`Reservation cancelled for ${activeRoom.number}.`);
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
        router.get(
            '/reservation',
            { page },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <ApartmentLayout title="Reservation">
            <Head title="Reservation" />

            {notice ? (
                <div className="mb-4 rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white">
                    {notice}
                </div>
            ) : null}

            <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[1.2fr_1fr]">
                <article className="min-w-0 self-start rounded-md border border-[#b79f93] bg-white/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                            Room Reservation
                        </h2>
                        <span className="rounded-md bg-[#5f7f95] px-2 py-1 text-[10px] font-semibold text-white">
                            Showing {roomList.length} of {rooms.total} Rooms
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                                    <div className="grid h-24 place-items-center bg-[#e0ddd0] text-xs font-medium uppercase tracking-wide text-[#7a7d79]">
                                        Photo Placeholder
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
                                                : 'bg-[#2ca94e]'
                                        }`}
                                    >
                                        {room.occupied ? 'Occupied' : 'Available'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRoom(room)}
                                        className="rounded-md bg-[#5f7f95] px-3 py-1 text-[11px] font-semibold text-white"
                                    >
                                        {room.occupied ? 'Edit' : 'View'}
                                    </button>
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

                        {Array.from({ length: rooms.last_page }, (_, index) => index + 1).map((pageNumber) => (
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
                            onClick={() => goToPage(Math.min(rooms.last_page, rooms.current_page + 1))}
                            disabled={rooms.current_page === rooms.last_page}
                            className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3f5667] disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </article>

                <article className="rounded-md border border-[#b79f93] bg-white/70 p-4">
                    {activeRoom ? (
                        <>
                            <h2 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                                Room Details
                            </h2>
                            <div className="grid h-44 place-items-center rounded-md border border-[#d8cdc3] bg-[#e0ddd0] text-xs font-medium uppercase tracking-wide text-[#7a7d79]">
                                Photo Placeholder
                            </div>

                            <div className="mt-3 rounded-md border border-[#d8cdc3] bg-[#f7f6f1] p-3 text-xs text-[#415566]">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="font-semibold text-[#2d4f66]">
                                        {activeRoom.number}
                                    </p>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                                            activeRoom.occupied
                                                ? 'bg-[#ff3434]'
                                                : 'bg-[#2ca94e]'
                                        }`}
                                    >
                                        {activeRoom.occupied ? 'Occupied' : 'Available'}
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
                            </div>

                            <div className="mt-4 flex gap-2">
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
                                    className={`rounded-md px-4 py-2 text-xs font-semibold text-white ${
                                        activeRoom.occupied
                                            ? 'bg-[#ff3434]'
                                            : 'bg-[#2ca94e]'
                                    }`}
                                >
                                    {activeRoom.occupied
                                        ? 'Cancel Reservation'
                                        : 'Proceed Reservation'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-[#6f7b86]">No rooms available.</p>
                    )}
                </article>
            </section>

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
                                <input
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    placeholder="Enter full name"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Contact Number
                                <input
                                    value={contactNumber}
                                    onChange={(event) => setContactNumber(event.target.value)}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    placeholder="Enter contact number"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Email Address
                                <input
                                    value={emailAddress}
                                    onChange={(event) => setEmailAddress(event.target.value)}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                    placeholder="Enter email address"
                                />
                            </label>
                            <label className="text-xs text-[#4f6271]">
                                Mode of Payment
                                <select
                                    value={paymentMode}
                                    onChange={(event) => setPaymentMode(event.target.value)}
                                    className="mt-1 h-9 w-full rounded-md border border-[#dbd2c8] bg-white px-2 text-xs outline-none"
                                >
                                    <option>Cash</option>
                                    <option>GCash</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </label>
                        </div>

                        {!isValidReservation ? (
                            <p className="mt-3 text-xs font-semibold text-[#d84a4a]">
                                Fill in valid tenant contact details before confirming.
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
