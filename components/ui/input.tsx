import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
            'flex h-12 w-full rounded-2xl border border-white/32 border-solid p-4 focus-visible:outline-none disabled:cursor-not-allowed text-[14px] leading-4 text-primary grow shrink basis-0 font-normal shadow-inner bg-input-gradient inputField',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
