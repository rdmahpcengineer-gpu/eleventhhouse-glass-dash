import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary:
          'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl focus-visible:ring-black',
        secondary:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500',
        outline:
          'border-2 border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500',
        ghost:
          'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
        gradient:
          'bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:from-orange-600 hover:to-blue-700 shadow-lg hover:shadow-xl',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        white:
          'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'h-10 px-4 text-xs tracking-widest uppercase',
        md: 'h-12 px-6 text-sm tracking-wider uppercase',
        lg: 'h-14 px-8 text-sm tracking-widest uppercase',
        xl: 'h-16 px-10 text-base tracking-widest uppercase',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
