// src/components/ui/card.tsx
import React, { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('bg-white rounded-lg shadow-sm overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('px-4 py-2 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

export const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-4', className)} {...props}>
    {children}
  </div>
);
