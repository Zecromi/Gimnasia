"use client"

import { Users, Building2, HandCoins, CircleCheck, CopyX, BookDown, ShieldCheck, BadgeCheck, BadgeX, ShieldX } from "lucide-react"
import { motion } from "framer-motion"

import { SummaryCard } from "@/components/dashboard/summary-card"
import { Badge } from "@/components/ui/badge"
import { CountUp } from "@/components/ui/count-up"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-2">
                <DashboardHeader />
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-9">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <SummaryCard
                                title="Afiliados registrados en intranet"
                                total={<Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>}
                                icon={Users}
                                stats={[
                                    { label: "Afiliados con afiliación pagada", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: HandCoins },
                                    { label: "Afiliados en Alta", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: CircleCheck },
                                    { label: "Afiliados activos sin 2da validación CURP", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: CopyX },
                                    { label: "Afiliados en Baja", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BookDown },
                                ]}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <SummaryCard
                                title="Clubes registrados en intranet"
                                total={<Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>}
                                icon={Building2}
                                stats={[
                                    { label: "Clubes activos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldCheck },
                                    { label: "Clubes activos con membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeCheck },
                                    { label: "Clubes activos sin membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeX },
                                    { label: "Clubes inactivos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldX },
                                ]}
                            />
                        </motion.div>
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

