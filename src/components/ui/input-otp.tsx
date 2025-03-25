import * as React from 'react';
import { DashIcon } from '@radix-ui/react-icons';
import { OTPInput } from 'input-otp';
import { useDispatch, useSelector } from 'react-redux';
import { setOtp } from '@/store/otpSlice'; // Ensure this slice exists
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => {
  const dispatch = useDispatch();
  const otpValue = useSelector((state: RootState) => state.otp.value);

  const handleChange = (value: string) => {
    dispatch(setOtp(value));
  };

  return (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        'flex items-center gap-2 has-[:disabled]:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      value={otpValue}
      onChange={handleChange}
      render={({ slots }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot
                index={index}
                char={slot.char}
                hasFakeCaret={slot.hasFakeCaret}
                isActive={slot.isActive}
              />
              {index !== slots.length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      )}
      {...props}
    />
  );
});
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { 
    index: number,
    char?: string,
    hasFakeCaret?: boolean,
    isActive?: boolean 
  }
>(({ index, className, char, hasFakeCaret, isActive, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-1 ring-ring',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DashIcon />
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };