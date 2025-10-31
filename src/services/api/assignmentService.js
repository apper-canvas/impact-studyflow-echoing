import { getApperClient } from "@/services/apperClient";
const assignmentService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        maxGrade: assignment.max_grade_c || 100,
        weight: assignment.weight_c || 10,
        createdAt: assignment.created_at_c || '',
        completedAt: assignment.completed_at_c || null,
        courseId: assignment.course_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await apperClient.getRecordById('assignment_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        maxGrade: assignment.max_grade_c || 100,
        weight: assignment.weight_c || 10,
        createdAt: assignment.created_at_c || '',
        completedAt: assignment.completed_at_c || null,
        courseId: assignment.course_id_c?.Id || null
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

getByCourseId: async (courseId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [
          {
            "FieldName": "course_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        maxGrade: assignment.max_grade_c || 100,
        weight: assignment.weight_c || 10,
        createdAt: assignment.created_at_c || '',
        completedAt: assignment.completed_at_c || null,
        courseId: assignment.course_id_c?.Id || parseInt(courseId)
      }));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

create: async (assignmentData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      const params = {
        records: [{
          title_c: assignmentData.title || '',
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate || new Date().toISOString(),
          priority_c: assignmentData.priority || 'medium',
          status_c: assignmentData.status || 'pending',
          grade_c: assignmentData.grade !== null && assignmentData.grade !== undefined ? parseFloat(assignmentData.grade) : null,
          max_grade_c: parseFloat(assignmentData.maxGrade) || 100,
          weight_c: parseFloat(assignmentData.weight) || 10,
          created_at_c: new Date().toISOString(),
          completed_at_c: assignmentData.completedAt || null,
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };

      const response = await apperClient.createRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create assignment: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create assignment");
        }
        
        const createdAssignment = response.results[0].data;
        return {
          Id: createdAssignment.Id,
          title: createdAssignment.title_c || '',
          description: createdAssignment.description_c || '',
          dueDate: createdAssignment.due_date_c || '',
          priority: createdAssignment.priority_c || 'medium',
          status: createdAssignment.status_c || 'pending',
          grade: createdAssignment.grade_c || null,
          maxGrade: createdAssignment.max_grade_c || 100,
          weight: createdAssignment.weight_c || 10,
          createdAt: createdAssignment.created_at_c || '',
          completedAt: createdAssignment.completed_at_c || null,
          courseId: createdAssignment.course_id_c?.Id || parseInt(assignmentData.courseId)
        };
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, assignmentData) => {
    try {
const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const updateFields = {
        Id: parseInt(id)
      };

      if (assignmentData.title !== undefined) updateFields.title_c = assignmentData.title;
      if (assignmentData.description !== undefined) updateFields.description_c = assignmentData.description;
      if (assignmentData.dueDate !== undefined) updateFields.due_date_c = assignmentData.dueDate;
      if (assignmentData.priority !== undefined) updateFields.priority_c = assignmentData.priority;
      if (assignmentData.status !== undefined) updateFields.status_c = assignmentData.status;
      if (assignmentData.grade !== undefined) updateFields.grade_c = assignmentData.grade !== null ? parseFloat(assignmentData.grade) : null;
      if (assignmentData.maxGrade !== undefined) updateFields.max_grade_c = parseFloat(assignmentData.maxGrade);
      if (assignmentData.weight !== undefined) updateFields.weight_c = parseFloat(assignmentData.weight);
      if (assignmentData.completedAt !== undefined) updateFields.completed_at_c = assignmentData.completedAt;
      if (assignmentData.courseId !== undefined) updateFields.course_id_c = parseInt(assignmentData.courseId);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update assignment: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update assignment");
        }
        
        const updatedAssignment = response.results[0].data;
        return {
          Id: updatedAssignment.Id,
          title: updatedAssignment.title_c || '',
          description: updatedAssignment.description_c || '',
          dueDate: updatedAssignment.due_date_c || '',
          priority: updatedAssignment.priority_c || 'medium',
          status: updatedAssignment.status_c || 'pending',
          grade: updatedAssignment.grade_c || null,
          maxGrade: updatedAssignment.max_grade_c || 100,
          weight: updatedAssignment.weight_c || 10,
          createdAt: updatedAssignment.created_at_c || '',
          completedAt: updatedAssignment.completed_at_c || null,
          courseId: updatedAssignment.course_id_c?.Id || null
        };
      }
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete assignment: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete assignment");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const assignment = await assignmentService.getById(id);
      
      const currentStatus = assignment.status;
      let newStatus;
      let completedAt;
      
      if (currentStatus === "completed") {
        newStatus = "pending";
        completedAt = null;
      } else {
        newStatus = "completed";
        completedAt = new Date().toISOString();
      }

      return await assignmentService.update(id, {
        status: newStatus,
        completedAt: completedAt
      });
    } catch (error) {
      console.error("Error toggling assignment status:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default assignmentService;