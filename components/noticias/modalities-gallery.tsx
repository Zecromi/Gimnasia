"use client";
import React, { useMemo, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import CircularGallery from "@/src/component/CircularGallery";
import { MODALITIES_DATA, ModalityData } from "@/lib/constants/modalities";
import { Medal } from "lucide-react";
const ModalityDialog = dynamic(() => import("./modality-dialog").then(mod => mod.ModalityDialog), {
    ssr: false,
});

export function ModalitiesGallery() {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = (theme === 'system' ? resolvedTheme : theme) || 'dark';

    const [selectedModality, setSelectedModality] = useState<ModalityData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Mapeo de imágenes para cada modalidad
    const imagePaths: Record<string, string> = {
        "acrobatica": "/gm_acrobatica.png",
        "aerobica": "/gm_aerobica.png",
        "artistica-femenil": "/gm_artistica_femenil.png",
        "artistica-varonil": "/gm_artistica_varonil.png",
        "trampolin": "/gm_trampolin.png",
        "ritmica": "/gm_ritmica.png",
        "para-todos": "/gm_para_todos.png",
        "parkour": "/gm_parkour.png"
    };

    // Generamos las modalidades con imágenes directas y color de fondo
    const modalities = useMemo(() => {
        return MODALITIES_DATA.map((mod) => {
            const color = currentTheme === "dark" ? mod.color.dark : mod.color.light;
            const imgPath = imagePaths[mod.id] || "";

            return {
                text: mod.title,
                image: imgPath,
                bgColor: color
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
                <h4 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl 2xl:text-6xl text-3xl font-black tracking-tight font-bold  italic text-primary flex items-center justify-center gap-2">
                    <Medal className="text-primary w-9 h-9 text-teal-700 dark:text-gray-100-900" />Modalidades <span className="font-serif italic font-semibold text-teal-600 dark:text-teal-400">Deportivas</span>
                </h4>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-semibold">
                    Explora las diferentes disciplinas que forman parte de nuestra asociación.
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
