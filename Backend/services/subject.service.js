import prisma from "../config/db.js";

export const getAllSubjects = async () => {
  const subjects = await prisma.subject.findMany({
    include: {
      notes: true,
    },
    orderBy: {
      semester: "asc",
    },
  });
  return subjects;
};

export const getUserSubjects = async (userId, filters = {}) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const { semester: qpSemester, term: qpTerm } = filters;
  
  const effectiveSemester = Number.isFinite(qpSemester) ? qpSemester : (user.semester || 1);
  const effectiveTerm = Number.isFinite(qpTerm) ? qpTerm : (user.term || 1);

  const whereClause = (qpSemester !== undefined && qpTerm !== undefined)
    ? {
        AND: [
          { semester: { equals: effectiveSemester } },
          { term: { equals: effectiveTerm } },
        ],
      }
    : {
        semester: { lte: effectiveSemester },
      };

  const subjects = await prisma.subject.findMany({
    where: whereClause,
    include: { notes: true },
    orderBy: [
      { semester: 'asc' },
      { term: 'asc' },
      { code: 'asc' },
    ],
  });

  return { 
    subjects, 
    filters: { semester: effectiveSemester, term: effectiveTerm }, 
    mode: (qpSemester !== undefined && qpTerm !== undefined) ? 'exact' : 'inclusive' 
  };
};

export const getSubjectById = async (subjectId) => {
  const subject = await prisma.subject.findUnique({
    where: { code: subjectId },
    include: { notes: true },
  });

  if (!subject) {
    throw { status: 404, message: "Subject not found" };
  }

  return subject;
};

export const createSubject = async (data) => {
  const { code, name, semester, term } = data;

  const subject = await prisma.subject.create({
    data: {
      code,
      name,
      semester,
      term,
    },
  });

  return subject;
};

export const updateSubject = async (subjectId, updates) => {
  const { code, name, semester, term } = updates;

  const subject = await prisma.subject.update({
    where: { code: subjectId },
    data: { code, name, semester, term },
  });

  return subject;
};

export const deleteSubject = async (subjectId) => {
  const existing = await prisma.subject.findUnique({
    where: { code: subjectId },
  });

  if (!existing) {
    throw { status: 404, message: "Subject not found" };
  }

  // Delete related records first
  await prisma.note.deleteMany({
    where: { subjectCode: subjectId },
  });

  await prisma.assignment.deleteMany({
    where: { subjectCode: subjectId },
  });

  await prisma.subject.delete({
    where: { code: subjectId },
  });
};
