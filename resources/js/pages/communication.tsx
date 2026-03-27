import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import ApartmentLayout from '@/layouts/apartment-layout';

type Conversation = {
    id: number;
    name: string;
    room: string;
    message: string;
    time: string;
    unread: boolean;
};

export default function Communication({
    conversations: initialConversations,
}: {
    conversations: Conversation[];
}) {
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState<
        Conversation | null
    >(null);
    const [draftMessage, setDraftMessage] = useState('');

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
        if (!selectedConversation || !draftMessage.trim()) {
            return;
        }

        const nextMessage = draftMessage.trim();
        setDraftMessage('');

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
        const broadcastText = 'Admin broadcast sent. Please check your latest announcements.';

        setConversations((currentConversations) =>
            currentConversations.map((conversation) => ({
                ...conversation,
                message: broadcastText,
                time: 'Just now',
                unread: true,
            })),
        );
        setSelectedConversation(null);

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

    return (
        <ApartmentLayout title="Communication Center">
            <Head title="Communication" />

            <section className="space-y-6">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={broadcastMessage}
                        className="rounded-xl bg-[#56798b] px-5 py-2 text-base font-semibold text-white"
                    >
                        Broadcast Message
                    </button>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <article className="rounded-2xl bg-white p-7 shadow-sm">
                        <h2 className="mb-6 text-4xl font-semibold">
                            Recent Messages
                        </h2>
                        <div className="space-y-8">
                            {conversations.map((message) => (
                                <button
                                    key={message.id}
                                    type="button"
                                    onClick={() => openConversation(message.id)}
                                    className="flex w-full gap-4 rounded-xl p-2 text-left hover:bg-slate-50"
                                >
                                    <UserCircle2 className="mt-1 h-12 w-12 text-slate-400" />
                                    <div className="flex-1">
                                        <div className="flex justify-between gap-2 text-3xl font-semibold">
                                            <p className="flex items-center gap-2">
                                                <span>{message.name}</span>
                                                {message.unread ? (
                                                    <span className="rounded-full bg-[#ff2a3b] px-2 py-0.5 text-xs text-white">
                                                        New
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {message.time}
                                            </p>
                                        </div>
                                        <p className="text-base text-slate-500">
                                            {message.room}
                                        </p>
                                        <p className="text-lg text-slate-700">
                                            {message.message}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl bg-white p-7 shadow-sm">
                        {selectedConversation ? (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-semibold text-slate-900">
                                    {selectedConversation.name}
                                </h2>
                                <p className="text-base text-slate-500">
                                    {selectedConversation.room}
                                </p>
                                <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
                                    {selectedConversation.message}
                                </div>
                                <textarea
                                    value={draftMessage}
                                    onChange={(event) => setDraftMessage(event.target.value)}
                                    rows={4}
                                    placeholder="Type your reply here"
                                    className="w-full rounded-xl border border-black/15 p-3 text-sm outline-none focus:border-[#56798b]"
                                />
                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    className="rounded-xl bg-[#56798b] px-5 py-2 text-sm font-semibold text-white"
                                >
                                    Send Reply
                                </button>
                            </div>
                        ) : (
                            <div className="grid min-h-[330px] place-items-center text-center">
                                <div>
                                    <h2 className="mb-20 text-4xl font-semibold text-slate-900">
                                        Select a conversation
                                    </h2>
                                    <p className="text-lg text-slate-400">
                                        Select a conversation to view messages
                                    </p>
                                </div>
                            </div>
                        )}
                    </article>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl bg-white px-6 py-7 text-center shadow-sm">
                        <p className="text-5xl font-semibold">{unreadCount}</p>
                        <p className="text-lg text-slate-600">Unread Messages</p>
                    </article>
                    <article className="rounded-2xl bg-white px-6 py-7 text-center shadow-sm">
                        <p className="text-5xl font-semibold">{conversations.length}</p>
                        <p className="text-lg text-slate-600">Active Conversations</p>
                    </article>
                    <article className="rounded-2xl bg-white px-6 py-7 text-center shadow-sm">
                        <p className="text-5xl font-semibold">
                            {conversations.filter((conversation) => conversation.unread).length}
                        </p>
                        <p className="text-lg text-slate-600">Pending Requests</p>
                    </article>
                </div>
            </section>
        </ApartmentLayout>
    );
}
