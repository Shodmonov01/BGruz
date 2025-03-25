import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '@/store/formSlice';
import { RootState } from '@/store/store';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import FormItem from './FormItem';

const FormComponent = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  return (
    <form>
      <FormItem>
        <Label htmlFor="example">Example</Label>
        <input
          name="example"
          value={formData.example || ''}
          onChange={handleChange}
        />
      </FormItem>
    </form>
  );
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <Controller {...props} />
  );
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(className)}
      htmlFor={props.htmlFor}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  return (
    <Slot
      ref={ref}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export const Form = () => {
  return (
    <form>
      <input type="text" placeholder="Enter text" />
      <button type="submit">Submit</button>
    </form>
  );
};

export {
  FormComponent,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem
};
