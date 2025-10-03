import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const variants = {
    pending: "warning",
    "in-progress": "primary",
    completed: "success"
  };
  
  const labels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed"
  };
  
  return (
    <Badge variant={variants[status] || "default"}>
      {labels[status] || status}
    </Badge>
  );
};

export default StatusBadge;