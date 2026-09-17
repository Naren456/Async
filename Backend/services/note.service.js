import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from 'stream';

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

export const uploadNote = async (data, fileBuffer) => {
  const { title, subjectCode } = data;

  const subjectExists = await prisma.subject.findUnique({
    where: { code: subjectCode },
  });
  if (!subjectExists) {
    throw { status: 404, message: "Subject not found" };
  }

  // Validate PDF magic bytes %PDF
  if (fileBuffer.slice(0, 4).toString() !== '%PDF') {
    throw { status: 400, message: "Invalid PDF file (bad header)" };
  }

  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(fileBuffer);
  } catch (e) {
    throw { status: 500, message: "Cloudinary upload failed: " + (e.message || "") };
  }

  if (!uploadResult || !uploadResult.secure_url) {
     throw { status: 500, message: 'Cloudinary upload failed' };
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title: String(title).trim(),
        subjectCode,
        pdfUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
    return newNote;
  } catch (e) {
    // orphan cleanup: delete uploaded file if DB fails
    try { await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: "raw" }); } catch(_){}
    throw e;
  }
};

export const deleteNote = async (noteId) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { publicId: true }
  });

  if (!note) {
    throw { status: 404, message: 'Note not found' };
  }

  // Delete DB first, then cloudinary - so if DB fails we don't lose file orphan
  await prisma.note.delete({ where: { id: noteId } });
  if (note.publicId) {
    try {
      await cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" });
    } catch (e) {
      console.warn(`Failed to delete cloudinary ${note.publicId}:`, e.message);
      // don't throw - DB already deleted, log for manual cleanup
    }
  }
};
