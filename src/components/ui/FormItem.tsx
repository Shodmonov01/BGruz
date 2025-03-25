import * as React from 'react';

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props} />
    );
  }
);
FormItem.displayName = 'FormItem';

export default FormItem; 