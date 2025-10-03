import studySessionsData from "@/services/mockData/studySessions.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let studySessions = [...studySessionsData];

const studySessionService = {
  getAll: async () => {
    await delay(300);
    return [...studySessions];
  },

  getById: async (id) => {
    await delay(200);
    const session = studySessions.find((s) => s.Id === parseInt(id));
    if (!session) throw new Error("Study session not found");
    return { ...session };
  },

  getByCourseId: async (courseId) => {
    await delay(300);
    return studySessions.filter((s) => s.courseId === parseInt(courseId));
  },

  create: async (sessionData) => {
    await delay(400);
    const maxId = studySessions.length > 0 ? Math.max(...studySessions.map((s) => s.Id)) : 0;
    const newSession = {
      Id: maxId + 1,
      ...sessionData
    };
    studySessions.push(newSession);
    return { ...newSession };
  },

  update: async (id, sessionData) => {
    await delay(400);
    const index = studySessions.findIndex((s) => s.Id === parseInt(id));
    if (index === -1) throw new Error("Study session not found");
    studySessions[index] = { ...studySessions[index], ...sessionData };
    return { ...studySessions[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = studySessions.findIndex((s) => s.Id === parseInt(id));
    if (index === -1) throw new Error("Study session not found");
    studySessions.splice(index, 1);
    return true;
  }
};

export default studySessionService;