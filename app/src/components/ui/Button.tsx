// ============================================================
// BCH CRM - Button Components (Large Touch Targets)
// ============================================================

import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md',
    success: 'bg-success-500 text-white hover:bg-success-600 shadow-md',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 shadow-md',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-md',
    outline: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:text-primary-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs gap-1.5',
    md: 'px-4 py-3 text-sm gap-2',
    lg: 'px-6 py-4 text-base gap-2',
    xl: 'px-8 py-5 text-lg gap-3', // Extra large for store staff
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// One-tap action buttons (Call, WhatsApp, Follow-up)
interface ActionButtonProps {
  label: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red';
  onClick: () => void;
}

export function ActionButton({ label, icon, color, onClick }: ActionButtonProps) {
  const colorClasses = {
    blue: 'bg-primary-500 hover:bg-primary-600',
    green: 'bg-success-500 hover:bg-success-600',
    orange: 'bg-warning-500 hover:bg-warning-600',
    red: 'bg-danger-500 hover:bg-danger-600',
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex flex-col items-center justify-center
        ${colorClasses[color]} text-white
        rounded-xl py-3 px-2
        transition-all duration-150 active:scale-[0.95]
        shadow-md min-h-[60px]
      `}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
