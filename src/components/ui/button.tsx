import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer disabled:cursor-not-allowed justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-button-primary to-button-primary-hover text-white shadow-lg hover:shadow-xl hover:from-button-primary-hover hover:to-button-primary-active active:from-button-primary-active active:to-button-primary-active transform hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-gradient-to-r from-button-destructive to-button-destructive-hover text-white shadow-lg hover:shadow-xl hover:from-button-destructive-hover hover:to-button-destructive-active active:from-button-destructive-active active:to-button-destructive-active transform hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'bg-gradient-to-r from-button-secondary to-button-secondary-hover border-2 border-[var(--color-button-outline-border)] text-foreground shadow-md hover:shadow-lg hover:border-[var(--color-button-outline-border-hover)] hover:from-button-secondary-hover hover:to-button-secondary-active active:from-button-secondary-active active:to-button-secondary-active transform hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-gradient-to-r from-button-secondary to-button-secondary-hover text-foreground shadow-md hover:shadow-lg hover:from-button-secondary-hover hover:to-button-secondary-active active:from-button-secondary-active active:to-button-secondary-active transform hover:scale-[1.02] active:scale-[0.98]',
        ghost:
          'bg-transparent text-foreground hover:bg-accent/50 hover:text-accent-foreground transform hover:scale-[1.02] active:scale-[0.98]',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary/80',
        success:
          'bg-gradient-to-r from-button-success to-button-success-hover text-white shadow-lg hover:shadow-xl hover:from-button-success-hover hover:to-button-success-active active:from-button-success-active active:to-button-success-active transform hover:scale-[1.02] active:scale-[0.98]',
        status:
          'bg-transparent border-2 border-[var(--color-button-outline-border)] text-foreground shadow-md hover:shadow-lg hover:border-[var(--color-button-outline-border-hover)] hover:from-button-secondary/20 hover:to-button-secondary/30 active:from-button-secondary/30 active:to-button-secondary/40 transform hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-8 rounded-md gap-1.5 px-3.5 has-[>svg]:px-3',
        lg: 'h-12 rounded-lg px-8 has-[>svg]:px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
