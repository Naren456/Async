import prisma from "../config/db.js";

export const getAllSubjects = async () => {
  const subjects = await prisma.subject.findMany({
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        take: 50 // prevent massive payload
      },
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

  const qpSemester = filters.semester !== undefined ? Number(filters.semester) : undefined;
  const qpTerm = filters.term !== undefined ? Number(filters.term) : undefined;
  const hasSemester = qpSemester !== undefined && !isNaN(qpSemester);
  const hasTerm = qpTerm !== undefined && !isNaN(qpTerm);
  
  const effectiveSemester = hasSemester ? qpSemester : (user.semester || 1);
  const effectiveTerm = hasTerm ? qpTerm : (user.term || 1);

  let whereClause;
  if (hasSemester && hasTerm) {
    whereClause = { AND: [{ semester: effectiveSemester }, { term: effectiveTerm }] };
  } else if (hasSemester && !hasTerm) {
    whereClause = { semester: effectiveSemester };
  } else if (!hasSemester && hasTerm) {
    whereClause = { term: effectiveTerm };
  } else {
    whereClause = { semester: { lte: effectiveSemester } };
  }

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
  if (!code || !name) throw { status: 400, message: "code and name required" };
  const sem = Number(semester);
  const t = Number(term);
  if (isNaN(sem) || isNaN(t)) throw { status: 400, message: "semester/term must be numbers" };
  try {
    const subject = await prisma.subject.create({
      data: { code: String(code).trim(), name: String(name).trim(), semester: sem, term: t },
    });
    return subject;
  } catch (e) {
    if (e.code === 'P2002') throw { status: 409, message: "Subject code already exists" };
    throw e;
  }
};

export const updateSubject = async (subjectId, updates) => {
  const { code, name, semester, term } = updates;
  // Disallow changing primary key code to avoid FK breakage
  if (code !== undefined && code !== subjectId) {
    throw { status: 400, message: "Changing subject code is not allowed" };
  }
  const data = {};
  if (name !== undefined) data.name = String(name).trim();
  if (semester !== undefined) {
    const sem = Number(semester);
    if (isNaN(sem)) throw { status: 400, message: "Invalid semester" };
    data.semester = sem;
  }
  if (term !== undefined) {
    const t = Number(term);
    if (isNaN(t)) throw { status: 400, message: "Invalid term" };
    data.term = t;
  }
  const subject = await prisma.subject.update({
    where: { code: subjectId },
    data,
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

  // Delete related records first - in transaction
  await prisma.$transaction(async (tx) => {
    // Need to delete UserAssignments of assignments being deleted first
    const assignments = await tx.assignment.findMany({ where: { subjectCode: subjectId }, select: { id: true } });
    const ids = assignments.map(a => a.id);
    if (ids.length > 0) {
      await tx.userAssignment.deleteMany({ where: { assignmentId: { in: ids } } });
    }
    await tx.note.deleteMany({ where: { subjectCode: subjectId } });
    await tx.assignment.deleteMany({ where: { subjectCode: subjectId } });
    await tx.subject.delete({ where: { code: subjectId } });
  });
};
