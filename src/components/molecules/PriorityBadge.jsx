import React from "react";
import Badge from "@/components/atoms/Badge";

const PriorityBadge = ({ priority }) => {
  const variants = {
    high: "high",
    medium: "medium",
    low: "low"
  };
  
  return (
    <Badge variant={variants[priority] || "default"}>
      {priority?.toUpperCase()}
    </Badge>
  );
};

export default PriorityBadge;