import coursesData from "@/services/mockData/courses.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let courses = [...coursesData];

const courseService = {
  getAll: async () => {
    await delay(300);
    return [...courses];
  },

  getById: async (id) => {
    await delay(200);
    const course = courses.find((c) => c.Id === parseInt(id));
    if (!course) throw new Error("Course not found");
    return { ...course };
  },

  create: async (courseData) => {
    await delay(400);
    const maxId = courses.length > 0 ? Math.max(...courses.map((c) => c.Id)) : 0;
    const newCourse = {
      Id: maxId + 1,
      ...courseData,
      createdAt: new Date().toISOString()
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, courseData) => {
    await delay(400);
    const index = courses.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Course not found");
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = courses.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Course not found");
    courses.splice(index, 1);
    return true;
  }
};

export default courseService;