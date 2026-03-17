"use client";

import React, { Suspense } from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Youtube } from "lucide-react";
import dynamic from "next/dynamic";

const PrivacyNotice = dynamic(() => import("./privacy-notice").then(mod => mod.PrivacyNotice), {
    ssr: false,
});

export function NoticiasFooter() {
    return (
        <footer className="mt-20 pb-10 border-t bg-gray-100 dark:bg-zinc-900 pt-16">
            <div className="container px-4 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
                {/* About column */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h4 className="text-2xl font-black italic tracking-tighter text-primary">
                        GUEM<span className="text-foreground"></span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                        Plataforma integral para la gestión y difusión del deporte gimnástico nacional. Comprometidos con la excelencia y el desarrollo de nuestros atletas.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted">
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted">
                            <Instagram className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted">
                            <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted">
                            <Youtube className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h5 className="font-bold text-lg uppercase tracking-wider">Consejo Directivo</h5>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="hover:text-primary transition-colors cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            Comité ejecutivo
                        </li>
                        <li className="hover:text-primary transition-colors cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            Comité técnico superior
                        </li>
                        <li className="hover:text-primary transition-colors cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            Asociaciones y clubes
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h5 className="font-bold text-lg uppercase tracking-wider">CONTÁCTANOS</h5>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex flex-col items-center lg:items-start gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <p className="font-bold text-foreground">FEDERACIÓN MEXICANA DE GIMNASIA AC</p>
                            </div>
                            <div className="space-y-1">
                                <p>Calle Tenayuca # 55 Oficina 403. Col. Letrán Valle.</p>
                                <p>Alcaldía Benito Juárez, Ciudad de México. CP. 03650.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <span>Teléfono: 55-8984-7848</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <span>E-mail : info@fmgimnasia.org.mx</span>
                        </div>
                    </div>
                </div>
            </div>

            <Suspense fallback={<div className="h-20" />}>
                <PrivacyNotice />
            </Suspense>
        </footer>
    );
}
