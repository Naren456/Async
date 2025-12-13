import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  Clock,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import AssignmentCard from "../../components/AssignmentCard";
import StatCard from "../../components/StatCard";
import { GetAssignmentsByCohort } from "../../api/apiCall";
import { scheduleAssignmentNotifications } from "../../utils/notificationScheduler";

// --- Types ---
export type Assignment = {
  id: string;
  title: string;
  subject: string;
  isoDate: string;
  displayDate: string;
  link: string;
};

type GroupedAssignments = Record<string, Assignment[]>;

// --- Helper: get next deadline ---
export const nextDeadlineAssignments = (grouped: GroupedAssignments) => {
  if (!grouped || Object.keys(grouped).length === 0) return [];

  const parseDate = (dateStr: string) => {
    const [day, monthStr, year] = dateStr.split("-");
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return new Date(Number(year), monthMap[monthStr], Number(day));
  };

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => parseDate(a).getTime() - parseDate(b).getTime()
  );

  // Return the earliest date’s assignments
  const nextDate = sortedDates[0];
  return grouped[nextDate] || [];
};

// --- Transform API response ---
const transformGrouped = (grouped: any): GroupedAssignments => {
  const result: GroupedAssignments = {};
  Object.entries(grouped || {}).forEach(([date, items]: any) => {
    result[date] = (items as any[]).map((a: any) => {
      const iso = a.dueDate ? new Date(a.dueDate).toISOString() : "";
      const display = a.dueDate
        ? new Date(a.dueDate).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No due date";

      return {
        id: a.id,
        title: a.title,
        subject: a.subject?.name || a.subject?.code || "Subject",
        link: a.link || "",
        isoDate: iso,
        displayDate: display,
      } as Assignment;
    });
  });
  return result;
};

const UserDashboard = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [assgin, Setassign] = useState(0)
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalAssignments: 0,
    upcomingDeadlines: 0,
    cpg: 0,
    trends: { subjects: 0, assignments: 0, deadlines: 0, cpg: 0 },
  });
  const [groupedAssignments, setGroupedAssignments] = useState<GroupedAssignments>({});
  const [nextAssignments, setNextAssignments] = useState<Assignment[]>([]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Dummy stats (replace with actual API data if needed)
      setStats({
        totalSubjects: 3,
        totalAssignments: 12,
        upcomingDeadlines: 3,
        cpg: 8.5, // Example value
        trends: { subjects: 1, assignments: -2, deadlines: 0, cpg: 1 },
      });

      if (!user?.cohortNo) return;

      const data = await GetAssignmentsByCohort(user.cohortNo);
      Setassign(data.count)
      const grouped = transformGrouped(data.grouped);
      setGroupedAssignments(grouped);

      const next = nextDeadlineAssignments(grouped);
      setNextAssignments(next);

      // Schedule local notifications for these assignments
      await scheduleAssignmentNotifications(Object.values(grouped).flat());
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?.cohortNo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [user?.cohortNo]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0f172b] items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-4">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      {/* Header */}
      <View className="px-5 py-4 border-b border-white/10 bg-[#1e293b]/80">
        <Text className="text-2xl font-bold text-white">Hello, {user?.name}</Text>
        <View className="flex-row items-center mt-1">
          <Clock size={14} color="#60A5FA" />
          <Text className="text-gray-400 text-sm ml-2">Welcome back!</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} tintColor="#3B82F6" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-white mb-4">Your Stats</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%]">
              <StatCard
                title="Subjects"
                value={stats.totalSubjects}
                icon={<BookOpen size={26} color="#10B981" />}
                color="#10B981"
              />
            </View>
            <View className="w-[48%]">
              <StatCard
                title="Assignments"
                value={assgin}
                icon={<ClipboardList size={26} color="#F59E0B" />}
                color="#F59E0B"
              />
            </View>
            <View className="w-[48%]">
              <StatCard
                title="Deadlines"
                value={nextAssignments.length}
                icon={<Calendar size={26} color="#3B82F6" />}
                color="#3B82F6"
              />
            </View>
            <View className="w-[48%]">
              <StatCard
                title="CGR"
                value={user?.cgr || 'N/A'}
                icon={<GraduationCap size={26} color="#F472B6" />}
                color="#F472B6"
              />
            </View>
          </View>
        </View>

        {/* Next Deadline Section */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-white mb-4">Upcoming Deadline</Text>
          {nextAssignments.length === 0 ? (
            <Text className="text-gray-400 text-base px-2">No upcoming assignments</Text>
          ) : (
            nextAssignments.map((assign) => (
              <View
                key={assign.id}
                className="mb-4 rounded-xl bg-[#1e293b]/60 border border-white/10 p-4"
              >
                <AssignmentCard
                  title={assign.title}
                  subject={assign.subject}
                  dueDate={assign.displayDate}
                  link={assign.link}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDashboard;
