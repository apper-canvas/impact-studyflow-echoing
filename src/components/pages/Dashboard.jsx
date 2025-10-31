import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isWithinInterval, addDays } from "date-fns";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatCard from "@/components/molecules/StatCard";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import CourseCard from "@/components/organisms/CourseCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    const completedAssignments = assignments.filter(a => a.grade !== null);
    if (completedAssignments.length === 0) return "N/A";
    
    const totalPoints = completedAssignments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 4.0, 0);
    return (totalPoints / completedAssignments.length).toFixed(2);
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    return assignments
      .filter(a => {
        const dueDate = new Date(a.dueDate);
        return a.status !== "completed" && isWithinInterval(dueDate, { start: now, end: nextWeek });
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getPendingCount = () => {
    return assignments.filter(a => a.status === "pending").length;
  };

  const getCompletionRate = () => {
    if (assignments.length === 0) return 0;
    const completed = assignments.filter(a => a.status === "completed").length;
    return Math.round((completed / assignments.length) * 100);
  };

  const handleToggleAssignment = async (assignment) => {
    try {
await assignmentService.toggleStatus(assignment.Id);
      loadData();
    } catch (err) {
      console.error("Failed to toggle assignment status:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const upcomingAssignments = getUpcomingAssignments();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={calculateGPA()}
          icon="TrendingUp"
          gradient="from-primary to-indigo-600"
        />
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon="BookOpen"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Pending Tasks"
          value={getPendingCount()}
          icon="Clock"
          gradient="from-accent to-yellow-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${getCompletionRate()}%`}
          icon="CheckCircle2"
          gradient="from-success to-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
            <button
              onClick={() => navigate("/assignments")}
              className="text-primary hover:text-indigo-700 font-medium text-sm transition-colors"
            >
              View All
            </button>
          </div>

          {upcomingAssignments.length === 0 ? (
            <Empty
              title="No upcoming deadlines"
              message="You're all caught up! Check back later."
              icon="CheckCircle2"
            />
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map(assignment => {
const course = courses.find(c => c.Id === assignment.course_id_c?.Id);
                return (
                  <AssignmentItem
                    key={assignment.Id}
                    assignment={assignment}
                    course={course}
                    onToggle={handleToggleAssignment}
                    onEdit={() => navigate("/assignments")}
                    onDelete={() => navigate("/assignments")}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
            <button
              onClick={() => navigate("/courses")}
              className="text-primary hover:text-indigo-700 font-medium text-sm transition-colors"
            >
              View All
            </button>
          </div>

          {courses.length === 0 ? (
            <Empty
              title="No courses yet"
              message="Start by adding your first course"
              actionLabel="Add Course"
              onAction={() => navigate("/courses")}
              icon="BookOpen"
            />
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 4).map(course => (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  key={course.Id}
                  onClick={() => navigate("/courses")}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm shrink-0"
                    style={{ backgroundColor: course.color }}
                  >
                    <span className="text-white font-bold text-lg">
                      {course.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{course.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{course.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;