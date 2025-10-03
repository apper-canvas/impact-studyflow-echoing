import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import DeleteModal from "@/components/organisms/DeleteModal";

const Courses = ({ onAddClick }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (onAddClick) {
      onAddClick(() => {
        setSelectedCourse(null);
        setModalOpen(true);
      });
    }
  }, [onAddClick]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCourse) {
        await courseService.update(selectedCourse.Id, formData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.create(formData);
        toast.success("Course added successfully!");
      }
      setModalOpen(false);
      setSelectedCourse(null);
      loadCourses();
    } catch (err) {
      toast.error(err.message || "Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const assignments = await assignmentService.getByCourseId(courseToDelete.Id);
      await Promise.all(assignments.map(a => assignmentService.delete(a.Id)));
      await courseService.delete(courseToDelete.Id);
      toast.success("Course deleted successfully!");
      setDeleteModalOpen(false);
      setCourseToDelete(null);
      loadCourses();
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  if (courses.length === 0) {
    return (
      <Empty
        title="No courses yet"
        message="Start organizing your academic life by adding your first course"
        actionLabel="Add Your First Course"
        onAction={() => {
          setSelectedCourse(null);
          setModalOpen(true);
        }}
        icon="BookOpen"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard
            key={course.Id}
            course={course}
            onClick={() => {}}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <CourseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleSubmit}
        course={selectedCourse}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Course?"
        message={`Are you sure you want to delete "${courseToDelete?.name}"? This will also delete all associated assignments.`}
      />
    </>
  );
};

export default Courses;