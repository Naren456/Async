import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
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
import { Toast } from "../../components/Toast";
import useFeedback from "../../hooks/useFeedback";
import { DataManager } from "../../utils/DataManager";
import { scheduleAssignmentNotifications } from "../../utils/notificationScheduler";
import { toggleAssignmentCompletion } from "../../api/services/assignmentService";
import { GetAssignmentsByCohort } from "../../api/apiCall";

// --- Types ---
export type Assignment = {
  id: string;
  title: string;
  subject: string;
  isoDate: string;
  displayDate: string;
  link: string;
  Completed: boolean;
};

type GroupedAssignments = Record<string, Assignment[]>;

// --- Helper: Sort grouped assignments ---
export const sortGroupedAssignments = (grouped: GroupedAssignments, limitToFirstDate: boolean = false) => {
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

  if (limitToFirstDate && sortedDates.length > 0) {
    return grouped[sortedDates[0]] || [];
  }

  return sortedDates.flatMap(date => grouped[date] || []);
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
        Completed: a.Completed || false
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
  const [totalDeadlines, setTotalDeadlines] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { playSuccessSound } = useFeedback();
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "info" });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

const handleToggleComplete = async (assignmentId: string) => {
  try {
    // 1. Find if we are completing it
    const currentItem = nextAssignments.find(a => a.id === assignmentId);
    const isCompleting = currentItem ? !currentItem.Completed : false;

    // 2. Optimistic update for nextAssignments
    setNextAssignments((prev) => 
      prev.map((item) => 
        item.id === assignmentId ? { ...item, Completed: !item.Completed } : item
      )
    );
    
    if (isCompleting) {
      showToast("Assignment Completed! Great job!", "success");
      playSuccessSound();
    }
    
    // Update cache so other screens see the change
    await DataManager.updateAssignmentCompletion(user.cohortNo, assignmentId, isCompleting);

    await toggleAssignmentCompletion(assignmentId);
  } catch (err) {
    showToast("Failed to update status", "error");
    loadDashboard(); // Revert on error
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const loadDashboard = async () => {
    if (!user?.cohortNo) return;
    
    // 1. Try to load from cache first
    let hasLoadedFromCache = false;
    try {
      const cached = await DataManager.getAssignments(user.cohortNo);
      if (cached) {
        // Calculate count from cached grouped data
        const totalCount = Object.values(cached).reduce((acc: number, list: any) => acc + list.length, 0);
        
        Setassign(totalCount);
        const grouped = transformGrouped(cached);
        setGroupedAssignments(grouped);
        
        hasLoadedFromCache = true;
      }
    } catch (cacheErr) {
      console.log("Home cache load error:", cacheErr);
    }

    // Show loading if cache missed AND we are past the initial load timer
    if (!hasLoadedFromCache && !isInitialLoading) {
      setLoading(true);
    }

    try {
      // Dummy stats (replace with actual API data if needed)
      setStats({
        totalSubjects: 3,
        totalAssignments: 12,
        upcomingDeadlines: 3,
        cpg: 8.5, // Example value
        trends: { subjects: 1, assignments: -2, deadlines: 0, cpg: 1 },
      });

      const freshData = await DataManager.syncAssignments(user.cohortNo);
      if (freshData) {
        // Calculate count from fresh data (which is grouped from DataManager)
        const totalCount = Object.values(freshData).reduce((acc: number, list: any) => acc + list.length, 0);
        Setassign(totalCount);
        
        const grouped = transformGrouped(freshData);
        setGroupedAssignments(grouped);
      }

      // Fetch ONLY upcoming assignments using the API
      const upcomingData = await GetAssignmentsByCohort(user.cohortNo, "upcoming");
      if (upcomingData && upcomingData.grouped) {
        const upcomingGrouped = transformGrouped(upcomingData.grouped);
        const allUpcoming = sortGroupedAssignments(upcomingGrouped);
        const firstDateUpcoming = sortGroupedAssignments(upcomingGrouped, true);
        
        setNextAssignments(firstDateUpcoming);
        setTotalDeadlines(allUpcoming.length);

        // Schedule local notifications for these upcoming assignments
        await scheduleAssignmentNotifications(allUpcoming);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?.cohortNo]);

  // Sync state from cache when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadFromCache = async () => {
        if (!user?.cohortNo) return;
        try {
          const cached = await DataManager.getAssignments(user.cohortNo);
          if (cached) {
            const totalCount = Object.values(cached).reduce((acc: number, list: any) => acc + list.length, 0);
            Setassign(totalCount);
            const grouped = transformGrouped(cached);
            setGroupedAssignments(grouped);
          }
        } catch (err) {}
      };
      loadFromCache();
      
      // Also silently fetch upcoming assignments to keep it fresh
      if (user?.cohortNo) {
        GetAssignmentsByCohort(user.cohortNo, "upcoming").then(data => {
          if (data && data.grouped) {
            const upcomingGrouped = transformGrouped(data.grouped);
            setNextAssignments(sortGroupedAssignments(upcomingGrouped, true));
            setTotalDeadlines(sortGroupedAssignments(upcomingGrouped).length);
          }
        }).catch(() => {});
      }
    }, [user?.cohortNo])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [user?.cohortNo]);

  // Initial Loading View (5 seconds)
  if (isInitialLoading || loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#08090B] items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-4">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      {/* Header */}
      <View className="px-5 py-4 border-b border-white/10 bg-[#101216]/80">
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
                value={totalDeadlines}
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
        <View className="py-6 mb-20">
          <Text className="text-2xl font-bold text-white mb-4">Upcoming Assignments</Text>
          {nextAssignments.length === 0 ? (
            <Text className="text-gray-400 text-base px-2">No upcoming assignments</Text>
          ) : (
            nextAssignments.map((assign) => (
              <View
                key={assign.id}
                className="mb-4 rounded-xl bg-[#101216]/60 border border-white/10 p-4"
              >
                <AssignmentCard
                  title={assign.title}
                  subject={assign.subject}
                  dueDate={assign.displayDate}
                  link={assign.link}
                  Completed={assign.Completed}
                  onToggleComplete={() => handleToggleComplete(assign.id)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};



export default UserDashboard;
