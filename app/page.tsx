import { Metadata } from "next"
import { Users, Building2 } from "lucide-react"

import { SummaryCard } from "@/components/dashboard/summary-card"
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
              total={9393}
              icon={Users}
              stats={[
                { label: "Afiliados con afiliación pagada", value: 2576 },
                { label: "Afiliados en Alta", value: 5084 },
                { label: "Afiliados activos sin 2da validación CURP", value: 5 },
                { label: "Afiliados en Baja", value: 4309 },
              ]}
            />
            <SummaryCard
              title="Clubes registrados en intranet"
              total={104}
              icon={Building2}
              stats={[
                { label: "Clubes activos", value: 99 },
                { label: "Clubes activos con membresía", value: 75 },
                { label: "Clubes activos sin membresía", value: 217 },
                { label: "Clubes inactivos", value: 5 },
              ]}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
