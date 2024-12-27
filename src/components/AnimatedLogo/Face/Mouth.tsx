import React from 'react';

interface MouthProps {
  expression: 'neutral' | 'smile' | 'open';
}

const Mouth: React.FC<MouthProps> = ({ expression }) => {
  const paths = {
    neutral: 'M95 140 Q120 140 145 140',
    smile: 'M95 140 Q120 160 145 140',
    open: 'M95 140 Q120 170 145 140',
  };

  return (
    <path
      className="mouth"
      d={paths[expression]}
      fill={expression === 'open' ? 'white' : 'none'}
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
  );
};

export default Mouth;
