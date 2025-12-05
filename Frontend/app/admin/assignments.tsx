import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { GetAssignmentsByCohort, DeleteAssignment } from "../../api/apiCall";
import AssignmentCard from "../../components/AssignmentCard";

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  isoDate: string;
  displayDate: string;
  link: string;
};

type GroupedAssignments = Record<string, Assignment[]>;

const AdminAssignments = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [groupedAssignments, setGroupedAssignments] = useState<GroupedAssignments>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [cohortFilter, setCohortFilter] = useState("4");

  // Transform API grouped response into clean object
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

  // Load assignments
  const loadAssignments = async () => {
    if (!cohortFilter) return;
    setLoading(true);
    setError("");
    try {
      const data = await GetAssignmentsByCohort(Number(cohortFilter));
      setGroupedAssignments(transformGrouped(data.grouped));
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  }, [cohortFilter]);

  useEffect(() => {
    if (!user?.id) return;
    if (user?.role !== "TEACHER") {
      Alert.alert("Access Denied", "Teacher access required");
      router.replace("/");
      return;
    }
    loadAssignments();
  }, [user?.id, user?.role, cohortFilter]);

  // Edit -> Redirect to form page
  const handleEdit = (a: Assignment) => {
    router.push({
      pathname: "/admin/assignmentForm",
      params: {
        id: a.id,
        title: a.title,
        dueDate: a.isoDate,
        cohortNo: cohortFilter,
        subjectCode: a.subject,
        link: a.link,
      },
    });
  };

  // Delete
  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this assignment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await DeleteAssignment(id);
            Alert.alert("Deleted", "Assignment deleted successfully");
            loadAssignments();
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Failed to delete assignment");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Assignments</Text>
        <TouchableOpacity
          onPress={() => router.push("/admin/assignmentForm")}
          className="px-3 py-2 bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-medium">+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Cohort Filter */}
        <View className="my-4">
          <Text className="text-white text-base font-semibold mb-2">Select Cohort</Text>
          <View className="flex-row items-center justify-between bg-[#1e293b] rounded-xl p-3 border border-white/10">
            <TextInput
              value={cohortFilter}
              onChangeText={setCohortFilter}
              className="text-white flex-1"
              placeholder="Enter cohort number"
              placeholderTextColor="#6B7280"
            />
            <TouchableOpacity
              onPress={loadAssignments}
              className="ml-3 px-3 py-2 bg-blue-600 rounded-lg"
            >
              <Text className="text-white font-medium">Load</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assignment List */}
        <View className="mt-4 mb-6">
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-400 mt-4 text-base">Loading assignments...</Text>
            </View>
          ) : error ? (
            <Text className="text-red-400 text-center">{error}</Text>
          ) : Object.keys(groupedAssignments).length === 0 ? (
            <Text className="text-gray-400">No upcoming assignments</Text>
          ) : (
            Object.entries(groupedAssignments).map(([date, assignments]) => (
              <View key={date} className="mb-6">
                <Text className="text-lg font-semibold text-blue-300 mb-3">{date}</Text>
                {assignments.map((assign) => (
                  <AssignmentCard
                    key={assign.id}
                    title={assign.title}
                    subject={assign.subject}
                    dueDate={assign.displayDate}
                    link={assign.link}
                    isAdmin={true}
                    onEdit={() => handleEdit(assign)}
                    onDelete={() => handleDelete(assign.id)}
                  />
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAssignments;
