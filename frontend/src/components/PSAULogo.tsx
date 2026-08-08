import React from 'react';

interface PSAULogoProps {
  size?: number;
}

const PSAULogo: React.FC<PSAULogoProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* === القوس الخارجي === */}
    <path
      d="M100 8 C52 8 18 48 18 96 L18 170 L34 170 L34 96 C34 56 64 24 100 24 C136 24 166 56 166 96 L166 170 L182 170 L182 96 C182 48 148 8 100 8Z"
      fill="white" fillOpacity="0.95"
    />
    {/* === القوس الثاني === */}
    <path
      d="M100 28 C62 28 38 62 38 96 L38 165 L52 165 L52 96 C52 70 74 44 100 44 C126 44 148 70 148 96 L148 165 L162 165 L162 96 C162 62 138 28 100 28Z"
      fill="white" fillOpacity="0.75"
    />
    {/* === القوس الثالث === */}
    <path
      d="M100 48 C72 48 58 72 58 96 L58 160 L72 160 L72 96 C72 80 85 64 100 64 C115 64 128 80 128 96 L128 160 L142 160 L142 96 C142 72 128 48 100 48Z"
      fill="white" fillOpacity="0.55"
    />
    {/* === القوس الداخلي === */}
    <path
      d="M100 68 C84 68 78 83 78 96 L78 155 L90 155 L90 96 C90 89 94 80 100 80 C106 80 110 89 110 96 L110 155 L122 155 L122 96 C122 83 116 68 100 68Z"
      fill="white" fillOpacity="0.35"
    />

    {/* === الخط الأفقي العلوي === */}
    <rect x="24" y="170" width="152" height="5" rx="2.5" fill="white" fillOpacity="0.95"/>


    {/* === الخط الأفقي السفلي === */}
    <rect x="32" y="197" width="136" height="3.5" rx="1.75" fill="white" fillOpacity="0.7"/>
    <rect x="44" y="203" width="112" height="2.5" rx="1.25" fill="white" fillOpacity="0.5"/>
  </svg>
);

export default PSAULogo;
