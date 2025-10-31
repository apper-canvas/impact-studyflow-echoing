import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const CourseCard = ({ course, onClick, onEdit, onDelete }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover onClick={onClick} className="relative overflow-hidden group">
        <div 
          className="absolute top-0 left-0 right-0 h-1"
style={{ backgroundColor: course.color }}
        />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
              style={{ backgroundColor: course.color }}
            >
              <ApperIcon name="BookOpen" className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
              <p className="text-sm text-gray-600">{course.instructor}</p>
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="MapPin" size={16} />
            <span>{course.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Award" size={16} />
            <span>{course.creditHours} Credit Hours</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">{course.semester}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;