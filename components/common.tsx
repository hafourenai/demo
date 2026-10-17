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
  <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-base ${
          item.active
            ? 'text-primary font-semibold'
            : 'text-text-muted hover:text-text-secondary'
        }`}
        aria-current={item.active ? 'page' : undefined}
        aria-label={item.label}
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
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
    className={`${large ? 'card-lg' : 'card'} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-base' : ''}`}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
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
      <div key={i} className={`skeleton ${width} ${height} rounded-md mb-3`} />
    ))}
  </>
);

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt, fallback = 'bg-bg-alt', ...props }) => (
  <img src={src} alt={alt} className={`object-cover ${fallback}`} {...props} />
);

/* New Components */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, href }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-text-primary font-serif">{title}</h3>
      {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
    </div>
    {href && (
      <a href={href} className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors duration-base whitespace-nowrap ml-3">
        Lihat Semua
      </a>
    )}
  </div>
);

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onClick, icon, removable = false, onRemove }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-base whitespace-nowrap ${
      selected
        ? 'bg-primary text-white'
        : 'bg-bg-alt text-text-primary hover:bg-border-primary'
    }`}
    aria-pressed={selected}
    style={{ minHeight: '44px' }}
  >
    {icon && <span className="w-4 h-4">{icon}</span>}
    <span>{label}</span>
    {removable && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="ml-1 hover:opacity-70"
        aria-label={`Remove ${label}`}
      >
        ×
      </button>
    )}
  </button>
);

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusConfig = {
    active: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    inactive: { bg: 'bg-border-primary', text: 'text-text-muted', dot: 'bg-text-muted' },
    pending: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
    completed: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    cancelled: { bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
  };

  const config = statusConfig[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {displayLabel}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {icon && <div className="w-16 h-16 mb-4 text-text-muted">{icon}</div>}
    <h3 className="text-lg font-semibold text-text-primary font-serif">{title}</h3>
    {description && <p className="text-sm text-text-secondary mt-2 max-w-sm">{description}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="btn-primary mt-4"
      >
        {action.label}
      </button>
    )}
  </div>
);

interface FormGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, error, required, children, hint }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-text-primary mb-2">
      {label}
      {required && <span className="text-danger ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
);
