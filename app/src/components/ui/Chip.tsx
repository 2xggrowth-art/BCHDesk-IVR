// ============================================================
// BCH CRM - Chip Component (Zero-Typing UI Core)
// ============================================================

import type { ChipOption } from '@/types';

interface ChipGroupProps {
  label: string;
  options: ChipOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  columns?: 2 | 3 | 4;
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple = false,
  size = 'md',
  columns = 3,
}: ChipGroupProps) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
      onChange(newValue);
    } else {
      onChange(selected.includes(optionValue) ? '' : optionValue);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3.5 text-base',
  };

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className={`grid ${gridClasses[columns]} gap-2`}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                ${sizeClasses[size]}
                rounded-xl font-medium text-center transition-all duration-150
                active:scale-[0.96]
                ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-md ring-2 ring-primary-300'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Single inline chip (for display)
interface ChipBadgeProps {
  label: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple';
  size?: 'xs' | 'sm';
}

export function ChipBadge({ label, color = 'blue', size = 'xs' }: ChipBadgeProps) {
  const colorClasses = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-500',
    orange: 'bg-warning-50 text-warning-500',
    red: 'bg-danger-50 text-danger-500',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses[color]} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}
