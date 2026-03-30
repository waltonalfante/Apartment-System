import { Head } from '@inertiajs/react';
import ApartmentLayout from '@/layouts/apartment-layout';

export default function Maintenance() {
    return (
        <ApartmentLayout title="Maintenance">
            <Head title="Maintenance" />

            <section className="rounded-2xl bg-white p-8 shadow-sm">
                <p className="text-lg text-slate-600">
                    Maintenance module placeholder.
                </p>
            </section>
        </ApartmentLayout>
    );
}
