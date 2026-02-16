"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

interface LazySectionProps {
    children: ReactNode;
    fallback?: ReactNode;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

/**
 * LazySection component that uses Intersection Observer to defer rendering its children
 * until they are about to enter the viewport.
 */
export function LazySection({
    children,
    fallback = null,
    threshold = 0.1,
    rootMargin = "200px",
    className = "",
}: LazySectionProps) {
    const [isIntersecting, setIntersecting] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    // Once visible, we can stop observing
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin]);

    return (
        <div ref={sectionRef} className={className}>
            {isIntersecting ? children : fallback}
        </div>
    );
}
