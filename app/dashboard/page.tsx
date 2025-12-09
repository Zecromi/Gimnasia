import { Metadata } from "next"
import { Users, Building2 } from "lucide-react"

import { SummaryCard } from "@/components/dashboard/summary-card"
import { Badge } from "@/components/ui/badge"
import { CountUp } from "@/components/ui/count-up"
import { Sidebar } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard de resumen",
}

export default function DashboardPage() {
    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-4">
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-9">
                        <SummaryCard
                            title="Afiliados registrados en intranet"
                            total={<Badge variant="secondary" className="text-2xl"><CountUp end={9393} /></Badge>}
                            icon={Users}
                            stats={[
                                { label: "Afiliados con afiliación pagada", value: <Badge variant="secondary" className="text-2xl"><CountUp end={2576} /></Badge> },
                                { label: "Afiliados en Alta", value: <Badge variant="secondary" className="text-2xl"><CountUp end={5084} /></Badge> },
                                { label: "Afiliados activos sin 2da validación CURP", value: <Badge variant="secondary" className="text-2xl"><CountUp end={5} /></Badge> },
                                { label: "Afiliados en Baja", value: <Badge variant="secondary" className="text-2xl"><CountUp end={4309} /></Badge> },
                            ]}
                        />
                        <SummaryCard
                            title="Clubes registrados en intranet"
                            total={<Badge variant="secondary" className="text-2xl"><CountUp end={104} /></Badge>}
                            icon={Building2}
                            stats={[
                                { label: "Clubes activos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={99} /></Badge> },
                                { label: "Clubes activos con membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={75} /></Badge> },
                                { label: "Clubes activos sin membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={217} /></Badge> },
                                { label: "Clubes inactivos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={5} /></Badge> },
                            ]}
                        />
                    </div>

                    {/* Sidebar (Info Panel) */}
                    <div className="lg:col-span-3">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}
