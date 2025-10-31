import { getApperClient } from "@/services/apperClient";

const courseService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credit_hours_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('course_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || '',
        instructor: course.instructor_c || '',
        schedule: course.schedule_c || '',
        location: course.location_c || '',
        color: course.color_c || '#4F46E5',
        semester: course.semester_c || '',
        creditHours: course.credit_hours_c || 0,
        createdAt: course.created_at_c || ''
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credit_hours_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || '',
        instructor: course.instructor_c || '',
        schedule: course.schedule_c || '',
        location: course.location_c || '',
        color: course.color_c || '#4F46E5',
        semester: course.semester_c || '',
        creditHours: course.credit_hours_c || 0,
        createdAt: course.created_at_c || ''
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (courseData) => {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      const params = {
        records: [{
          name_c: courseData.name || '',
          instructor_c: courseData.instructor || '',
          schedule_c: courseData.schedule || '',
          location_c: courseData.location || '',
          color_c: courseData.color || '#4F46E5',
          semester_c: courseData.semester || '',
          credit_hours_c: parseInt(courseData.creditHours) || 0,
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create course: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create course");
        }
        
        const createdCourse = response.results[0].data;
        return {
          Id: createdCourse.Id,
          name: createdCourse.name_c || '',
          instructor: createdCourse.instructor_c || '',
          schedule: createdCourse.schedule_c || '',
          location: createdCourse.location_c || '',
          color: createdCourse.color_c || '#4F46E5',
          semester: createdCourse.semester_c || '',
          creditHours: createdCourse.credit_hours_c || 0,
          createdAt: createdCourse.created_at_c || ''
        };
      }
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, courseData) => {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: courseData.name || '',
          instructor_c: courseData.instructor || '',
          schedule_c: courseData.schedule || '',
          location_c: courseData.location || '',
          color_c: courseData.color || '#4F46E5',
          semester_c: courseData.semester || '',
          credit_hours_c: parseInt(courseData.creditHours) || 0
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update course: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update course");
        }
        
        const updatedCourse = response.results[0].data;
        return {
          Id: updatedCourse.Id,
          name: updatedCourse.name_c || '',
          instructor: updatedCourse.instructor_c || '',
          schedule: updatedCourse.schedule_c || '',
          location: updatedCourse.location_c || '',
          color: updatedCourse.color_c || '#4F46E5',
          semester: updatedCourse.semester_c || '',
          creditHours: updatedCourse.credit_hours_c || 0,
          createdAt: updatedCourse.created_at_c || ''
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete course: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete course");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default courseService;