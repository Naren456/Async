import prisma from "../config/db.js";

export const savePushSubscription = async (req, res) => {
  try {
    const { subscription, source } = req.body || {};
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ message: "A valid Web Push subscription is required" });
    }

    await prisma.webPushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth, source: source || "unknown" },
      create: { endpoint, p256dh, auth, source: source || "unknown" },
    });

    return res.status(201).json({ message: "Push subscription saved" });
  } catch (error) {
    console.error("Error saving web push subscription:", error);
    return res.status(500).json({ message: "Unable to save push subscription" });
  }
};

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
