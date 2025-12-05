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

  const uploadResult = await uploadToCloudinary(fileBuffer);

  if (!uploadResult || !uploadResult.secure_url) {
     throw new Error('Cloudinary upload failed');
  }

  const newNote = await prisma.note.create({
    data: {
      title,
      subjectCode,
      pdfUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    },
  });

  return newNote;
};

export const deleteNote = async (noteId) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { publicId: true }
  });

  if (!note) {
    throw { status: 404, message: 'Note not found' };
  }

  if (note.publicId) {
    await cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" });
  }

  await prisma.note.delete({
    where: { id: noteId }
  });
};
