"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

export function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
        if (!value) return
        navigator.clipboard.writeText(value)
        setCopied(true)
        toast.success("Copiado al portapapeles")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={handleCopy}
                        disabled={!value}
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{copied ? "Copiado!" : "Copiar"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
