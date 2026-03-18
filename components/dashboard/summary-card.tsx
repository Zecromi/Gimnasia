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
        <div className="space-y-3 py-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
                </div>
                <div className="text-3xl font-black text-foreground drop-shadow-sm">{total}</div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="flex flex-row overflow-hidden border-none bg-primary/5 hover:bg-primary/10 transition-colors shadow-none cursor-pointer group h-full min-h-[130px]"
                    >
                        {/* Value Column */}
                        <div className="flex flex-col items-center justify-center min-w-[7.5rem] px-4 text-center shrink-0 bg-gradient-to-br from-teal-400 via-emerald-400 to-cyan-400 dark:from-teal-900 dark:via-emerald-900 dark:to-cyan-900 text-teal-950 dark:text-white">
                            <div className="text-5xl font-black tracking-tighter drop-shadow-sm [&_*]:bg-transparent [&_*]:text-current [&_*]:text-5xl [&_*]:p-0 [&_*]:shadow-none [&_*]:border-none [&_*]:rounded-none">
                                {stat.value}
                            </div>
                        </div>

                        {/* Info Column with Icon and Label */}
                        <CardContent className="flex flex-col justify-center p-5 sm:p-6 flex-1 overflow-hidden">
                            <div className="flex items-center gap-3.5 text-foreground/90 group-hover:text-primary transition-colors">
                                {stat.icon && <stat.icon className="h-8 w-8 shrink-0 text-primary/80 group-hover:text-primary transition-colors" />}
                                <h4 className="font-semibold text-lg sm:text-lg leading-snug line-clamp-2">
                                    {stat.label}
                                </h4>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
