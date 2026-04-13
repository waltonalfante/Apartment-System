import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Conversation = {
    id: number;
    name: string;
    room: string;
    message: string;
    time: string;
    unread: boolean;
};

const maxRoomNumber = 15;

const sanitizeRoomInput = (value: string) =>
    value.replace(/[^\d]/g, '').slice(0, 2);

const parseRoomNumber = (value: string) => {
    if (!/^\d{1,2}$/.test(value.trim())) {
        return Number.NaN;
    }

    return Number(value.trim());
};

const formatRoomLabel = (roomNumber: number) =>
    `Room ${String(roomNumber).padStart(2, '0')}`;

export default function Communication({
    conversations: initialConversations,
}: {
    conversations: Conversation[];
}) {
    const [conversations, setConversations] = useState(initialConversations);
    const [mode, setMode] = useState<'all' | 'specific'>('specific');
    const [selectedConversation, setSelectedConversation] = useState<
        Conversation | null
    >(null);
    const [draftMessage, setDraftMessage] = useState('');
    const [broadcastDraft, setBroadcastDraft] = useState('');
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState<'success' | 'error'>('success');
    const [draftMessageError, setDraftMessageError] = useState('');
    const [conversationSelectionError, setConversationSelectionError] = useState('');
    const [newConversationErrors, setNewConversationErrors] = useState<{
        name?: string;
        room?: string;
    }>({});
    const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);
    const [newConversationDraft, setNewConversationDraft] = useState({
        name: '',
        room: '',
        message: '',
    });

    const unreadCount = useMemo(
        () => conversations.filter((conversation) => conversation.unread).length,
        [conversations],
    );

    const openConversation = (id: number) => {
        const target = conversations.find((conversation) => conversation.id === id);
        if (!target) {
            return;
        }

        setSelectedConversation({ ...target, unread: false });
        setConversationSelectionError('');
        setDraftMessageError('');
        setConversations((currentConversations) =>
            currentConversations.map((conversation) =>
                conversation.id === id
                    ? { ...conversation, unread: false }
                    : conversation,
            ),
        );

        router.patch(`/communication/conversations/${id}/open`, undefined, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const sendMessage = () => {
        if (!selectedConversation) {
            setConversationSelectionError('Select a tenant first before sending a message.');

            return;
        }

        if (!draftMessage.trim()) {
            setConversationSelectionError('');
            setDraftMessageError('Message cannot be empty.');

            return;
        }

        const nextMessage = draftMessage.trim();
        setDraftMessage('');
        setDraftMessageError('');
        setConversationSelectionError('');

        setConversations((currentConversations) =>
            currentConversations.map((conversation) =>
                conversation.id === selectedConversation.id
                    ? {
                          ...conversation,
                          message: nextMessage,
                          time: 'Just now',
                          unread: false,
                      }
                    : conversation,
            ),
        );

        setSelectedConversation((currentConversation) =>
            currentConversation
                ? {
                      ...currentConversation,
                      message: nextMessage,
                      time: 'Just now',
                      unread: false,
                  }
                : null,
        );
            setNoticeType('success');
            setNotice(`Message sent to ${selectedConversation.name}.`);

        router.post(
            `/communication/conversations/${selectedConversation.id}/message`,
            {
                message: nextMessage,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const broadcastMessage = () => {
        const broadcastText =
            broadcastDraft.trim() ||
            'Admin broadcast sent. Please check your latest announcements.';

        setConversations((currentConversations) =>
            currentConversations.map((conversation) => ({
                ...conversation,
                message: broadcastText,
                time: 'Just now',
                unread: true,
            })),
        );
        setSelectedConversation(null);
        setBroadcastDraft('');
        setNoticeType('success');
        setNotice('Broadcast message sent to all tenants.');

        router.post(
            '/communication/broadcast',
            {
                message: broadcastText,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const addMessageConversation = () => {
        const name = newConversationDraft.name.trim();
        const roomNumber = parseRoomNumber(newConversationDraft.room);
        const openingMessage =
            newConversationDraft.message.trim() || 'New conversation started.';
        const nextErrors: { name?: string; room?: string } = {};

        if (name.length < 3) {
            nextErrors.name = 'Tenant name must be at least 3 characters.';
        }

        if (!Number.isInteger(roomNumber) || roomNumber < 1 || roomNumber > maxRoomNumber) {
            nextErrors.room = 'Room number must be between 01 and 15 only.';
        }

        if (nextErrors.name || nextErrors.room) {
            setNewConversationErrors(nextErrors);

            return;
        }

        setNewConversationErrors({});

        const roomLabel = formatRoomLabel(roomNumber);
        const nextId = conversations.reduce((maxId, conversation) =>
            Math.max(maxId, conversation.id), 0) + 1;
        const nextConversation: Conversation = {
            id: nextId,
            name,
            room: roomLabel,
            message: openingMessage,
            time: 'Just now',
            unread: false,
        };

        setConversations((currentConversations) => [
            ...currentConversations,
            nextConversation,
        ]);
        setSelectedConversation(nextConversation);
        setMode('specific');
        setIsAddMessageOpen(false);
        setNewConversationDraft({
            name: '',
            room: '',
            message: '',
        });
        setNoticeType('success');
        setNotice(`New message thread created for ${name}.`);

        router.post(
            '/communication/conversations',
            {
                name,
                room: roomLabel,
                message: openingMessage,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <ApartmentLayout title="Communication Center">
            <Head title="Communication" />

            <section className="space-y-4">
                {notice && noticeType === 'success' ? (
                    <div
                        className="rounded-md bg-[#2ca94e] px-3 py-2 text-xs font-semibold text-white"
                    >
                        {notice}
                    </div>
                ) : null}

                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setMode('specific')}
                        className={`rounded-md px-3 py-1.5 ${
                            mode === 'specific'
                                ? 'bg-[#5f7f95] text-white'
                                : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                        }`}
                    >
                        Send Message to Specific Tenant
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('all')}
                        className={`rounded-md px-3 py-1.5 ${
                            mode === 'all'
                                ? 'bg-[#5f7f95] text-white'
                                : 'border border-[#c9bbb0] bg-white text-[#3f5667]'
                        }`}
                    >
                        Send Message to All
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddMessageOpen(true);
                            setNewConversationErrors({});
                        }}
                        className="rounded-md border border-[#c9bbb0] bg-white px-3 py-1.5 text-[#3f5667]"
                    >
                        + Add Message
                    </button>
                </div>

                {mode === 'specific' ? (
                    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
                        <article className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                            <h2 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                                Communication Center
                            </h2>

                            <div className="apartment-scrollbar max-h-[430px] overflow-y-auto pr-1">
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {conversations.map((message) => (
                                        <button
                                            key={message.id}
                                            type="button"
                                            onClick={() => openConversation(message.id)}
                                            className={`rounded-md border p-2 text-left text-xs transition ${
                                                selectedConversation?.id === message.id
                                                    ? 'border-[#5f7f95] bg-white'
                                                    : 'border-[#d8cdc3] bg-[#fffdf8]'
                                            }`}
                                        >
                                            <div className="mb-2 h-10 rounded-sm bg-[#54758b]" />
                                            <p className="font-semibold text-[#2f4e64]">{message.name}</p>
                                            <p className="text-[#5f6e7a]">Gender: -</p>
                                            <p className="text-[#5f6e7a]">{message.room}</p>
                                            {message.unread ? (
                                                <span className="mt-1 inline-block rounded-full bg-[#ef4242] px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    New
                                                </span>
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </article>

                        <article className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                            <h2 className="text-sm font-semibold uppercase text-[#2f4e64]">
                                {selectedConversation
                                    ? `Message ${selectedConversation.name}`
                                    : 'Select a Tenant'}
                            </h2>

                            {selectedConversation ? (
                                <div className="mt-3 space-y-3">
                                    <div className="rounded-md border border-[#d8cdc3] bg-white px-3 py-2 text-xs text-[#465a69]">
                                        <p className="font-semibold text-[#2f4e64]">{selectedConversation.name}</p>
                                        <p>{selectedConversation.room}</p>
                                        <p className="mt-1">Last Message: {selectedConversation.message}</p>
                                    </div>

                                    <textarea
                                        value={draftMessage}
                                        onChange={(event) => {
                                            setDraftMessage(event.target.value);
                                            if (draftMessageError) {
                                                setDraftMessageError('');
                                            }
                                        }}
                                        rows={8}
                                        placeholder="Write message here..."
                                        className={`w-full rounded-md bg-white p-3 text-xs text-[#3e5262] outline-none ${
                                            draftMessageError ? 'border border-[#d84a4a]' : 'border border-[#d8cdc3]'
                                        }`}
                                    />
                                    {draftMessageError ? (
                                        <p className="text-[11px] font-semibold text-[#d84a4a]">
                                            {draftMessageError}
                                        </p>
                                    ) : null}

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setDraftMessage('')}
                                            className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={sendMessage}
                                            className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid min-h-[320px] place-items-center text-center text-xs text-[#6e7c88]">
                                    <div className="space-y-2">
                                        {conversationSelectionError ? (
                                            <p className="rounded-md border border-[#d84a4a] bg-[#fff5f5] px-3 py-2 text-[#b23636]">
                                                {conversationSelectionError}
                                            </p>
                                        ) : null}
                                        <p>Select a tenant card to compose a message.</p>
                                    </div>
                                </div>
                            )}
                        </article>
                    </div>
                ) : (
                    <article className="rounded-md border border-[#b79f93] bg-white/75 p-4">
                        <h2 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Communication Center
                        </h2>

                        <div className="rounded-md border border-[#d8cdc3] bg-white p-3">
                            <div className="mb-2 flex -space-x-2">
                                {conversations.slice(0, 5).map((conversation) => (
                                    <div
                                        key={`avatar-${conversation.id}`}
                                        className="grid h-7 w-7 place-items-center rounded-full border border-white bg-[#54758b] text-[10px] font-semibold text-white"
                                    >
                                        {conversation.name
                                            .split(' ')
                                            .map((part) => part[0])
                                            .join('')
                                            .slice(0, 2)}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                value={broadcastDraft}
                                onChange={(event) => setBroadcastDraft(event.target.value)}
                                rows={8}
                                placeholder="Write broadcast message for all tenants..."
                                className="w-full rounded-md border border-[#d8cdc3] bg-[#f9f8f3] p-3 text-xs text-[#3e5262] outline-none"
                            />

                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setBroadcastDraft('')}
                                    className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={broadcastMessage}
                                    className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </article>
                )}

                <div className="grid gap-3 md:grid-cols-3">
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-4 py-3 text-center">
                        <p className="text-2xl font-semibold text-[#2f4e64]">{unreadCount}</p>
                        <p className="text-xs text-[#6e7c88]">Unread Messages</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-4 py-3 text-center">
                        <p className="text-2xl font-semibold text-[#2f4e64]">{conversations.length}</p>
                        <p className="text-xs text-[#6e7c88]">Active Conversations</p>
                    </article>
                    <article className="rounded-md border border-[#d8cdc3] bg-white px-4 py-3 text-center">
                        <p className="text-2xl font-semibold text-[#2f4e64]">
                            {conversations.filter((conversation) => conversation.unread).length}
                        </p>
                        <p className="text-xs text-[#6e7c88]">Pending Requests</p>
                    </article>
                </div>
            </section>

            {isAddMessageOpen ? (
                <div
                    className="apartment-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsAddMessageOpen(false)}
                >
                    <div
                        className="apartment-modal-content apartment-scrollbar w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-md border border-[#b79f93] bg-[#f8f7f3] p-4 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-[#2f4e64]">
                            Add New Message
                        </h3>

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-[#4f6271]">
                                Tenant Name
                                <input
                                    value={newConversationDraft.name}
                                    onChange={(event) =>
                                        {
                                            setNewConversationDraft((currentDraft) => ({
                                                ...currentDraft,
                                                name: event.target.value,
                                            }));
                                            if (newConversationErrors.name) {
                                                setNewConversationErrors((currentErrors) => ({
                                                    ...currentErrors,
                                                    name: undefined,
                                                }));
                                            }
                                        }
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        newConversationErrors.name
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                    placeholder="e.g. Maria Cruz"
                                />
                                {newConversationErrors.name ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {newConversationErrors.name}
                                    </p>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271]">
                                Room Number
                                <input
                                    value={newConversationDraft.room}
                                    onChange={(event) =>
                                        {
                                            setNewConversationDraft((currentDraft) => ({
                                                ...currentDraft,
                                                room: sanitizeRoomInput(event.target.value),
                                            }));
                                            if (newConversationErrors.room) {
                                                setNewConversationErrors((currentErrors) => ({
                                                    ...currentErrors,
                                                    room: undefined,
                                                }));
                                            }
                                        }
                                    }
                                    className={`mt-1 h-9 w-full rounded-md bg-white px-2 text-xs outline-none ${
                                        newConversationErrors.room
                                            ? 'border border-[#d84a4a]'
                                            : 'border border-[#dbd2c8]'
                                    }`}
                                    placeholder="01 - 15"
                                    inputMode="numeric"
                                    maxLength={2}
                                />
                                {newConversationErrors.room ? (
                                    <p className="mt-1 text-[11px] font-semibold text-[#d84a4a]">
                                        {newConversationErrors.room}
                                    </p>
                                ) : null}
                            </label>

                            <label className="text-xs text-[#4f6271] md:col-span-2">
                                Initial Message (Optional)
                                <textarea
                                    value={newConversationDraft.message}
                                    onChange={(event) =>
                                        setNewConversationDraft((currentDraft) => ({
                                            ...currentDraft,
                                            message: event.target.value,
                                        }))
                                    }
                                    rows={5}
                                    className="mt-1 w-full rounded-md border border-[#dbd2c8] bg-white p-2 text-xs outline-none"
                                    placeholder="Write an initial message..."
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAddMessageOpen(false)}
                                className="rounded-md border border-[#c9bbb0] bg-white px-4 py-1.5 text-xs font-semibold text-[#3f5667]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addMessageConversation}
                                className="rounded-md bg-[#2ca94e] px-4 py-1.5 text-xs font-semibold text-white"
                            >
                                Create Message
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ApartmentLayout>
    );
}
