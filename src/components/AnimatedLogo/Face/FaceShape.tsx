import React from 'react';

interface FaceShapeProps {
  facefill: boolean;
}

const FaceShape: React.FC<FaceShapeProps> = ({ facefill }) => {
  return (
    <>
      {/* Cap shadow */}
      <path
        className="cap-shadow"
        d="M171.19 55.05a47.86 47.86 0 00-40.16-42.54c-21.88-3.42-42.56 8.54-51.28 27.86-44.94-2.78-77.84 2.57-79.66 14.7"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="8"
        strokeLinecap="round"
        transform="translate(0, 8)"
      />

      {/* White top edge of cap */}
      <path
        className="cap-top-edge"
        d="M171.19 55.05a47.86 47.86 0 00-40.16-42.54c-21.88-3.42-42.56 8.54-51.28 27.86-44.94-2.78-77.84 2.57-79.66 14.7"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* White border cap */}
      <path
        className="face-border"
        d="M171.19 55.05a47.86 47.86 0 00-40.16-42.54c-21.88-3.42-42.56 8.54-51.28 27.86-44.94-2.78-77.84 2.57-79.66 14.7-1.7 10.41 19.92 23.2 53.83 33.62l.01.06C53.08 88.41 3.33 228.07 3.33 228.07h188.03s-11.45-119.66-13.16-119.66c35.39.51 60-4.96 61.72-15.39 1.78-11.88-26.62-26.82-68.73-37.97z"
        fill="none"
        stroke="white"
        strokeWidth="4"
      />

      {/* Main face fill */}
      {facefill && (
        <path
          className="face"
          d="M171.19 55.05a47.86 47.86 0 00-40.16-42.54c-21.88-3.42-42.56 8.54-51.28 27.86-44.94-2.78-77.84 2.57-79.66 14.7-1.7 10.41 19.92 23.2 53.83 33.62l.01.06C53.08 88.41 3.33 228.07 3.33 228.07h188.03s-11.45-119.66-13.16-119.66c35.39.51 60-4.96 61.72-15.39 1.78-11.88-26.62-26.82-68.73-37.97z"
          fill="url(#gradient)"
        />
      )}
      {/* <path
        className="edge-pattern"
        d="M3.33 228.07 
           C30 225 50 228 70 225
           S90 222 110 225 
           S130 228 150 225
           S170 222 190 225
           S210 228 240 225"
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth="3"
      /> */}

      {/* Additional decorative gutter lines */}
      <path
        className="gutter-detail"
        d="M3.33 223.07 
           C30 220 50 223 70 220
           S90 217 110 220 
           S130 223 150 220
           S170 217 190 220
           S210 223 240 220"
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth="1.5"
        opacity="0.1"
      />
    </>
  );
};

export default FaceShape;
