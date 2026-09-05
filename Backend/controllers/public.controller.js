import prisma from "../config/db.js";

// Aggregate-only data intended for the public landing page. Never expose user records here.
export const getLandingStats = async (_req, res) => {
  try {
    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 30);

    const [activeUsers, registeredUsers] = await Promise.all([
      prisma.userActivity.groupBy({
        by: ["userId"],
        where: { createdAt: { gte: activeSince } },
      }),
      prisma.user.count(),
    ]);

    // This endpoint is safe to cache briefly; it only returns aggregate counts.
    res.set("Cache-Control", "public, max-age=300");
    res.json({
      activeUsers: activeUsers.length,
      activeWindowDays: 30,
      registeredUsers,
    });
  } catch (error) {
    console.error("Error fetching landing stats:", error);
    res.status(500).json({ message: "Unable to fetch landing statistics" });
  }
};
