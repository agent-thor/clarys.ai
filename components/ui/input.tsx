import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
        // todo style input here
      <input
        type={type}
        className={cn(
          // 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'flex h-12 w-full rounded-2xl border border-white/30 border-solid p-4 focus-visible:outline-none disabled:cursor-not-allowed'
            + 'text-sm leading-4 text-primary grow shrink basis-0 font-normal shadow-inner bg-input-gradient',
            // + 'bg-gradient-to-b from-[#dbdde0] to-[#e6e8eb]',
          className,
        )}
        ref={ref}
        {...props}
      />
/*bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground*/
        /*placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50*/
    );
  },
);
Input.displayName = 'Input';

export { Input };
/*
* <div className="h-12 p-4 bg-gradient-to-b from-[#dbdde0] to-[#e6e8eb] rounded-2xl shadow-inner border border-white/30 justify-center items-center gap-4 inline-flex">
    <div className="grow shrink basis-0 text-[#121214] text-sm font-normal font-['Montserrat'] leading-none">cristiansimina@claris.ai</div>
</div>*/
/*<div className="w-[352px] h-12 p-4 bg-[#e6e8eb] rounded-2xl shadow-inner border border-white/30 justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 text-[#121214] text-sm font-normal font-['Montserrat'] leading-none">|</div>
        </div>*/
