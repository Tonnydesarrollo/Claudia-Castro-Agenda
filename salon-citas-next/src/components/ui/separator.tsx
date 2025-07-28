// src/components/ui/separator.tsx
import React, { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';

export const Separator: FC<HTMLAttributes<HTMLHRElement>> = ({
  className,
  ...props
}) => {
  return (
    <hr
      className={clsx(
        'border-t border-gray-200 my-4',
        className
      )}
      {...props}
    />
  );
};
