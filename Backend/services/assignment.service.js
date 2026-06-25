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

export const getAssignmentsByCohort = async (cohortNo, userId, filter = "all") => {
  const cohort = Number(cohortNo);
  if (Number.isNaN(cohort)) {
    throw { status: 400, message: "Invalid cohort number" };
  }

  const now = new Date();
  const whereClause = { cohortNo: cohort };

  if (filter === "upcoming") {
    whereClause.dueDate = { gte: now };
  } else if (filter === "due") {
    whereClause.dueDate = { lt: now };
  }

  console.log("Fetching assignments with filter:", filter, "whereClause:", whereClause);

  const assignments = await prisma.assignment.findMany({
    where: whereClause,
    include: { 
      subject: true, 
      users: { 
        where: { userId: userId } 
      }
    },
    orderBy: { dueDate: "asc" },
  });

  // If fetching specifically "due", filter out completed assignments
  let filteredAssignments = assignments;
  if (filter === "due") {
    filteredAssignments = assignments.filter((a) => {
      const isCompleted = a.users.length > 0 ? a.users[0].completed : false;
      return !isCompleted;
    });
  }

  const grouped = filteredAssignments.reduce((acc, a) => {
    const key = formatDateKey(a.dueDate);

    if (!acc[key]) acc[key] = [];

    acc[key].push({
      id: a.id,
      title: a.title,
      subject: a.subject,
      dueDate: a.dueDate,
      openingDate: a.openingDate,
      link: a.link,
      Completed: a.users.length > 0 ? a.users[0].completed : false,
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

  return { cohortNo: cohort, grouped, count: filteredAssignments.length };
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


export const toggleAssignmentCompletion = async(userId , assignmentId)=>{
  const existing = await prisma.userAssignment.findUnique({where:{userId_assignmentId:{userId , assignmentId}}});
  if(existing){
    return await prisma.userAssignment.update({
      where :{id:existing.id},
      data:{completed:!existing.completed}
    });
  }
    else{
      return await prisma.userAssignment.create({
        data:{userId,assignmentId,completed:true}
      });
    
  }
};
