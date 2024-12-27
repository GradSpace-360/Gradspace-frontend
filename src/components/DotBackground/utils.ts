import p5 from 'p5';

import { ANIMATION_CONFIG } from './config';
import type { Point } from './types';

export const getForceOnPoint = (
  p: p5,
  x: number,
  y: number,
  z: number,
): number => {
  return (
    (p.noise(x / ANIMATION_CONFIG.SCALE, y / ANIMATION_CONFIG.SCALE, z) - 0.5) *
    2 *
    p.TWO_PI
  );
};

export const createPoints = (width: number, height: number): Point[] => {
  const points: Point[] = [];
  const existingPoints = new Set<string>();

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
      const id = `${x}-${y}`;
      if (existingPoints.has(id)) continue;
      existingPoints.add(id);
      points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
    }
  }

  return points;
};
