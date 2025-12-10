import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface SubStat {
    label: string
    value: ReactNode | string | number
    icon?: LucideIcon
}

interface SummaryCardProps {
    title: string
    total: ReactNode | string | number
    icon: LucideIcon
    stats: SubStat[]
}

export function SummaryCard({ title, total, icon: Icon, stats }: SummaryCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-none rounded-2xl bg-[#E4F2EF] dark:bg-zinc-900">
            <div className="flex items-start justify-between bg-teal-900/10 dark:bg-zinc-800/80 px-6 py-4 pt-4 pb-2 rounded-t-2xl">
                <div className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-teal-800 dark:text-teal-400 mt-1" />
                    <h3 className="text-md font-semibold text-teal-900 dark:text-teal-300">{title}</h3>
                </div>
                <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">{total}</div>
            </div>
            <CardContent className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-none rounded-2xl bg-white dark:bg-zinc-800 border-none dark:border-zinc-700">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            {stat.icon && (
                                <div className="mb-3 p-3 rounded-full bg-[#E4F2EF] dark:bg-teal-900/30">
                                    <stat.icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                                </div>
                            )}
                            <span className="text-4xl font-bold text-teal-900 dark:text-teal-300">{stat.value}</span>
                            <span className="text-xs text-teal-700 dark:text-teal-400">{stat.label}</span>

                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
