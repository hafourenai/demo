import React from 'react';

interface ServiceImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}

const categoryColors: Record<string, string> = {
  'Home Service': '#B4576B',
  'Beauty Service': '#D4889A',
  'Cleaning': '#8B7355',
  'Beauty': '#C9A875',
  default: '#A68B5B',
};

export const ServiceImage: React.FC<ServiceImageProps> = ({
  src,
  alt,
  category = 'default',
  className = 'w-full h-48 object-cover',
}) => {
  const [imageError, setImageError] = React.useState(false);
  const bgColor = categoryColors[category] || categoryColors.default;

  if (!src || imageError) {
    return (
      <div
        className={className}
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xs font-semibold line-clamp-2 px-2">
              {alt}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};
