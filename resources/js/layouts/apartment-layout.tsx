import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    LayoutDashboard,
    MessageSquare,
    ReceiptText,
    Settings,
    User,
    Users,
    Wrench,
} from 'lucide-react';
import type { ComponentType, PropsWithChildren } from 'react';

type NavItem = {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Reservation', href: '/reservation', icon: Calendar },
    { label: 'Tenant Management', href: '/tenant-management', icon: Users },
    { label: 'Billing', href: '/billing', icon: ReceiptText },
    { label: 'Communication', href: '/communication', icon: MessageSquare },
    { label: 'Maintenance', href: '/maintenance', icon: Wrench },
    { label: 'Admin Settings', href: '/admin-settings', icon: Settings },
];

export default function ApartmentLayout({
    children,
    title,
}: PropsWithChildren<{ title: string }>) {
    const { url } = usePage();

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#efede7] text-slate-900">
            <aside className="fixed inset-y-0 left-0 hidden w-[280px] bg-[#284f61] text-white lg:block">
                <div className="border-b border-white/10 px-6 py-7">
                    <p className="text-3xl font-extrabold uppercase tracking-tight">
                        The Sammie's
                    </p>
                    <p className="text-3xl font-extrabold uppercase tracking-tight">
                        Apartment
                    </p>
                </div>

                <nav className="space-y-2 px-4 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            url === item.href ||
                            (item.href !== '/dashboard' &&
                                url.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold transition ${
                                    isActive
                                        ? 'bg-[#406273] text-white'
                                        : 'text-white/85 hover:bg-[#355a6a] hover:text-white'
                                }`}
                            >
                                <Icon className="h-6 w-6" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute inset-x-0 bottom-4 px-4">
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/90">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                            <User className="h-5 w-5" />
                        </div>
                        <p className="text-base font-semibold">Walton</p>
                    </div>
                </div>
            </aside>

            <main className="w-full lg:pl-[280px]">
                <div className="border-b border-black/10 bg-[#284f61] px-4 py-3 text-white lg:hidden">
                    <p className="text-lg font-bold uppercase tracking-tight">
                        The Sammie's Apartment
                    </p>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {navItems.map((item) => {
                            const isActive =
                                url === item.href ||
                                (item.href !== '/dashboard' &&
                                    url.startsWith(item.href));

                            return (
                                <Link
                                    key={`mobile-${item.href}`}
                                    href={item.href}
                                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${
                                        isActive
                                            ? 'bg-[#406273] text-white'
                                            : 'bg-[#355a6a] text-white/85'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 lg:p-10">
                    <h1 className="mb-6 text-4xl font-bold uppercase tracking-tight lg:mb-8 lg:text-5xl">
                        {title}
                    </h1>
                    {children}
                </div>
            </main>

            <button
                type="button"
                className="fixed bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-black/85 text-white"
            >
                ?
            </button>
        </div>
    );
}
