import { fetchUpcomingAssignmentsGrouped } from "../utils/icsParser.js";

export const getCourseraAssignments = async (req, res) => {
  const cohort =  parseInt(req.query.cohort) ; // Default to cohort 6 if not set
  const days = parseInt(req.query.days) || 90; // Default to next 90 days

  try {
    const groupedAssignments = await fetchUpcomingAssignmentsGrouped(cohort, days);
    res.status(200).json({Assignments : groupedAssignments , CohortNo : cohort});       

    } catch (error) {   

        console.error("Error fetching Coursera assignments:", error);   

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
