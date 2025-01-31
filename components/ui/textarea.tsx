import * as React from 'react';

import {cn} from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
      className={cn(
        'flex w-full bg-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ' +
          'min-h-[80px] max-h-[80px] resize-none rounded-2xl p-[30px] pr-[80px] border border-white/32 border-solid outline-none focus-visible:outline-none ' +
          'text-[14px] leading-4 shadow-inner inputField text-black', // Adăugat text-black
        className
      )}
      ref={ref}
      {...props}
    />
    );
    /*overflow-hidden placeholder:text-muted-foreground*/
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
