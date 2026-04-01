"use client";

import React from "react";
import { Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function PrivacyNotice() {
    return (
        <div className="container px-4 mx-auto mt-16 text-center">
            <Separator className="mb-8" />
            <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-muted-foreground font-medium">
                    © {new Date().getFullYear()} GUEM Todos los derechos reservados
                </p>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Aviso de privacidad
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] h-[90vh] flex flex-col p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-2 shrink-0">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Aviso de Privacidad
                            </DialogTitle>
                            <DialogDescription>
                                Gimnasios Unidos del Estado de México
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full flex-1">
                            <iframe
                                src="/GUEM%20AVISO%20DE%20PRIVACIDAD%202025.pdf"
                                className="w-full h-full border-0"
                                title="Aviso de Privacidad GUEM"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
