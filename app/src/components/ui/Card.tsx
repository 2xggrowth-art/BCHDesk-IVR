// ============================================================
// BCH CRM - Card Components
// ============================================================

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  borderColor?: string;
}

export function Card({ children, className = '', onClick, borderColor }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${borderColor ? `border-l-4 ${borderColor}` : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Stat card for dashboard metrics
interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  icon?: string;
}

export function StatCard({ label, value, subValue, color = 'blue', icon }: StatCardProps) {
  const colorClasses = {
    blue: 'text-primary-500',
    green: 'text-success-500',
    orange: 'text-warning-500',
    red: 'text-danger-500',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      {icon && <span className="text-lg">{icon}</span>}
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{label}</div>
      {subValue && <div className="text-xs text-gray-400 mt-0.5">{subValue}</div>}
    </div>
  );
}

// Alert/banner card
interface AlertCardProps {
  children: ReactNode;
  variant: 'danger' | 'warning' | 'success' | 'info';
  className?: string;
}

export function AlertCard({ children, variant, className = '' }: AlertCardProps) {
  const variantClasses = {
    danger: 'bg-danger-50 border-danger-200 text-danger-600',
    warning: 'bg-warning-50 border-warning-400 text-warning-600',
    success: 'bg-success-50 border-success-400 text-success-600',
    info: 'bg-primary-50 border-primary-200 text-primary-600',
  };

  return (
    <div className={`rounded-xl border p-3 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
