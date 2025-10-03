import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const AssignmentModal = ({ isOpen, onClose, onSubmit, assignment, courses }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    grade: null,
    maxGrade: 100,
    weight: 10
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm")
      });
    } else {
      setFormData({
        courseId: courses[0]?.Id || "",
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        grade: null,
        maxGrade: 100,
        weight: 10
      });
    }
  }, [assignment, courses, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      courseId: parseInt(formData.courseId),
      grade: formData.grade ? parseFloat(formData.grade) : null,
      maxGrade: parseFloat(formData.maxGrade),
      weight: parseFloat(formData.weight),
      dueDate: new Date(formData.dueDate).toISOString()
    };
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
                    {assignment ? "Edit Assignment" : "Add New Assignment"}
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
                <FormField label="Course" required>
                  <Select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                  >
                    {courses.map(course => (
                      <option key={course.Id} value={course.Id}>
                        {course.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Assignment Title" required>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Calculus Problem Set 5"
                    required
                  />
                </FormField>

                <FormField label="Description">
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add any notes or details..."
                    rows="3"
                  />
                </FormField>

                <FormField label="Due Date" required>
                  <Input
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Priority" required>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormField>

                  <FormField label="Status" required>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Weight (%)" required>
                    <Input
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      required
                    />
                  </FormField>

                  <FormField label="Grade">
                    <Input
                      name="grade"
                      type="number"
                      value={formData.grade || ""}
                      onChange={handleChange}
                      min="0"
                      max={formData.maxGrade}
                      step="0.01"
                      placeholder="--"
                    />
                  </FormField>

                  <FormField label="Max Grade" required>
                    <Input
                      name="maxGrade"
                      type="number"
                      value={formData.maxGrade}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </FormField>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    {assignment ? "Update Assignment" : "Add Assignment"}
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

export default AssignmentModal;