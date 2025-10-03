import React, { useState, useEffect } from "react";
import assignmentService from "@/services/api/assignmentService";
import courseService from "@/services/api/courseService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const Grades = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId && a.grade !== null);
    if (courseAssignments.length === 0) return null;

    const totalWeight = courseAssignments.reduce((sum, a) => sum + a.weight, 0);
    const weightedGrade = courseAssignments.reduce((sum, a) => {
      const percentage = (a.grade / a.maxGrade) * 100;
      return sum + (percentage * a.weight);
    }, 0);

    return (weightedGrade / totalWeight).toFixed(2);
  };

  const calculateOverallGPA = () => {
    const gradedCourses = courses.filter(course => {
      const grade = calculateCourseGrade(course.Id);
      return grade !== null;
    });

    if (gradedCourses.length === 0) return "N/A";

    const totalGPA = gradedCourses.reduce((sum, course) => {
      const grade = parseFloat(calculateCourseGrade(course.Id));
      const gpa = (grade / 100) * 4.0;
      return sum + gpa;
    }, 0);

    return (totalGPA / gradedCourses.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "from-success to-green-600";
    if (grade >= 80) return "from-info to-blue-600";
    if (grade >= 70) return "from-warning to-yellow-600";
    return "from-error to-red-600";
  };

  const getLetterGrade = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (assignments.filter(a => a.grade !== null).length === 0) {
    return (
      <Empty
        title="No grades yet"
        message="Grades will appear here once you add them to your assignments"
        icon="Award"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 font-medium mb-2">Overall GPA</p>
            <h2 className="text-5xl font-bold">{calculateOverallGPA()}</h2>
            <p className="text-white/80 mt-2">Out of 4.0</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <ApperIcon name="TrendingUp" size={40} className="text-white" />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {courses.map(course => {
          const courseGrade = calculateCourseGrade(course.Id);
          if (courseGrade === null) return null;

          const courseAssignments = assignments.filter(a => a.courseId === course.Id && a.grade !== null);
          const numericGrade = parseFloat(courseGrade);

          return (
            <Card key={course.Id} className="overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: course.color }}
                  >
                    <span className="text-white font-bold text-2xl">
                      {getLetterGrade(numericGrade)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                    <p className="text-gray-600">{course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${getGradeColor(numericGrade)} bg-clip-text text-transparent`}>
                    {courseGrade}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{courseAssignments.length} graded assignments</p>
                </div>
              </div>

              <div className="space-y-3">
                {courseAssignments.map(assignment => {
                  const percentage = ((assignment.grade / assignment.maxGrade) * 100).toFixed(1);
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                          <Badge variant="default">{assignment.weight}% weight</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Award" size={14} />
                            <span>{assignment.grade} / {assignment.maxGrade}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${getGradeColor(parseFloat(percentage))} bg-clip-text text-transparent`}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Grades;