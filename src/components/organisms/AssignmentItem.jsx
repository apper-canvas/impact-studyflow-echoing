import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import StatusBadge from "@/components/molecules/StatusBadge";

const AssignmentItem = ({ assignment, course, onToggle, onEdit, onDelete }) => {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && assignment.status !== "completed";
  
  const handleToggle = () => {
    onToggle(assignment);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(assignment);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(assignment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 p-4 group"
      style={{ borderLeftColor: course?.color || "#4F46E5" }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className="mt-1 shrink-0"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              assignment.status === "completed"
                ? "bg-gradient-to-br from-success to-green-600 border-success"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            {assignment.status === "completed" && (
              <ApperIcon name="Check" size={16} className="text-white" />
            )}
          </motion.div>
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 mb-1 ${assignment.status === "completed" ? "line-through opacity-60" : ""}`}>
                {assignment.title}
              </h3>
              {assignment.description && (
                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
              )}
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit2" size={16} className="text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" size={16} className="text-error" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <ApperIcon name="BookOpen" size={14} className="text-gray-400" />
              <span className="text-gray-600 font-medium">{course?.name}</span>
            </div>
            
            <div className={`flex items-center gap-1.5 ${isOverdue ? "text-error" : "text-gray-600"}`}>
              <ApperIcon name="Calendar" size={14} />
              <span className="font-medium">
                {format(dueDate, "MMM d, yyyy")}
              </span>
            </div>
            
            <PriorityBadge priority={assignment.priority} />
            <StatusBadge status={assignment.status} />
            
            {assignment.grade !== null && (
              <div className="flex items-center gap-1.5 text-success font-medium">
                <ApperIcon name="Award" size={14} />
                <span>{assignment.grade}/{assignment.maxGrade}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentItem;