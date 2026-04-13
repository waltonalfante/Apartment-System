import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    ReceiptText,
    Settings,
    Users,
    Wrench,
} from 'lucide-react';
import type { ComponentType, PropsWithChildren } from 'react';
import { logout } from '@/routes';

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
    const { url, props } = usePage<{
        auth?: {
            user?: {
                name?: string;
            };
        };
    }>();

    const currentUser = props.auth?.user?.name ?? 'Admin';

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#191a1f] text-[#223645]">
            <div className="min-h-screen w-full overflow-hidden bg-[#ece8d8] shadow-[0_24px_48px_rgba(0,0,0,0.3)]">
                <div className="flex min-h-screen">
                    <aside className="hidden w-[220px] shrink-0 bg-[#1B3C53] text-[#c8d7e2] lg:flex lg:flex-col">
                        <div className="px-5 pb-4 pt-7">
                            <p className="text-[22px] font-bold uppercase leading-7 tracking-tight text-[#dceaf2]">
                                The Sammie's
                            </p>
                            <p className="text-[22px] font-bold uppercase leading-7 tracking-tight text-[#dceaf2]">
                                Apartment
                            </p>

                            <div className="mt-5 rounded-md bg-white/8 px-3 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-[#98b4c7]">
                                    Signed in as
                                </p>
                                <p className="truncate text-sm font-semibold text-white">
                                    {currentUser}
                                </p>

                                <Link
                                    href={logout()}
                                    as="button"
                                    className="mt-2 inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold text-[#dceaf2] hover:bg-white/20"
                                >
                                    <LogOut className="h-3 w-3" />
                                    Log out
                                </Link>
                            </div>
                        </div>

                        <nav className="apartment-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6 pt-1">
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
                                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-semibold transition ${
                                            isActive
                                                ? 'bg-[#5c7f96] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]'
                                                : 'text-[#d4e1ea] hover:bg-[#3d6279] hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                    </aside>

                    <main className="min-w-0 flex-1">
                        <div className="border-b border-black/10 bg-[#1B3C53] px-4 py-3 text-white lg:hidden">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-base font-bold uppercase tracking-tight">
                                    The Sammie's Apartment
                                </p>
                                <Link
                                    href={logout()}
                                    as="button"
                                    className="inline-flex items-center gap-1 rounded-md bg-[#3d6279] px-2 py-1 text-[10px] font-semibold text-[#d9e6ef]"
                                >
                                    <LogOut className="h-3 w-3" />
                                    Log out
                                </Link>
                            </div>
                            <div className="apartment-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                                {navItems.map((item) => {
                                    const isActive =
                                        url === item.href ||
                                        (item.href !== '/dashboard' &&
                                            url.startsWith(item.href));

                                    return (
                                        <Link
                                            key={`mobile-${item.href}`}
                                            href={item.href}
                                            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ${
                                                isActive
                                                    ? 'bg-[#5c7f96] text-white'
                                                    : 'bg-[#3d6279] text-[#d9e6ef]'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
                            <h1 className="apartment-page-title mb-5 text-[#0f1c3a] lg:mb-6">
                                {title}
                            </h1>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
