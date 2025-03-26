import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { useDispatch, useSelector } from 'react-redux';
import { setToggleState } from '@/store/toggleSlice';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      toggleKey?: string; // Добавляем ключ для идентификации в Redux
    }
>(({ className, variant, size, toggleKey, ...props }, ref) => {
  const dispatch = useDispatch();
  const toggleState = useSelector((state: RootState) => 
    toggleKey ? state.toggle[toggleKey] : undefined
  );

  const handleToggle = (pressed: boolean) => {
    if (toggleKey) {
      dispatch(setToggleState(toggleKey));
    }
    if (props.onPressedChange) {
      props.onPressedChange(pressed);
    }
  };

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      pressed={toggleKey ? toggleState : props.pressed}
      onPressedChange={toggleKey ? handleToggle : props.onPressedChange}
      {...props}
    />
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };