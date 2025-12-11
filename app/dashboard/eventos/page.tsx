import { Metadata } from "next"
import { EventosView } from "@/components/dashboard/eventos/eventos-view"

export const metadata: Metadata = {
    title: "Eventos",
    description: "Gestión de Eventos",
}

export default function EventosPage() {
    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-4">
                <div className="space-y-6">
                    <EventosView />
                </div>
            </div>
        </div>
    )
}
