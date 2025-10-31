import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import DeleteModal from "@/components/organisms/DeleteModal";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";

const Assignments = () => {
  const { onAddClick } = useOutletContext();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (onAddClick) {
      onAddClick(() => {
        setSelectedAssignment(null);
        setModalOpen(true);
      });
    }
  }, [onAddClick]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (formData) => {
    try {
      if (selectedAssignment) {
        const updateData = {
          course_id_c: parseInt(formData.courseId),
          title_c: formData.title,
          description_c: formData.description,
          due_date_c: new Date(formData.dueDate).toISOString(),
          priority_c: formData.priority,
          status_c: formData.status,
          grade_c: formData.grade ? parseFloat(formData.grade) : null,
          max_grade_c: parseFloat(formData.maxGrade),
          weight_c: parseFloat(formData.weight)
        };
        await assignmentService.update(selectedAssignment.Id, updateData);
        toast.success("Assignment updated successfully");
      } else {
        await assignmentService.create(formData);
        toast.success("Assignment added successfully!");
      }
      setModalOpen(false);
      setSelectedAssignment(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save assignment");
    }
  };

const handleToggle = async (assignment) => {
    try {
      await assignmentService.toggleStatus(assignment.Id);
      toast.success(
        assignment.status_c === "completed" 
          ? "Assignment marked as pending" 
          : "Assignment completed! Great work!"
      );
      await loadData();
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  const handleDeleteClick = (assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    try {
      await assignmentService.delete(assignmentToDelete.Id);
      toast.success("Assignment deleted successfully");
      setDeleteModalOpen(false);
      setAssignmentToDelete(null);
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete assignment");
    }
  };

  const getFilteredAssignments = () => {
    return assignments
      .filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredAssignments = getFilteredAssignments();

  if (assignments.length === 0) {
    return (
      <Empty
        title="No assignments yet"
        message="Keep track of your coursework by adding your first assignment"
        actionLabel="Add Your First Assignment"
        onAction={() => {
          setSelectedAssignment(null);
          setModalOpen(true);
        }}
        icon="CheckSquare"
      />
    );
  }

  const statusTabs = [
    { value: "all", label: "All", count: assignments.length },
    { value: "pending", label: "Pending", count: assignments.filter(a => a.status === "pending").length },
    { value: "in-progress", label: "In Progress", count: assignments.filter(a => a.status === "in-progress").length },
    { value: "completed", label: "Completed", count: assignments.filter(a => a.status === "completed").length }
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-2">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterStatus === tab.value
                    ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-sm">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {filteredAssignments.length === 0 ? (
          <Empty
            title="No assignments found"
            message="Try adjusting your search or filter"
            icon="Search"
          />
        ) : (
<div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const course = courses.find(c => c.Id === assignment.course_id_c?.Id);
              return (
                <AssignmentItem
                  key={assignment.Id}
                  assignment={{
                    ...assignment,
                    title: assignment.title_c,
                    description: assignment.description_c,
                    dueDate: assignment.due_date_c,
                    priority: assignment.priority_c,
                    status: assignment.status_c,
                    grade: assignment.grade_c,
                    maxGrade: assignment.max_grade_c
                  }}
                  course={course}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </div>
        )}
      </div>

      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAssignment(null);
        }}
        onSubmit={handleSubmit}
        assignment={selectedAssignment}
        courses={courses}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAssignmentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Assignment?"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
};

export default Assignments;