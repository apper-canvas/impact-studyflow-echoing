import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-vertical min-h-[100px]",
        error ? "border-error" : "border-gray-200 hover:border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;