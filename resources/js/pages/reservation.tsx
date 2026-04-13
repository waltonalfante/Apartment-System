import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Room = {
    id: number;
    number: string;
    occupied: boolean;
};

export default function Reservation({ rooms }: { rooms: Room[] }) {
    const [roomList, setRoomList] = useState<Room[]>(rooms);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        setRoomList(rooms);
        setSelectedRoom((currentSelectedRoom) => {
            if (!currentSelectedRoom) {
                return null;
            }

            return (
                rooms.find((room) => room.id === currentSelectedRoom.id) ?? null
            );
        });
    }, [rooms]);

    const toggleRoomStatus = (roomId: number) => {
        setRoomList((currentRooms) =>
            currentRooms.map((room) =>
                room.id === roomId
                    ? { ...room, occupied: !room.occupied }
                    : room,
            ),
        );

        setSelectedRoom((currentSelectedRoom) => {
            if (!currentSelectedRoom || currentSelectedRoom.id !== roomId) {
                return currentSelectedRoom;
            }

            return {
                ...currentSelectedRoom,
                occupied: !currentSelectedRoom.occupied,
            };
        });

        router.patch(`/reservation/rooms/${roomId}/toggle`, undefined, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <ApartmentLayout title="Reservation">
            <Head title="Reservation" />

            <section className="grid min-w-0 gap-6 lg:grid-cols-2">
                {roomList.map((room) => (
                    <article
                        key={room.number}
                        className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                    >
                        <div className="grid h-48 place-items-center bg-gradient-to-br from-slate-200 to-slate-300 text-lg font-semibold text-slate-600">
                            Photo 
                        </div>

                        <div className="space-y-4 p-4">
                            <h2 className="text-center text-3xl font-semibold text-slate-900">
                                {room.number}
                            </h2>

                            <div className="flex gap-3">
                                <span
                                    className={`flex-1 rounded-xl px-4 py-2 text-center text-xl font-bold text-white ${
                                        room.occupied
                                            ? 'bg-[#ff2a3b]'
                                            : 'bg-[#0bbf4b]'
                                    }`}
                                >
                                    {room.occupied ? 'Occupied' : 'Available'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoom(room)}
                                    className="rounded-xl bg-[#56798b] px-5 py-2 text-xl font-bold text-white"
                                >
                                    {room.occupied ? 'Edit' : 'View'}
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {selectedRoom ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 lg:pl-[280px]"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedRoom(null)}
                >
                    <div
                        className="apartment-modal-content w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold text-slate-900">
                            {selectedRoom.number}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Use this panel to update and save room status.
                        </p>
                        <p className="mt-4 text-sm">
                            Current status:{' '}
                            <span className="font-semibold">
                                {selectedRoom.occupied ? 'Occupied' : 'Available'}
                            </span>
                        </p>
                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedRoom(null)}
                                className="rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleRoomStatus(selectedRoom.id)}
                                className="rounded-xl bg-[#284f61] px-4 py-2 text-sm font-semibold text-white"
                            >
                                Mark as {selectedRoom.occupied ? 'Available' : 'Occupied'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
