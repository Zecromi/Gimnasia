"use client"

import * as React from "react"
import { Database, CircleFadingArrowUp } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { ViewClubGral } from "@/lib/club-service"

export function ModalidadesForm({ id, club }: { id: string, club: ViewClubGral }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Database className="mr-2 h-5 w-5" />
                Modalidades del Club
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[
                    "Gimnasia artística femenil",
                    "Gimnasia artística varonil",
                    "Gimnasia de trampolín",
                    "Gimnasia acrobática",
                    "Gimnasia para todos",
                    "Gimnasia rítmica",
                    "Gimnasia aeróbica deportiva",
                    "Parkour",
                    "Congreso FMG",
                    "Gimnasia de baile"
                ].map((modalidad, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox id={`modalidad-${index}`} name="modalidades[]" value={modalidad} />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={`modalidad-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {modalidad}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Habilitar para este club
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex justify-end">
                    <Button type="submit" className="w-[100px]">
                        <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    )
}
