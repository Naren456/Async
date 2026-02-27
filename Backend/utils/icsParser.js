// utils/icsParser.js
import ICAL from "ical.js";

/** --- Helper: Format Date + Time to dd-MMM-yyyy hh:mm AM/PM --- */
function formatDateTimeToDisplay(date) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", "");
}

/** --- Helper: Combine date + time strings to Date object --- */
function parseDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

/** --- Get ICS URL by cohort --- */
export function getICSUrl(cohort) {
  const urls = {
    4: "https://www.coursera.org/api/rest/v1/learnercalendars/160556499/47ab0fcb-d665-4c61-b120-9362820ca5ba",
    6: "https://www.coursera.org/api/rest/v1/learnercalendars/188822892/bbc0b1b4-9a1f-4e0b-b6c0-bdd688246cf7",
  };

  return urls[cohort] ?? null;
}

/** --- Parse ICS text to Assignment[] --- */
export function parseICSText(text) {
  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  // Only assignment-like events
  const assignmentEvents = events.filter((event) => {
    const vevent = new ICAL.Event(event);
    const desc = vevent.description || "";
    return /you have \d+ item[s]? due/i.test(desc);
  });

  return assignmentEvents.map((event, idx) => {
    const vevent = new ICAL.Event(event);
    const dueDateObj = vevent.startDate.toJSDate();

    const lines = (vevent.description || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const summaryParts = (vevent.summary || "").split("--");
    const subject = summaryParts[1]?.trim() || summaryParts[0]?.trim() || "Unknown Subject";

    const link = lines.find((l) => l.startsWith("http")) || "";

    const titleLineIndex = lines.findIndex((l) =>
      /you have \d+ item[s]? due/i.test(l)
    );
    const title =
      (titleLineIndex !== -1 && lines[titleLineIndex + 1]
        ? lines[titleLineIndex + 1].replace(/^- /, "").trim()
        : vevent.summary) || "Untitled Assignment";

    return {
      id: vevent.uid || idx.toString(),
      title,
      subject,
      link,
      isoDate: dueDateObj.toISOString(),                  // for sorting/filtering
      displayDate: formatDateTimeToDisplay(dueDateObj),  // for UI
    };
  });
}

/** --- Filter upcoming assignments within next N days --- */
export function filterUpcomingAssignments(assignments, days = 90) {
  const now = new Date();
  const end = new Date();
  end.setDate(now.getDate() + days);

  return assignments
    .filter(a => {
      const dt = new Date(a.isoDate);
      return dt >= now && dt <= end;
    })
    .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
}

/** --- Group assignments by displayDate --- */
export function groupAssignmentsByDate(assignments) {
  const grouped = {};

  assignments.forEach(a => {
    if (!grouped[a.displayDate]) grouped[a.displayDate] = [];
    grouped[a.displayDate].push(a);
  });

  // Sort groups by first assignment datetime
  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([, a1], [, a2]) => new Date(a1[0].isoDate).getTime() - new Date(a2[0].isoDate).getTime()
    )
  );
}

/** --- Fetch ICS → Parse → Filter → Group --- */
export async function fetchUpcomingAssignmentsGrouped(cohort , days = 90) {
  try {
    const url = getICSUrl(cohort);
    console.log(url);
    if (!url) return {};

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch ICS");

    const text = await response.text();
    const parsed = parseICSText(text);
    const upcoming = filterUpcomingAssignments(parsed, days);
    console.log(upcoming);
    return groupAssignmentsByDate(upcoming);
  } catch (err) {
    console.error("Error fetching ICS:", err);
    return {};
  }
}




