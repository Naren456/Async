import { fetchUpcomingAssignmentsGrouped } from "../utils/icsParser.js";

export const getCourseraAssignments = async (req, res) => {
  const rawCohort = req.query.cohort;
  const rawDays = req.query.days;
  const cohort = rawCohort !== undefined ? parseInt(rawCohort) : 6;
  const days = rawDays !== undefined ? parseInt(rawDays) : 90;

  if (isNaN(cohort) || ![4,6].includes(cohort)) {
    return res.status(400).json({ message: "Invalid cohort. Allowed: 4, 6" });
  }
  if (isNaN(days) || days < 1 || days > 365) {
    return res.status(400).json({ message: "Invalid days (1-365)" });
  }

  try {
    const groupedAssignments = await fetchUpcomingAssignmentsGrouped(cohort, days);
    res.status(200).json({Assignments : groupedAssignments , CohortNo : cohort});       

    } catch (error) {   
        if (process.env.NODE_ENV !== "production") console.error("Error fetching Coursera assignments:", error);
        res.status(500).json({ message: "Failed to fetch assignments" });   
    }
  }

  export const subjects = (req, res) => {
     const cohort =  parseInt(req.query.cohort) ; // Default to cohort 6 if not set

     try{

     }
     catch(error){
        console.error("Error fetching Coursera subjects:", error);   

        res.status(500).json({ message: "Failed to fetch subjects" });   
     }
  }
