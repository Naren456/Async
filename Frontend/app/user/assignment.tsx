import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AssignmentCard from "../../components/AssignmentCard";
import { DataManager } from "../../utils/DataManager";
import { Toast } from "../../components/Toast";
import useFeedback from "../../hooks/useFeedback";
import { toggleAssignmentCompletion } from "../../api/services/assignmentService";

// --- Local Types ---
export type Assignment = {
  id: string;
  title: string;
  subject: string;
  isoDate: string;
  displayDate: string;
  link: string;
  Completed: boolean; // Match property naming used in mapping
};

type GroupedAssignments = Record<string, Assignment[]>;

const Assignment = () => {
  const cohortNo = useSelector((state: any) => state.user?.cohortNo);
  const [groupedAssignments, setGroupedAssignments] = useState<GroupedAssignments>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playSuccessSound } = useFeedback();
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "info" });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // --- Transform API response to local type ---
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
          Completed: a.Completed || false // Ensure mapping matches your API response field
        } as Assignment;
      });
    });
    return result;
  };

  const loadAssignments = async () => {
    if (!cohortNo) return;
    try {
      const cached = await DataManager.getAssignments(cohortNo);
      if (cached) {
        setGroupedAssignments(transformGrouped(cached));
        setLoading(false); 
      }
    } catch (cacheErr) {
      console.log("Cache load error:", cacheErr);
    }

    try {
      const freshData = await DataManager.syncAssignments(cohortNo);
      if (freshData) {
        setGroupedAssignments(transformGrouped(freshData));
      }
      setError(null);
    } catch (err) {
      console.error("Error loading assignments:", err);
      if (Object.keys(groupedAssignments).length === 0) {
        setError("Failed to load assignments. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortNo != null) {
      loadAssignments();
    }
  }, [cohortNo]);

  // --- FIXED: Optimized Toggle Logic ---
  const handleToggleComplete = async (assignmentId: string) => {
    try {
      // 1. Find if we are completing it (Transition to true)
      const currentItem = Object.values(groupedAssignments).flat().find(a => a.id === assignmentId);
      const isCompleting = currentItem ? !currentItem.Completed : false;

      // 2. Optimistic Update
      setGroupedAssignments((prev) => {
        const newState = { ...prev };
        for (const date in newState) {
          newState[date] = newState[date].map((item) =>
            item.id === assignmentId ? { ...item, Completed: !item.Completed } : item
          );
        }
        return newState;
      });

      if (isCompleting) {
        showToast("Assignment Completed! Great job!", "success");
        playSuccessSound();
      }

      // 3. Persist to API
      await toggleAssignmentCompletion(assignmentId);
    } catch (err) {
      showToast("Failed to update status", "error");
      loadAssignments(); // Rollback on failure
    }
  };



  const onRefresh = useCallback(async () => {
    if (!cohortNo) return;
    setRefreshing(true);
    setError(null);
    try {
      const freshData = await DataManager.syncAssignments(cohortNo);
      if (freshData) {
        setGroupedAssignments(transformGrouped(freshData));
      }
    } catch (err) {
      setError("Failed to refresh assignments.");
    } finally {
      setRefreshing(false);
    }
  }, [cohortNo]);

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b] px-2 mb-18">
      <View className="px-2 py-3 flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-100 tracking-wide">Assignment</Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="px-4 mb-20"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} tintColor="#3B82F6" />
        }
      >
        {loading ? (
          <View className="mx-2 mt-10 flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : error ? (
          <View className="mx-2 mt-10 flex-1 justify-center items-center py-20">
            <Text className="text-red-400 text-base text-center mb-4">{error}</Text>
          </View>
        ) : Object.keys(groupedAssignments).length === 0 ? (
          <Text className="text-gray-400 px-5 text-base">No upcoming assignments</Text>
        ) : (
          Object.entries(groupedAssignments).map(([date, assignments]) => (
            <View key={date} className="mb-6 rounded-xl bg-[#1e293b]/60 border border-white/10 p-4">
              <Text className="text-lg font-semibold text-blue-300 mb-3">{date}</Text>
              {assignments.map((assign: Assignment) => (
                <AssignmentCard
                  key={assign.id}
                  title={assign.title}
                  subject={assign.subject}
                  dueDate={assign.displayDate}
                  link={assign.link}
                  Completed={assign.Completed} // Pass status to card
                  onToggleComplete={() => handleToggleComplete(assign.id)} // Pass handler
                  isAdmin={false}
                />
              ))}
            </View>
          ))
        )}</ScrollView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};



export default Assignment;