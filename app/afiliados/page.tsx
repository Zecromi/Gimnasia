import { Metadata } from "next"
import { AfiliadosView } from "@/components/dashboard/afiliados-view"

export const metadata: Metadata = {
    title: "Afiliados",
    description: "Gestión de Afiliados",
}

export default function AfiliadosPage() {
    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-4">
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-12">
                        <AfiliadosView />
                    </div>
                </div>
            </div>
        </div>
    )
}
