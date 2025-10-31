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

create: async (data) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          title_c: data.title || '',
          description_c: data.description || '',
          due_date_c: data.dueDate || new Date().toISOString(),
          priority_c: data.priority || 'medium',
          status_c: data.status || 'pending',
          grade_c: data.grade !== null && data.grade !== undefined ? parseFloat(data.grade) : null,
          max_grade_c: parseFloat(data.maxGrade) || 100,
          weight_c: parseFloat(data.weight) || 10,
          created_at_c: new Date().toISOString(),
          completed_at_c: data.completedAt || null,
          course_id_c: parseInt(data.courseId)
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
          courseId: createdAssignment.course_id_c?.Id || parseInt(data.courseId)
        };
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const apperClient = getApperClient();
      
      // First get the current assignment
      const response = await apperClient.getRecordById('assignment_c', id, {
        fields: [{"field": {"Name": "status_c"}}]
      });

      if (!response.success || !response.data) {
        console.error(response.message || "Failed to fetch assignment");
        return null;
      }

      // Determine new status
      const currentStatus = response.data.status_c;
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

      // Update the status
      const updateResponse = await apperClient.updateRecord('assignment_c', {
        records: [{
          Id: id,
          status_c: newStatus,
          completed_at_c: newStatus === 'completed' ? new Date().toISOString() : null
        }]
      });

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        return null;
      }

      if (updateResponse.results) {
        const successful = updateResponse.results.filter(r => r.success);
        const failed = updateResponse.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to toggle status:`, failed);
          return null;
        }
        
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error toggling assignment status:", error?.message || error);
    }
    return null;
  },

update: async (id, data) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const updateFields = {
        Id: parseInt(id)
      };

      if (data.title !== undefined) updateFields.title_c = data.title;
      if (data.description !== undefined) updateFields.description_c = data.description;
      if (data.dueDate !== undefined) updateFields.due_date_c = data.dueDate;
      if (data.priority !== undefined) updateFields.priority_c = data.priority;
      if (data.status !== undefined) updateFields.status_c = data.status;
      if (data.grade !== undefined) updateFields.grade_c = data.grade !== null ? parseFloat(data.grade) : null;
      if (data.maxGrade !== undefined) updateFields.max_grade_c = parseFloat(data.maxGrade);
      if (data.weight !== undefined) updateFields.weight_c = parseFloat(data.weight);
      if (data.completedAt !== undefined) updateFields.completed_at_c = data.completedAt;
      if (data.courseId !== undefined) updateFields.course_id_c = parseInt(data.courseId);

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
        where: [{
          "FieldName": "course_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(courseId)]
        }]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response?.data?.length) {
        return [];
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
      console.error(`Error fetching assignments for course ${courseId}:`, error?.response?.data?.message || error.message);
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
};

export default assignmentService;