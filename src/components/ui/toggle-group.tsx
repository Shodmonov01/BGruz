import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { useDispatch, useSelector } from 'react-redux';
import { setToggleState } from '@/store/toggleSlice';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const dispatch = useDispatch();
  const toggleState = useSelector((state: RootState) => state.toggle.state);

  const handleToggle = (value: string) => {
    dispatch(setToggleState(value));
  };

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn('flex items-center justify-center gap-1', className)}
      onValueChange={handleToggle}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = 'ToggleGroup';

export { ToggleGroup };
