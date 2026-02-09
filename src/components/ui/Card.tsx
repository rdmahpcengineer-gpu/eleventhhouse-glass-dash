import React from 'react';
import { cn } from '../../lib/utils';

type GlassVariant = 'none' | 'default' | 'high' | 'medium' | 'low' | 'metric' | 'banner';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean | GlassVariant;
  hover?: boolean;
}

const glassStyles: Record<GlassVariant, string> = {
  none: 'bg-white border-gray-200',
  default: 'glass-card',
  high: 'glass-card', // High blur - 40px
  medium: 'glass-card', // Medium blur - 20px  
  low: 'glass-timeline', // Low blur - text focus
  metric: 'glass-metric',
  banner: 'glass-banner',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, hover = false, ...props }, ref) => {
    // Determine glass variant
    let glassVariant: GlassVariant = 'none';
    if (glass === true) {
      glassVariant = 'default';
    } else if (typeof glass === 'string') {
      glassVariant = glass;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border',
          glassStyles[glassVariant],
          hover && 'glass-card-hover',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { glass?: boolean }
>(({ className, glass = false, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-bold leading-none tracking-tight',
      glass ? 'text-white' : 'text-gray-900',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { glass?: boolean }
>(({ className, glass = false, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm',
      glass ? 'text-white/60' : 'text-gray-500',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export type { GlassVariant };
