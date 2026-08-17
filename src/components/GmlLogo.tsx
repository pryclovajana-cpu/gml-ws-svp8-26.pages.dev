import React from 'react';

interface GmlLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const GmlLogo: React.FC<GmlLogoProps> = ({ className = '', size = 'lg' }) => {
  // Logo reduced by 30% for balanced proportions
  const heightMap = {
    sm: 'h-8 md:h-10',
    md: 'h-12 md:h-15',
    lg: 'h-16 md:h-20 lg:h-22',
  };

  return (
    <div className={`inline-flex items-start justify-start text-left select-none p-0 m-0 ${className}`}>
      {/* Tightly trimmed Official GML Logo Image flush left */}
      <img
        src="/images/gml_official_logo.png"
        alt="Gymnázium Matyáše Lercha"
        className={`${heightMap[size]} w-auto object-contain shrink-0 filter drop-shadow-2xs block p-0 m-0 mix-blend-multiply`}
      />
    </div>
  );
};
