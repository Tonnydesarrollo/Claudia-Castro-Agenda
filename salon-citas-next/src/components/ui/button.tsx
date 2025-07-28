import React, { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
};

export const Button: FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition';
  const variantStyles = {
    default:    'bg-pink-600 text-white hover:bg-pink-700',
    secondary:  'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ghost:      'bg-transparent text-gray-700 hover:bg-gray-100',
    outline:    'bg-transparent border border-pink-600 text-pink-600 hover:bg-pink-50',
    destructive:'bg-red-600 text-white hover:bg-red-700'
  } as const;
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  } as const;

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
