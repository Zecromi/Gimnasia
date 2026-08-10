"use client"

import { useState, useEffect } from "react"
import { Users, Building2, HandCoins, CircleCheck, CopyX, BookDown, ShieldCheck, BadgeCheck, BadgeX, ShieldX, CalendarClock, DoorOpen, UserCheck, UserMinus, UserX, Target, ClipboardList, ClipboardCheck } from "lucide-react"
import { motion } from "framer-motion"

import { SummaryCard } from "@/components/dashboard/summary-card"
import { Badge } from "@/components/ui/badge"
import { CountUp } from "@/components/ui/count-up"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getConteos, GetConteosResponse, getConteosAfil, GetConteosAfilResponse } from "@/lib/conteos"
import { useAuthStore } from "@/lib/store/auth-store"

export default function DashboardPage() {
    const [data, setData] = useState<GetConteosResponse | null>(null)
    const [dataAfil, setDataAfil] = useState<GetConteosAfilResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const authData = useAuthStore((state) => state.authData)

    useEffect(() => {
        const fetchData = async () => {
            if (!authData) return; // Wait for auth data

            try {
                // If the user's registry type is 2 (Club), fetch their specific stats instead
                // or fetch both, but the requirement suggests displaying them based on this condition
                // eslint-disable-next-line eqeqeq
                if (authData.tipo_registro == 2) {
                    // Only fetch specific club data
                    const resAfil = await getConteosAfil(authData.id.toString())
                    setDataAfil(resAfil)
                } else {
                    const res = await getConteos()
                    setData(res)
                }
            } catch (error) {
                console.error("Error fetching counts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [authData])

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

    // Specific Club (tipo == 2) logic
    const afilStatsMap = [
        { label: "Inscritos", icon: Target },
        { label: "Con Afiliacion", icon: UserCheck },
        { label: "Sin Afiliacion", icon: UserX },
    ]

    const afilStats = dataAfil?.Conteos_afiliados.map(item => {
        const config = afilStatsMap.find(c => c.label === item.estatus)
        return {
            label: item.estatus,
            value: <Badge variant="secondary" className="text-2xl"><CountUp end={item.conteo} /></Badge>,
            icon: config?.icon || Users
        }
    }) || []

    const totalAfilInscritos = dataAfil?.Conteos_inscritos.reduce((acc, curr) => acc + curr.conteo, 0) || 0

    return (
        <div className="flex-1 p-4">
            <div className="mx-auto max-w-[auto] space-y-2">
                <DashboardHeader />
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Content (Only for Non-Clubs) */}
                    {/* eslint-disable-next-line eqeqeq */}
                    {authData?.tipo_registro != 2 && (
                        <div className="space-y-12 sm:col-span-12 md:col-span-12 lg:col-span-12 pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <SummaryCard
                                    title="Resumen de"
                                    italic="Clubes"
                                    total={<Badge variant="secondary" className="text-2xl "><CountUp end={totalClubes} /></Badge>}
                                    icon={Building2}
                                    stats={clubStats.length > 0 ? clubStats : [
                                        { label: "Activos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldCheck },
                                        { label: "Activos con membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeCheck },
                                        { label: "Activos sin membresía", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: BadgeX },
                                        { label: "Inactivos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: ShieldX },
                                    ]}
                                />
                            </motion.div>
                            <hr className="border-border/40" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <SummaryCard
                                    title="Resumen de"
                                    italic="Inscripciones"
                                    total={<Badge variant="secondary" className="text-2xl"><CountUp end={totalEventos} /></Badge>}
                                    icon={CalendarClock}
                                    stats={eventStats.length > 0 ? eventStats : [
                                        { label: "Vencen", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: CalendarClock },
                                        { label: "Abiertas", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: DoorOpen },
                                    ]}
                                />
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Club Specific Cards */}
                {/* eslint-disable-next-line eqeqeq */}
                {authData?.tipo_registro == 2 && dataAfil && (
                    <div className="grid gap-6 lg:grid-cols-12 mt-6">
                        <div className="space-y-12 sm:col-span-12 md:col-span-12 lg:col-span-12 pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <SummaryCard
                                    title="Conteos"
                                    italic="Afiliados"
                                    total={<Badge variant="secondary" className="text-2xl"><CountUp end={
                                        dataAfil.Conteos_afiliados.reduce((acc, curr) => acc + curr.conteo, 0)
                                    } /></Badge>}
                                    icon={Users}
                                    stats={afilStats.length > 0 ? afilStats : [
                                        { label: "Inscritos", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: Target },
                                        { label: "Con Afiliacion", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: UserCheck },
                                        { label: "Sin Afiliacion", value: <Badge variant="secondary" className="text-2xl"><CountUp end={0} /></Badge>, icon: UserX },
                                    ]}
                                />
                            </motion.div>

                            <hr className="border-border/40" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <SummaryCard
                                    title="Eventos"
                                    italic="Inscritos Actualmente"
                                    total={<Badge variant="secondary" className="text-2xl"><CountUp end={totalAfilInscritos} /></Badge>}
                                    icon={ClipboardList}
                                    stats={[
                                        { label: "Inscritos Actualmente", value: <Badge variant="secondary" className="text-2xl"><CountUp end={totalAfilInscritos} /></Badge>, icon: ClipboardCheck },
                                    ]}
                                />
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
