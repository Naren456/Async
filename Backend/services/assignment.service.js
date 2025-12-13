import prisma from "../config/db.js";

const formatDateKey = (date) => {
  if (!date) return "No Due Date";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const createAssignment = async (data) => {
  const { title, dueDate, cohortNo, subjectCode, link } = data;

  const assignment = await prisma.assignment.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      openingDate: data.openingDate ? new Date(data.openingDate) : null,
      cohortNo: Number(cohortNo),
      subjectCode,
      link,
    },
  });

  return assignment;
};

export const getAssignmentsByCohort = async (cohortNo) => {
  const cohort = Number(cohortNo);
  if (Number.isNaN(cohort)) {
    throw { status: 400, message: "Invalid cohort number" };
  }

  const assignments = await prisma.assignment.findMany({
    where: { cohortNo: cohort },
    include: { subject: true },
    orderBy: { dueDate: "asc" },
  });

  const grouped = assignments.reduce((acc, a) => {
    const key = formatDateKey(a.dueDate);

    if (!acc[key]) acc[key] = [];

    acc[key].push({
      id: a.id,
      title: a.title,
      subject: a.subject,
      dueDate: a.dueDate,
      openingDate: a.openingDate,
      link: a.link,
      displayDate: a.dueDate
        ? new Date(a.dueDate).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No due date",
      isoDate: a.dueDate ? new Date(a.dueDate).toISOString() : "",
    });

    return acc;
  }, {});

  return { cohortNo: cohort, grouped, count: assignments.length };
};

export const deleteAssignment = async (id) => {
  const existing = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw { status: 404, message: "Assignment not found" };
  }

  await prisma.assignment.delete({
    where: { id },
  });
};
