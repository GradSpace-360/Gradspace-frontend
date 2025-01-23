import { ANIMATION_CONFIG } from "./config"
import type { Point } from "./types"
// Simplex noise implementation
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0)
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0

function makeNoise2D() {
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i

    let n: number
    let q: number
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random())
        q = p[i]
        p[i] = p[n]
        p[n] = q
    }

    const perm = new Uint8Array(512)
    const permMod12 = new Uint8Array(512)
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255]
        permMod12[i] = perm[i] % 12
    }

    const grad3 = new Float32Array([
        1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1,
        0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
    ])

    return (xin: number, yin: number) => {
        const s = (xin + yin) * F2
        const i = Math.floor(xin + s)
        const j = Math.floor(yin + s)
        const t = (i + j) * G2
        const X0 = i - t
        const Y0 = j - t
        const x0 = xin - X0
        const y0 = yin - Y0

        const i1 = x0 > y0 ? 1 : 0
        const j1 = x0 > y0 ? 0 : 1

        const x1 = x0 - i1 + G2
        const y1 = y0 - j1 + G2
        const x2 = x0 - 1.0 + 2.0 * G2
        const y2 = y0 - 1.0 + 2.0 * G2

        const ii = i & 255
        const jj = j & 255

        const gi0 = permMod12[ii + perm[jj]] * 3
        const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3
        const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3

        const n0 = Math.max(0.5 - x0 * x0 - y0 * y0, 0)
        const n1 = Math.max(0.5 - x1 * x1 - y1 * y1, 0)
        const n2 = Math.max(0.5 - x2 * x2 - y2 * y2, 0)

        const t0 = n0 * n0 * n0 * n0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0)
        const t1 = n1 * n1 * n1 * n1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1)
        const t2 = n2 * n2 * n2 * n2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2)

        return 70.0 * (t0 + t1 + t2)
    }
}

export const noise2D = makeNoise2D()

export const getForceOnPoint = (x: number, y: number, z: number): number => {
    // Slower movement by reducing time impact
    const timeScale = z * 0.5
    // More natural paper-like movement by combining multiple noise frequencies
    const noise1 = noise2D(
        x / ANIMATION_CONFIG.SCALE,
        y / ANIMATION_CONFIG.SCALE + timeScale
    )
    const noise2 =
        noise2D(
            x / (ANIMATION_CONFIG.SCALE * 2),
            y / (ANIMATION_CONFIG.SCALE * 2) + timeScale
        ) * 0.5
    return (noise1 + noise2) * Math.PI
}

export const createPoints = (width: number, height: number): Point[] => {
    const points: Point[] = []
    const existingPoints = new Set<string>()

    for (
        let x = -ANIMATION_CONFIG.SPACING / 2;
        x < width + ANIMATION_CONFIG.SPACING;
        x += ANIMATION_CONFIG.SPACING
    ) {
        for (
            let y = -ANIMATION_CONFIG.SPACING / 2;
            y < height + ANIMATION_CONFIG.SPACING;
            y += ANIMATION_CONFIG.SPACING
        ) {
            const id = `${x}-${y}`
            if (existingPoints.has(id)) continue
            existingPoints.add(id)
            points.push({ x, y, opacity: Math.random() * 0.3 + 0.3 }) // Reduced opacity range for subtler effect
        }
    }

    return points
}
