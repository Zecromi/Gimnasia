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
    italic: string
}

export function SummaryCard({ title, italic, total, icon: Icon, stats }: SummaryCardProps) {
    return (
        <div className="space-y-1 py-2 mb-0 pb-0">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5  bg-[#ebf3e6] dark:bg-emerald-950/40 rounded-xl">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{title} <span className="font-serif italic font-semibold text-teal-600 dark:text-teal-400 ">{italic}</span></h3>
                </div>
                <div className="text-3xl font-black text-foreground drop-shadow-sm">{total}</div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="shadow-none flex flex-col justify-between p-6 bg-[#fafcf9] dark:bg-zinc-900/40 border border-[#e3ebd7] dark:border-emerald-950 rounded-[32px] hover:border-emerald-500/30 hover:shadow-md transition-all duration-300 cursor-pointer group min-h-[175px]"
                    >
                        {/* Top Row: Icon on the left, Large Metric Value on the right */}
                        <div className="flex items-start justify-between w-full">
                            <div className="p-2.5 bg-[#ebf3e6] dark:bg-emerald-950/40 rounded-2xl text-[#325227] dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                                {stat.icon && <stat.icon className="h-8 w-8" />}
                            </div>

                            {/* Large Metric Value in Serif Italic font */}
                            <div className="px-2 text-5xl md:text-6xl font-serif italic font-extrabold text-[#1b3a16] dark:text-emerald-300 tracking-tight leading-none drop-shadow-sm select-none pr-3 mr-4 [&_*]:bg-transparent [&_*]:text-current [&_*]:text-5xl md:[&_*]:text-6xl  [&_*]:shadow-none [&_*]:border-none [&_*]:rounded-none">
                                {stat.value}
                            </div>
                        </div>

                        {/* Bottom Row: Text Label */}
                        <div className="mt-2">
                            <h3 className="font-semibold text-md md:text-lg tracking-tight text-[#2d3a2a] dark:text-zinc-200 group-hover:text-[#325227] dark:group-hover:text-emerald-400 transition-colors leading-snug ">
                                {stat.label}
                            </h3>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
