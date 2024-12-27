import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

import { ANIMATION_CONFIG, THEME_CONFIG } from './config';
import type { Point } from './types';
import { createPoints, getForceOnPoint } from './utils';

const DotBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let points: Point[] = [];

      p.setup = () => {
        p.createCanvas(width, height);
        p.noiseSeed(Date.now());
        points = createPoints(width, height);
      };

      p.draw = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const theme = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

        p.background(theme.background);

        const time = Date.now() / 10000;

        for (const point of points) {
          const { x, y, opacity } = point;
          const rad = getForceOnPoint(p, x, y, time);
          const length =
            (p.noise(
              x / ANIMATION_CONFIG.SCALE,
              y / ANIMATION_CONFIG.SCALE,
              time * 2,
            ) +
              0.5) *
            ANIMATION_CONFIG.LENGTH;
          const nx = x + p.cos(rad) * length;
          const ny = y + p.sin(rad) * length;

          p.stroke(
            ...theme.dotColor,
            (Math.abs(p.cos(rad)) * 0.5 + 0.5) * opacity * 255,
          );
          p.noFill();
          p.circle(nx, ny, 1);
        }
      };

      p.windowResized = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        p.resizeCanvas(width, height);
        points = createPoints(width, height);
      };
    };

    const p5Instance = new p5(sketch, containerRef.current);
    return () => p5Instance.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-300"
      aria-hidden="true"
    />
  );
};

export default DotBackground;
