import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children,
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    high: "bg-accent/10 text-accent font-bold",
    medium: "bg-info/10 text-info font-medium",
    low: "bg-gray-100 text-gray-600"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;