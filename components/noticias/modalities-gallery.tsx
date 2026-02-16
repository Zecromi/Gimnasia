"use client";
import React, { useMemo, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import CircularGallery from "@/src/component/CircularGallery";
import { MODALITIES_DATA, ModalityData } from "@/lib/constants/modalities";

const ModalityDialog = dynamic(() => import("./modality-dialog").then(mod => mod.ModalityDialog), {
    ssr: false,
});

export function ModalitiesGallery() {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = (theme === 'system' ? resolvedTheme : theme) || 'dark';

    const [selectedModality, setSelectedModality] = useState<ModalityData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Generamos las "imágenes" de color dinámicamente usando SVG
    const modalities = useMemo(() => {
        return MODALITIES_DATA.map((mod) => {
            const color = currentTheme === "dark" ? mod.color.dark : mod.color.light;
            const gradId = `cardGradient-${mod.id}`;
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
                    <defs>
                        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#${gradId})" />
                    <rect width="100%" height="100%" fill="none" stroke="white" stroke-opacity="0.1" stroke-width="2" />
                </svg>
            `;

            const utf8Bytes = new TextEncoder().encode(svg);
            const base64Svg = btoa(String.fromCharCode(...utf8Bytes));

            return {
                text: mod.title,
                image: `data:image/svg+xml;base64,${base64Svg}`,
            };
        });
    }, [currentTheme]);

    const handleItemClick = (item: any, index: number) => {
        const modality = MODALITIES_DATA[index];
        if (modality) {
            setSelectedModality(modality);
            setIsDialogOpen(true);
        }
    };

    return (
        <section className="py-10 space-y-2 overflow-hidden">
            <div className="text-center space-y-4 px-4">
                <h4 className="text-4xl font-black tracking-tighter uppercase italic text-primary">
                    Modalidades Deportivas
                </h4>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Explora las diferentes disciplinas que forman parte de nuestra federación.
                    Haz clic en una para conocer más detalles.
                </p>
            </div>

            <div className="relative h-[440px] w-full p-2">
                <CircularGallery
                    items={modalities}
                    bend={1.5}
                    textColor={currentTheme === 'dark' ? '#ffffff' : '#141414'}
                    borderRadius={0.08}
                    scrollEase={0.02}
                    scrollSpeed={2}
                    onItemClick={handleItemClick}
                />
            </div>

            <div className="flex justify-center flex-col items-center gap-2 pt-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                    Haz clic en una modalidad o arrastra para explorar
                </span>
                <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary animate-pulse" />
                </div>
            </div>

            <Suspense fallback={null}>
                <ModalityDialog
                    modality={selectedModality}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </Suspense>
        </section>
    );
}
