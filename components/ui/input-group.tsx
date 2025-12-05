import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string
    htmlFor?: string
    children: React.ReactNode
}

export function InputGroup({
    label,
    htmlFor,
    children,
    className,
    ...props
}: InputGroupProps) {
    return (
        <div className={cn("space-y-1.5", className)} {...props}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
        </div>
    )
}
