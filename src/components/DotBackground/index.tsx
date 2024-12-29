import React, { useEffect, useRef } from "react"

import { ANIMATION_CONFIG, THEME_CONFIG } from "./config"
import type { Point } from "./types"
import { createPoints, getForceOnPoint } from "./utils"

const DotBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number>()
    const pointsRef = useRef<Point[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            // Set canvas size with device pixel ratio for sharper rendering
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.scale(dpr, dpr)
            pointsRef.current = createPoints(
                window.innerWidth,
                window.innerHeight
            )
        }

        const render = () => {
            const isDark = document.documentElement.classList.contains("dark")
            const theme = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light

            ctx.fillStyle = theme.background
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const time = Date.now() / 10000

            for (const point of pointsRef.current) {
                const { x, y, opacity } = point
                const rad = getForceOnPoint(x, y, time)
                const length =
                    (Math.sin(
                        time * 2 +
                            x / ANIMATION_CONFIG.SCALE +
                            y / ANIMATION_CONFIG.SCALE
                    ) *
                        0.5 +
                        0.5) *
                    ANIMATION_CONFIG.LENGTH
                const nx = x + Math.cos(rad) * length
                const ny = y + Math.sin(rad) * length

                ctx.beginPath()
                ctx.arc(nx, ny, 1.5, 0, Math.PI * 2) // Increased dot size
                ctx.fillStyle = theme.dotColor
                    .replace("rgb", "rgba")
                    .replace(")", `, ${opacity})`) // Simplified opacity
                ctx.fill()
            }

            animationFrameRef.current = requestAnimationFrame(render)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        render()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-300"
            aria-hidden="true"
        />
    )
}

export default DotBackground
