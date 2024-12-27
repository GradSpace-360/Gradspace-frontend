import React from 'react';

interface EyesProps {
  animationState: 'straight' | 'right';
}

const Eyes: React.FC<EyesProps> = () => {
  const pupilOffset = 5; // Fixed offset for the right position

  return (
    <>
      <g className="eye-group left">
        <circle className="eye left-eye" cx="80" cy="100" r="15" fill="white" />
        <circle
          className="pupil left-pupil"
          cx={80 + pupilOffset}
          cy="100"
          r="7"
          fill="black"
        />
      </g>

      <g className="eye-group right">
        <circle
          className="eye right-eye"
          cx="160"
          cy="100"
          r="15"
          fill="white"
        />
        <circle
          className="pupil right-pupil"
          cx={160 + pupilOffset}
          cy="100"
          r="7"
          fill="black"
        />
      </g>
    </>
  );
};

export default Eyes;
