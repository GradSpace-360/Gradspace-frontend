export interface Point {
  x: number;
  y: number;
  opacity: number;
}

export interface AnimationConfig {
  SCALE: number;
  LENGTH: number;
  SPACING: number;
}

export interface ThemeConfig {
  background: string;
  dotColor: [number, number, number];
}
