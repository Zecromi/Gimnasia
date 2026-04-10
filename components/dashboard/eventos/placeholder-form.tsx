"use client"

import * as React from "react"
import { Upload, Image } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PlaceholderForm({ title, icon: Icon = Image }: { title: string, icon?: any }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Icon className="mr-2 h-5 w-5" />
                {title}
            </h3>
            <div className="flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center shadow-inner">
                    <Icon className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold">{title} del Evento</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Sección para administrar {title.toLowerCase()}.
                    </p>
                </div>
                <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir {title}
                </Button>
            </div>
        </div>
    )
}
