// src/components/ui/label.tsx
import React, { LabelHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label: FC<LabelProps> = ({ className, children, ...props }) => {
  return (
    <label
      className={clsx('block text-sm font-medium text-gray-700 mb-1', className)}
      {...props}
    >
      {children}
    </label>
  );
};
