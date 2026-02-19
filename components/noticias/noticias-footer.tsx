"use client";

import React from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function NoticiasFooter() {
    return (
        <footer className="mt-20 pb-10 border-t bg-muted/30 pt-16">
            <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* About column */}
                <div className="space-y-4 col-span-1 md:col-span-1">
                    <h4 className="text-xl font-black italic tracking-tighter text-primary">
                        GIMNASIA<span className="text-foreground">DASHBOARD</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Plataforma integral para la gestión y difusión del deporte gimnástico nacional. Comprometidos con la excelencia y el desarrollo de nuestros atletas.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                            <Instagram className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                            <Twitter className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h5 className="font-bold">Navegación</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="hover:text-primary transition-colors cursor-pointer">Directorio de Clubes</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Calendario de Eventos</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Reglamentos</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Directorio de Jueces</li>
                    </ul>
                </div>

                {/* Assistance */}
                <div className="space-y-4">
                    <h5 className="font-bold">Soporte</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="hover:text-primary transition-colors cursor-pointer">Preguntas Frecuentes</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Ayuda Técnica</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Contacto</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Términos y condiciones</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h5 className="font-bold">Contacto</h5>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <span>Av. de los Deportes #123, Ciudad de México, CP 06700</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <span>+52 (55) 1234-5678</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <span>contacto@federaciongimnasia.mx</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 mx-auto mt-16 text-center">
                <Separator className="mb-8" />
                <p className="text-xs text-muted-foreground font-medium">
                    © {new Date().getFullYear()} Gimnasia Dashboard. Todos los derechos reservados. Diseñado para el alto rendimiento.
                </p>
            </div>
        </footer>
    );
}
