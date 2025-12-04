import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SubStat {
    label: string
    value: number | string
}

interface SummaryCardProps {
    title: string
    total: number | string
    icon: LucideIcon
    stats: SubStat[]
}

export function SummaryCard({ title, total, icon: Icon, stats }: SummaryCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl bg-green-50 dark:bg-zinc-900">
            <div className="flex items-center justify-between bg-teal-900/10 dark:bg-zinc-800/80 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-teal-800 dark:text-teal-400" />
                    <h3 className="text-lg font-bold text-teal-900 dark:text-teal-300">{title}</h3>
                </div>
                <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">{total}</div>
            </div>
            <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-sm rounded-2xl bg-white dark:bg-zinc-800 border-green-100 dark:border-zinc-700">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <span className="text-2xl font-bold text-teal-900 dark:text-teal-300">{stat.value}</span>
                            <span className="text-xs text-teal-700 dark:text-teal-400">{stat.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
