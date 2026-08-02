import React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StatusIndicator {
    id?: string | number;
    color?: string; // Clase de color para el fondo o icono (ej. bg-emerald-500, bg-indigo-100)
    icon: LucideIcon;
    text?: string;
}

interface StatusLegendProps {
    items: StatusIndicator[];
    className?: string;
    activeId?: string | number;
    onItemClick?: (item: StatusIndicator) => void;
}

export function StatusLegend({ items, className, activeId, onItemClick }: StatusLegendProps) {
    const isInteractive = onItemClick !== undefined;

    return (
        <div className={cn(
            "inline-flex items-center gap-2 p-1.5 bg-[#f3f4f6] dark:bg-zinc-800/80 rounded-[24px] shadow-inner mt-1",
            className
        )}>
            {items.map((item, index) => {
                const Icon = item.icon;
                // Si se usa como leyenda estática (sin activeId), consideramos todos como "activos" para mostrar su color.
                // Si es interactivo, solo el activeId seleccionado se muestra destacado.
                const isActive = activeId !== undefined ? item.id === activeId : true;
                
                const bgClass = isActive 
                    ? (item.color || "bg-indigo-200 dark:bg-indigo-900/50 shadow-sm") 
                    : "bg-transparent hover:bg-gray-200/50 dark:hover:bg-white/5";

                const textIconColor = isActive
                    ? "text-gray-600 dark:text-white"
                    : "text-gray-500 dark:text-gray-400";

                return (
                    <div 
                        key={item.id ?? index}
                        onClick={() => onItemClick?.(item)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 min-w-[70px] px-3 py-2 rounded-[18px] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm hover:brightness-105",
                            isInteractive ? "cursor-pointer active:scale-95" : "cursor-default",
                            bgClass
                        )}
                    >
                        <Icon className={cn("w-6 h-6 mb-0.5", textIconColor)} />
                        {item.text && (
                            <span className={cn(
                                "text-[10px] font-bold  tracking-wider text-center",
                                textIconColor
                            )}>
                                {item.text}
                            </span>
                        )}
                    </div>
                )
            })}
        </div>
    );
}
