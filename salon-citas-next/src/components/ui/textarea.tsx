// src/components/ui/textarea.tsx
import React, { TextareaHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={clsx(
        'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400',
        className
      )}
      {...props}
    />
  );
};
