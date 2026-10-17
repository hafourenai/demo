import React from 'react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mobile-frame">
    <div className="mobile-content">{children}</div>
  </div>
);

interface BottomNavProps {
  items: { icon: React.ReactNode; label: string; href: string; active: boolean }[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => (
  <nav className="bottom-nav">
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className={`flex flex-col items-center justify-center w-full h-full transition ${
          item.active
            ? 'text-primary font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="w-6 h-6">{item.icon}</div>
        <span className="text-xs mt-1">{item.label}</span>
      </a>
    ))}
  </nav>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', large = false, onClick }) => (
  <div
    onClick={onClick}
    className={`${large ? 'card-lg' : 'card'} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}`}
  >
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const sizeClass = size === 'sm' ? 'btn-small' : size === 'lg' ? 'py-4 px-8' : 'py-3 px-6';
  return (
    <button className={`${baseClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const variantClass = `badge-${variant}`;
  return <span className={`badge ${variantClass}`}>{children}</span>;
};

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  count = 1,
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`skeleton ${width} ${height} rounded mb-3`} />
    ))}
  </>
);

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt, fallback = 'bg-gray-200', ...props }) => (
  <img src={src} alt={alt} className={`object-cover ${fallback}`} {...props} />
);
