"use client";

import React from "react";
import { ExternalLink, Info, ShieldCheck, Trophy, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const sites = [
    {
        title: "Federación Internacional de Gimnasia (FIG)",
        url: "https://www.gymnastics.sport",
        icon: Globe,
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        title: "Comité Olímpico Nacional",
        url: "#",
        icon: Trophy,
        color: "bg-amber-500/10 text-amber-500",
    },
    {
        title: "Reglamento Técnico General",
        url: "#",
        icon: ShieldCheck,
        color: "bg-emerald-500/10 text-emerald-500",
    },
    {
        title: "Manual de Jueces y Puntajes",
        url: "#",
        icon: Info,
        color: "bg-purple-500/10 text-purple-500",
    },
];

export function SitesOfInterest() {
    return (
        <section className="py-12 space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Sitios de Interés</h3>
                <p className="text-muted-foreground">Enlaces externos y recursos útiles para la comunidad gimnástica.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sites.map((site) => (
                    <a
                        key={site.title}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                    >
                        <Card className="h-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className={`p-3 rounded-xl ${site.color} group-hover:scale-110 transition-transform`}>
                                    <site.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-sm font-bold leading-tight flex items-center gap-1">
                                        {site.title}
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </CardTitle>
                                </div>
                            </CardHeader>
                        </Card>
                    </a>
                ))}
            </div>
        </section>
    );
}
