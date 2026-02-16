import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CarouselSkeleton() {
    return (
        <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden relative bg-muted animate-pulse">
            <div className="absolute bottom-10 left-10 space-y-4 w-2/3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </div>
        </div>
    );
}

export function GallerySkeleton() {
    return (
        <div className="space-y-8 py-10">
            <div className="text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />
                ))}
            </div>
        </div>
    );
}

export function NewsGridSkeleton() {
    return (
        <div className="space-y-8 py-10">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="aspect-square rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function EventsSkeleton() {
    return (
        <div className="space-y-8 py-10">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export function SitesSkeleton() {
    return (
        <div className="space-y-8 py-10">
            <Skeleton className="h-10 w-64 mx-auto" />
            <div className="flex flex-wrap justify-center gap-10">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-40 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
