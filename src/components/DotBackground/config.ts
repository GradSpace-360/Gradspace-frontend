import { AnimationConfig, ThemeConfig } from "./types"

export const ANIMATION_CONFIG: AnimationConfig = {
    SCALE: 200,
    LENGTH: 10,
    SPACING: 15,
}

export const THEME_CONFIG: Record<"light" | "dark", ThemeConfig> = {
    light: {
        background: "#ffffff",
        dotColor: [130, 130, 130],
    },
    dark: {
        background: "#09090d",
        dotColor: [70, 70, 70],
    },
} as const
