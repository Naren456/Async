import * as subjectService from "../services/subject.service.js";

// ---------------- GET ALL SUBJECTS ----------------
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.json({ subjects });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    res.status(500).json({ message: "Server error fetching subjects" });
  }
};

// ---------------- GET SUBJECTS FOR USER ----------------
export const getUserSubjects = async (req, res) => {
  try {
    const { userId } = req.params;
    // IDOR fix: user can only fetch own subjects unless admin
    if (req.user !== userId) {
      const prisma = (await import("../config/db.js")).default;
      const me = await prisma.user.findUnique({ where: { id: req.user }, select: { role: true } });
      if (!me || me.role !== 'TEACHER') {
        return res.status(403).json({ message: "Forbidden: can only view your own subjects" });
      }
    }
    const result = await subjectService.getUserSubjects(userId, req.query);
    res.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error fetching user subjects" });
  }
};

// ---------------- CREATE SUBJECT ----------------
export const createSubject = async (req, res) => {
  try {
    const { code, name, semester, term } = req.body;

    if (!code || !name || semester === undefined || term === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subject = await subjectService.createSubject(req.body);
    res.status(201).json({ subject });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error creating subject" });
  }
};

// ---------------- GET SINGLE SUBJECT ----------------
export const getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId || typeof subjectId !== 'string') return res.status(400).json({ message: "Invalid subjectId" });
    const subject = await subjectService.getSubjectById(subjectId);
    res.json({ subject });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error fetching subject" });
  }
};

// ---------------- UPDATE SUBJECT ----------------
export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await subjectService.updateSubject(subjectId, req.body);
    res.json({ subject });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error updating subject" });
  }
};

// ---------------- DELETE SUBJECT ----------------
export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    await subjectService.deleteSubject(subjectId);
    return res.json({ success: true, message: `Subject '${subjectId}' deleted successfully` });
  } catch (error) {
    console.error("❌ Error deleting subject:", error);
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || "Server error while deleting subject" });
  }
};
