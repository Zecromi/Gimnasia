"use client"

import { useEffect, useState } from "react"

interface CountUpProps {
    end: number
    duration?: number
    className?: string
}

export function CountUp({ end, duration = 2000, className }: CountUpProps) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number | null = null
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percentage = Math.min(progress / duration, 1)

            // Easing function (easeOutExpo)
            const easeOutExpo = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
            }

            setCount(Math.floor(easeOutExpo(percentage) * end))

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return <span className={className}>{count}</span>
}
