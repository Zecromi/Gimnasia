"use client"

import { useState, useEffect } from "react"
import { Users, Building2, HandCoins, CircleCheck, CopyX, BookDown, ShieldCheck, BadgeCheck, BadgeX, ShieldX, CalendarClock, DoorOpen } from "lucide-react"
import { motion } from "framer-motion"

import { SummaryCard } from "@/components/dashboard/summary-card"
import { Badge } from "@/components/ui/badge"
import { CountUp } from "@/components/ui/count-up"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getConteos, GetConteosResponse } from "@/lib/conteos"

export default function DashboardPage() {
    const [data, setData] = useState<GetConteosResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getConteos()
                setData(res)
            } catch (error) {
                console.error("Error fetching counts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const clubStatsMap = [
        { label: "Activos", icon: ShieldCheck },
        { label: "Activos con membresia", icon: BadgeCheck },
        { label: "Activos sin membresia", icon: BadgeX },
        { label: "Inactivos", icon: ShieldX },
    ]

    const eventStatsMap = [
        { label: "Vencen", icon: CalendarClock },
        { label: "Abiertas", icon: DoorOpen },
    ]

    const clubStats = data?.Table1.map(item => {
        const config = clubStatsMap.find(c => c.label === (item.descripcion || item.Descripcion))
        return {
            label: item.descripcion || item.Descripcion || "",
            value: <Badge variant="secondary" className="text-2xl"><CountUp end={item.conteo} /></Badge>,
            icon: config?.icon || CircleCheck
        }
    }) || []

    const eventStats = data?.Conteos_club.map(item => {
        const config = eventStatsMap.find(c => c.label === (item.descripcion || item.Descripcion))
        return {
            label: item.descripcion || item.Descripcion || "",
            value: <Badge variant="secondary" className="text-2xl"><CountUp end={item.conteo} /></Badge>,
            icon: config?.icon || DoorOpen
        }
    }) || []

    const totalClubes = data?.Table1.reduce((acc, curr) => acc + curr.conteo, 0) || 0
    const totalEventos = data?.Conteos_club.reduce((acc, curr) => acc + curr.conteo, 0) || 0

    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[1600px] space-y-2">
                <DashboardHeader />
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 sm:col-span-12 md:col-span-12 lg:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <SummaryCard
                                title="Resumen de Clubes"
                                total={<Badge variant="secondary" className="text-2xl"><CountUp end={totalClubes} /></Badge>}
                                icon={Building2}
                                stats={clubStats.length > 0 ? clubStats : [
                                    { label: "Activos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldCheck },
                                    { label: "Activos con membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeCheck },
                                    { label: "Activos sin membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeX },
                                    { label: "Inactivos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldX },
                                ]}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <SummaryCard
                                title="Resumen de Inscripciones"
                                total={<Badge variant="secondary" className="text-2xl"><CountUp end={totalEventos} /></Badge>}
                                icon={CalendarClock}
                                stats={eventStats.length > 0 ? eventStats : [
                                    { label: "Vencen", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: CalendarClock },
                                    { label: "Abiertas", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: DoorOpen },
                                ]}
                            />
                        </motion.div>
                    </div>


                </div>
            </div>
        </div>
    )
}

