import prisma from "../config/db.js";

export const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalSubjects,
    totalAssignments,
    activeCohorts,
    dauCount,
    totalActivities
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subject.count(),
    prisma.assignment.count(),
    prisma.cohort.count(),
    prisma.userActivity.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: today
        }
      }
    }),
    prisma.userActivity.count()
  ]);

  return {
    totalUsers,
    totalSubjects,
    totalAssignments,
    activeCohorts,
    dailyActiveUsers: dauCount.length,
    totalActivities
  };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export const sendNotificationToCohort = async (cohort, title, body) => {
  let whereClause = {};
  if (cohort !== 'ALL') {
    whereClause = { cohortNo: Number(cohort) };
  }

  const users = await prisma.user.findMany({
    where: {
      ...whereClause,
      pushToken: { not: null }
    },
    select: { pushToken: true }
  });

  const tokens = users.map(u => u.pushToken);
  return tokens;
};
