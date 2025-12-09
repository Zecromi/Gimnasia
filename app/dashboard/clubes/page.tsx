import { Metadata } from "next"
import { ClubesView } from "@/components/dashboard/clubes-view"
import { Sidebar } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
    title: "Clubes",
    description: "Gestión de Clubes",
}

export default function ClubesPage() {
    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-4">
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-12">
                        <ClubesView />
                    </div>


                </div>
            </div>
        </div>
    )
}
