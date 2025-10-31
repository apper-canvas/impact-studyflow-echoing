import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import CourseCard from "@/components/organisms/CourseCard";
import DeleteModal from "@/components/organisms/DeleteModal";
import CourseModal from "@/components/organisms/CourseModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Courses = () => {
  const { onAddClick } = useOutletContext();
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
        const updateData = {
          name_c: formData.name,
          instructor_c: formData.instructor,
          schedule_c: formData.schedule,
          location_c: formData.location,
          color_c: formData.color,
          semester_c: formData.semester,
          credit_hours_c: parseInt(formData.creditHours)
        };
        await courseService.update(selectedCourse.Id, updateData);
        toast.success("Course updated successfully");
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
      // Delete associated assignments first
      const assignments = await assignmentService.getByCourseId(courseToDelete.Id);
      if (assignments && assignments.length > 0) {
        await Promise.all(assignments.map(a => assignmentService.delete(a.Id)));
      }
      
      await courseService.delete(courseToDelete.Id);
      toast.success("Course deleted successfully");
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
        {courses.map((course) => (
          <CourseCard
            key={course.Id}
            course={{
              ...course,
              name: course.name_c,
              instructor: course.instructor_c,
              schedule: course.schedule_c,
              location: course.location_c,
              color: course.color_c,
              semester: course.semester_c,
              creditHours: course.credit_hours_c
            }}
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
        message={`Are you sure you want to delete "${courseToDelete?.name_c}"? This will also delete all associated assignments.`}
      />
    </>
  );
};

export default Courses;