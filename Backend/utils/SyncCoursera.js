import prisma from "../config/db.js";
import { fetchUpcomingAssignmentsGrouped } from "../utils/icsParser.js";

/**
 * Sync Coursera assignments for a given cohort
 * Adds new assignments and updates existing ones if dueDate or link changes
 */
export async function syncCohortAssignments(cohortNo) {
  console.log(`🔄 Syncing assignments for cohort ${cohortNo}...`);

  try {
    const groupedAssignments = await fetchUpcomingAssignmentsGrouped(cohortNo);
    const assignmentsList = Object.values(groupedAssignments).flat();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    // Prefetch subjects to avoid N+1
    const allSubjects = await prisma.subject.findMany({ select: { code: true, name: true } });
    const subjectMap = new Map(allSubjects.map(s => [s.name.toLowerCase().trim(), s]));
    // Aliases for Coursera ICS naming mismatches
    const alias = {
      "computing systems and performance": "computer systems and performance",
      "network programming & client-server programming": "network programming and client-server programming",
      "software development practices": "software development practices",
    };

    for (const assignment of assignmentsList) {
      const dueDate = new Date(assignment.isoDate);

      // Skip past assignments
      if (dueDate < today) {
        if (process.env.NODE_ENV !== "production") console.log(`⏭ Skipping past assignment '${assignment.title}' with dueDate ${dueDate}`);
        continue;
      }

      // --- Find subject code from Subject table (case-insensitive + alias) ---
      const rawName = (assignment.subject || "").toLowerCase().trim();
      const key = alias[rawName] || rawName;
      const subject = subjectMap.get(key);

      if (!subject) {
        console.warn(`⚠️ Subject not found for assignment "${assignment.title}" → skipping`);
        continue;
      }

      const subjectCode = subject.code;

      // --- Check existing assignment ---
      const existing = await prisma.assignment.findUnique({
        where: {
          title_cohortNo_subjectCode: {
            title: assignment.title,
            cohortNo,
            subjectCode,
          },
        },
      });

      if (existing) {
        // Check if dueDate or link has changed
        const dueDateChanged = existing.dueDate?.toISOString() !== dueDate.toISOString();
        const linkChanged = (existing.link || "") !== (assignment.link || "");

        if (dueDateChanged || linkChanged) {
          console.log(`📝 Updating assignment '${assignment.title}'`);
          await prisma.assignment.update({
            where: { id: existing.id },
            data: {
              dueDate,
              link: assignment.link || "",
            },
          });
        } else {
          console.log(`ℹ️ Assignment "${assignment.title}" already up-to-date → skipping`);
        }
      } else {
        // --- Add new assignment ---
        console.log(`➕ Adding new assignment '${assignment.title}'`);
        await prisma.assignment.create({
          data: {
            title: assignment.title,
            dueDate,
            cohortNo,
            link: assignment.link || "",
            subjectCode,
          },
        });
      }
    }

    console.log(`✅ Finished syncing cohort ${cohortNo}`);
  } catch (err) {
    console.error(`❌ Error syncing cohort ${cohortNo}:`, err);
  }
}

/** --- Main sync for all cohorts --- */
export async function main({ exitAfterSync = true } = {}) {
  const cohortsToSync = [4, 6]; // Add more cohorts if needed
  for (const cohort of cohortsToSync) {
    await syncCohortAssignments(cohort);
  }
  console.log("🌟 All cohorts synced!");
  if (exitAfterSync) process.exit(0);
}


