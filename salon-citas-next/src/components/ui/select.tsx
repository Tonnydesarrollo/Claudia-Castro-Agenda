// src/components/ui/select.tsx
import React, { FC } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';

export const Select = SelectPrimitive.Root;
export const SelectTrigger: FC<SelectPrimitive.SelectTriggerProps> = ({ className, children, ...props }) => (
  <SelectPrimitive.Trigger
    className={clsx(
      'w-full rounded border border-gray-300 px-3 py-2 text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-400',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
);
export const SelectValue = SelectPrimitive.Value;
export const SelectContent: FC<SelectPrimitive.SelectContentProps> = ({ className, children, ...props }) => (
  <SelectPrimitive.Content
    className={clsx('bg-white rounded shadow-md', className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Content>
);
export const SelectItem: FC<SelectPrimitive.SelectItemProps> = ({ className, children, ...props }) => (
  <SelectPrimitive.Item
    className={clsx(
      'px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-pink-50 focus:bg-pink-100',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Item>
);
