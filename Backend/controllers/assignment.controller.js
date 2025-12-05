import * as assignmentService from "../services/assignment.service.js";

export const createAssignment = async (req, res) => {
  try {
    const { title, cohortNo, subjectCode, link } = req.body;
    
    if (!title || !cohortNo || !subjectCode || !link) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, description, cohortNo, subjectCode, and link are required" 
      });
    }

    const assignment = await assignmentService.createAssignment(req.body);

    res.status(201).json({ success: true, assignment });
  } catch (err) {
    console.error("❌ Error creating assignment:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const getAssignmentsByCohortGrouped = async (req, res) => {
  try {
    const { cohortNo } = req.params;
    const result = await assignmentService.getAssignmentsByCohort(cohortNo);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Assignment ID is required" });
    }

    await assignmentService.deleteAssignment(id);

    return res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
