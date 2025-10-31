import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const CourseModal = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    schedule: "",
    location: "",
    color: "#4F46E5",
    semester: "Fall 2024",
    creditHours: 3
  });

useEffect(() => {
    if (course) {
      setFormData({
        name: course.name_c || course.name,
        instructor: course.instructor_c || course.instructor,
        schedule: course.schedule_c || course.schedule,
        location: course.location_c || course.location,
        color: course.color_c || course.color,
        semester: course.semester_c || course.semester,
        creditHours: course.credit_hours_c || course.creditHours
      });
    } else {
      setFormData({
        name: "",
        instructor: "",
        schedule: "",
        location: "",
        color: "#4F46E5",
        semester: "Fall 2024",
        creditHours: 3
      });
    }
  }, [course, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const colors = [
    "#4F46E5", "#7C3AED", "#10B981", "#F59E0B", 
    "#EF4444", "#3B82F6", "#EC4899", "#14B8A6"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {course ? "Edit Course" : "Add New Course"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField label="Course Name" required>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Advanced Mathematics"
                    required
                  />
                </FormField>

                <FormField label="Instructor" required>
                  <Input
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    placeholder="e.g., Dr. Sarah Johnson"
                    required
                  />
                </FormField>

                <FormField label="Schedule" required>
                  <Input
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="e.g., Mon, Wed, Fri 9:00 AM"
                    required
                  />
                </FormField>

                <FormField label="Location" required>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 301"
                    required
                  />
                </FormField>

                <FormField label="Semester" required>
                  <Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                  </Select>
                </FormField>

                <FormField label="Credit Hours" required>
                  <Input
                    name="creditHours"
                    type="number"
                    value={formData.creditHours}
                    onChange={handleChange}
                    min="1"
                    max="6"
                    required
                  />
                </FormField>

                <FormField label="Color">
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                          formData.color === color 
                            ? "ring-2 ring-offset-2 ring-primary scale-110" 
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </FormField>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    {course ? "Update Course" : "Add Course"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CourseModal;