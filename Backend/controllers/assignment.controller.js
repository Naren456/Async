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
    const { filter } = req.query; // Get filter from query params
    const userId = req.user;
    const result = await assignmentService.getAssignmentsByCohort(cohortNo, userId, filter);
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

export const toggleCompletion = async (req,res) => {
  try {
    const {assignmentId} = req.body;
    const userId = req.user;
        console.log("Toggling:", { userId, assignmentId });
    if(!assignmentId){
      return res.status(400).json({success : false , message : "Assignment ID is required"});
    }
    const result = await assignmentService.toggleAssignmentCompletion(userId,assignmentId);
    res.status(200).json({success:true,completed: result.completed});
  }
  catch(err){
    console.error("Toggle Error Details:", err);
    res.status(500).json({success:false, message : err.message});
  }
}
