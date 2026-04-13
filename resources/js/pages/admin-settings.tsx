import { Head } from '@inertiajs/react';
import ApartmentLayout from '@/layouts/apartment-layout';

export default function AdminSettings() {
    return (
        <ApartmentLayout title="Admin Settings">
            <Head title="Admin Settings" />

            <section className="rounded-2xl bg-white p-8 shadow-sm">
                <p className="text-lg text-slate-600">
                    Admin settings module placeholder.
                </p>
            </section>
        </ApartmentLayout>
    );
}
