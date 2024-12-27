import './AnimatedLogo.css';

import { useEffect, useState } from 'react';

import Eyes from './Face/Eyes';
import FaceShape from './Face/FaceShape';
import Mouth from './Face/Mouth';
const AnimatedLogo = ({ facefill }: { facefill: boolean }) => {
  const [animationState, setAnimationState] = useState<{
    eyes: 'straight' | 'right';
    mouth: 'neutral' | 'smile' | 'open';
  }>({
    eyes: 'straight',
    mouth: 'neutral',
  });

  useEffect(() => {
    const animationSequence = async () => {
      while (true) {
        // Look right
        setAnimationState({ eyes: 'right', mouth: 'neutral' });
        await new Promise((r) => setTimeout(r, 2000));

        // Smile with open mouth
        setAnimationState({ eyes: 'right', mouth: 'open' });
        await new Promise((r) => setTimeout(r, 1000));

        // Close mouth but keep smiling
        setAnimationState({ eyes: 'right', mouth: 'smile' });
        await new Promise((r) => setTimeout(r, 1000));

        // Return to neutral
        setAnimationState({ eyes: 'straight', mouth: 'neutral' });
        await new Promise((r) => setTimeout(r, 3000));
      }
    };

    animationSequence();
  }, []);

  return (
    <div className="logo-container">
      <div className="logo-wrapper">
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          className="animated-logo"
        >
          <FaceShape facefill={facefill} />
          <Eyes animationState={animationState.eyes} />
          <Mouth expression={animationState.mouth} />

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7a73d9" />
              <stop offset="100%" stopColor="#5e57c9" />
            </linearGradient>

            <linearGradient
              id="edge-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6a63c9" />
              <stop offset="50%" stopColor="#8a83e9" />
              <stop offset="100%" stopColor="#6a63c9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
