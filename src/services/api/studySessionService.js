const studySessionService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('study_session_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(session => ({
        Id: session.Id,
        courseId: session.course_id_c?.Id || null,
        duration: session.duration_c || 0,
        date: session.date_c || '',
        notes: session.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching study sessions:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById('study_session_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const session = response.data;
      return {
        Id: session.Id,
        courseId: session.course_id_c?.Id || null,
        duration: session.duration_c || 0,
        date: session.date_c || '',
        notes: session.notes_c || ''
      };
    } catch (error) {
      console.error(`Error fetching study session ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getByCourseId: async (courseId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [
          {
            "FieldName": "course_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('study_session_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(session => ({
        Id: session.Id,
        courseId: session.course_id_c?.Id || parseInt(courseId),
        duration: session.duration_c || 0,
        date: session.date_c || '',
        notes: session.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching study sessions by course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (sessionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          course_id_c: parseInt(sessionData.courseId),
          duration_c: parseInt(sessionData.duration) || 0,
          date_c: sessionData.date || new Date().toISOString(),
          notes_c: sessionData.notes || ''
        }]
      };

      const response = await apperClient.createRecord('study_session_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create study session: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create study session");
        }
        
        const createdSession = response.results[0].data;
        return {
          Id: createdSession.Id,
          courseId: createdSession.course_id_c?.Id || parseInt(sessionData.courseId),
          duration: createdSession.duration_c || 0,
          date: createdSession.date_c || '',
          notes: createdSession.notes_c || ''
        };
      }
    } catch (error) {
      console.error("Error creating study session:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, sessionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateFields = {
        Id: parseInt(id)
      };

      if (sessionData.courseId !== undefined) updateFields.course_id_c = parseInt(sessionData.courseId);
      if (sessionData.duration !== undefined) updateFields.duration_c = parseInt(sessionData.duration);
      if (sessionData.date !== undefined) updateFields.date_c = sessionData.date;
      if (sessionData.notes !== undefined) updateFields.notes_c = sessionData.notes;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('study_session_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update study session: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update study session");
        }
        
        const updatedSession = response.results[0].data;
        return {
          Id: updatedSession.Id,
          courseId: updatedSession.course_id_c?.Id || null,
          duration: updatedSession.duration_c || 0,
          date: updatedSession.date_c || '',
          notes: updatedSession.notes_c || ''
        };
      }
    } catch (error) {
      console.error("Error updating study session:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('study_session_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete study session: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete study session");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting study session:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default studySessionService;