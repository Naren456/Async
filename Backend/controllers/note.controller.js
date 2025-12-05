import * as noteService from "../services/note.service.js";

export const createNoteWithUpload = async (req, res) => {
  try {
    const { title, subjectCode } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No PDF file provided" });
    }
    if (!title || !subjectCode) {
      return res.status(400).json({ message: "Title and Subject Code are required" });
    }

    const newNote = await noteService.uploadNote(req.body, file.buffer);
    res.status(201).json({ note: newNote });
  } catch (error) {
    console.error("Error creating note with upload:", error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error creating note" });
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    await noteService.deleteNote(noteId);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Server error deleting note' });
  }
};