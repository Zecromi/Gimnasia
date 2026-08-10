"use client";

import React, { Suspense } from "react";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

const PrivacyNotice = dynamic(() => import("./privacy-notice").then(mod => mod.PrivacyNotice), {
    ssr: false,
});

export function NoticiasFooter() {
    return (
        <footer className="mt-20 pb-10 border-t bg-gray-100 dark:bg-zinc-900 pt-16">
            <div className="container px-4 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-center lg:text-left">
                {/* About column */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h4 className="flex flex-col text-2xl font-black italic tracking-tighter text-primary">
                        GUEM
                        <span className="text-sm font-medium not-italic text-foreground mt-1">Gimnasios Unidos del Estado de México</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                        Asociación comprometida con la excelencia y el desarrollo de nuestros atletas en el ámbito gimnástico.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/guem.edomex?igsh=cXI1MXRyM2Y4MGNo&utm_source=qr" target="_blank" rel="noreferrer" title="Instagram" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted">
                            <Instagram className="h-4 w-4" />
                        </a>
                    </div>
                </div>


                {/* Contact Info */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h5 className="font-bold text-lg tracking-wider font-serif italic font-bold text-teal-600 dark:text-teal-400 ">Contáctanos</h5>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex flex-col items-center lg:items-start gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <p className="font-bold text-foreground">Dirección</p>
                            </div>
                            <div className="space-y-1 text-center lg:text-left">
                                <p>Calle 2 de Marzo, Mz 34 Lt 38. Col. Jacalones I.</p>
                                <p>San Miguel, Chalco, Estado de México. CP 56604.</p>
                                <p className="text-xs italic text-muted-foreground pt-1">Entre Calle Iztaccihuatl y Calle 5 de Mayo</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <a href="tel:+525568780440" className="hover:text-primary transition-colors">Teléfono: +52 55 6878 0440</a>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <a href="mailto:guemasociacion@gmail.com" className="hover:text-primary transition-colors">E-mail: guemasociacion@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container px-4 mx-auto mt-16 text-center">

                <Suspense fallback={<div className="h-20" />}>
                    <PrivacyNotice />
                </Suspense>

            </div>
        </footer>
    );
}
