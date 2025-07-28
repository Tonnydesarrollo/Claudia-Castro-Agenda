// src/components/ui/input.tsx
import React, { InputHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400',
        className
      )}
      {...props}
    />
  );
};
