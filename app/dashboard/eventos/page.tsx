import { Metadata } from "next"
import { EventosView } from "@/components/dashboard/eventos/eventos-view"

export const metadata: Metadata = {
    title: "Eventos",
    description: "Gestión de Eventos",
}

export default function EventosPage() {
    return (
        <div className="flex-1 p-4">
            <div className="w-full space-y-4">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 xl:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-12 xl:col-span-12">
                        <EventosView />
                    </div>
                </div>
            </div>
        </div>
    )
}
