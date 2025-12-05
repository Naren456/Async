import prisma from "../config/db.js";

export const getStats = async () => {
  const [
    totalUsers,
    totalSubjects,
    totalAssignments,
    activeCohorts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subject.count(),
    prisma.assignment.count(),
    prisma.cohort.count()
  ]);

  return {
    totalUsers,
    totalSubjects,
    totalAssignments,
    activeCohorts
  };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};
