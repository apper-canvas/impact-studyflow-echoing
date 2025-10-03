import assignmentsData from "@/services/mockData/assignments.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let assignments = [...assignmentsData];

const assignmentService = {
  getAll: async () => {
    await delay(300);
    return [...assignments];
  },

  getById: async (id) => {
    await delay(200);
    const assignment = assignments.find((a) => a.Id === parseInt(id));
    if (!assignment) throw new Error("Assignment not found");
    return { ...assignment };
  },

  getByCourseId: async (courseId) => {
    await delay(300);
    return assignments.filter((a) => a.courseId === parseInt(courseId));
  },

  create: async (assignmentData) => {
    await delay(400);
    const maxId = assignments.length > 0 ? Math.max(...assignments.map((a) => a.Id)) : 0;
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  update: async (id, assignmentData) => {
    await delay(400);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Assignment not found");
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Assignment not found");
    assignments.splice(index, 1);
    return true;
  },

  toggleStatus: async (id) => {
    await delay(300);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Assignment not found");
    
    const currentStatus = assignments[index].status;
    let newStatus;
    
    if (currentStatus === "completed") {
      newStatus = "pending";
      assignments[index].completedAt = null;
    } else {
      newStatus = "completed";
      assignments[index].completedAt = new Date().toISOString();
    }
    
    assignments[index].status = newStatus;
    return { ...assignments[index] };
  }
};

export default assignmentService;