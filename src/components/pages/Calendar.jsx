import React, { useEffect, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from "date-fns";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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
      setError(err.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const selectedDateAssignments = selectedDate ? getAssignmentsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handlePrevMonth} size="sm">
              <ApperIcon name="ChevronLeft" size={20} />
            </Button>
            <Button variant="ghost" onClick={handleToday} size="sm">
              Today
            </Button>
            <Button variant="ghost" onClick={handleNextMonth} size="sm">
              <ApperIcon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const dayAssignments = getAssignmentsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[80px] p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : isToday
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 hover:border-gray-200"
                } ${!isCurrentMonth && "opacity-40"}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? "text-primary font-bold" : "text-gray-700"
                }`}>
                  {format(day, "d")}
                </div>
<div className="space-y-1">
                  {dayAssignments.slice(0, 2).map((assignment) => {
                    const course = courses.find(c => c.Id === assignment.course_id_c?.Id);
                    return (
                      <div
                        key={assignment.Id}
                        className="text-xs p-1 bg-gray-50 rounded truncate"
                        style={{ borderLeft: `3px solid ${course?.color_c || "#4F46E5"}` }}
                      >
                        {assignment.title}
                      </div>
                    );
                  })}
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayAssignments.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
        </h3>

        {!selectedDate ? (
          <Empty
            title="No date selected"
            message="Click on a date to view assignments"
            icon="Calendar"
          />
        ) : selectedDateAssignments.length === 0 ? (
          <Empty
            title="No assignments"
            message="No assignments due on this date"
            icon="CheckCircle2"
          />
) : (
          <div className="space-y-3">
            {selectedDateAssignments.map(assignment => {
              const course = courses.find(c => c.Id === assignment.course_id_c?.Id);
              return (
                <div
                  key={assignment.Id}
                  className="p-4 border-l-4 rounded bg-white hover:bg-gray-50 transition-colors"
                  style={{ borderLeftColor: course?.color_c || "#4F46E5" }}
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <ApperIcon name="BookOpen" size={14} className="text-gray-400" />
                    <span className="text-gray-600">{course?.name || 'Unknown Course'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Clock" size={14} className="text-gray-400" />
                    <span className="text-gray-600">{format(new Date(assignment.dueDate), "h:mm a")}</span>
                  </div>
                  {assignment.priority && (
                    <div className="mt-2">
                      <Badge variant={assignment.priority === "high" ? "high" : assignment.priority === "medium" ? "medium" : "low"}>
                        {assignment.priority}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;