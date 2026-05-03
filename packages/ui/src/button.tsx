'use client';

import { forwardRef } from 'react';
import { cn } from './lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm',
  secondary: 'bg-warm-100 text-warm-700 hover:bg-warm-200 active:bg-warm-300',
  outline: 'border border-warm-200 bg-white text-warm-700 hover:bg-warm-50 active:bg-warm-100',
  ghost: 'text-warm-600 hover:bg-warm-100 active:bg-warm-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-full',
  md: 'px-4 py-2 text-sm rounded-full',
  lg: 'px-6 py-3 text-base rounded-full',
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
