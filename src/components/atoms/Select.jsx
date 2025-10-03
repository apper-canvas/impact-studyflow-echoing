import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  children,
  className,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer",
        error ? "border-error" : "border-gray-200 hover:border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;