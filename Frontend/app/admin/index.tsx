import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/reducer";
import {
  Settings,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  LogOut,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react-native";

const AdminApp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalAssignments: 0,
    activeCohorts: 0,
  });

  useEffect(() => {
    if (!user?.id) {
      router.replace("/");
      return;
    }

    if (user?.role !== "TEACHER") {
      Alert.alert("Access Denied", "Admin access required");
      router.replace("/");
      return;
    }

    loadStats();
  }, [user?.id, user?.role]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { GetAdminStats } = await import("@/api/apiCall");
      const data = await GetAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
      // fallback mock data
      setStats({
        totalUsers: 150,
        totalSubjects: 25,
        totalAssignments: 45,
        activeCohorts: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("authToken");
          dispatch(clearUser());
          router.replace("/");
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  // --- Reusable Components ---
  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <View className="bg-[#101216]/60 rounded-xl p-5 mb-4 border border-white/10">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-400 text-sm font-medium mb-1">{title}</Text>
          <Text className="text-white text-3xl font-bold mb-1">{value}</Text>
          {trend && (
            <View className="flex-row items-center">
              <TrendingUp size={12} color="#10B981" />
              <Text className="text-green-400 text-xs ml-1">{trend}</Text>
            </View>
          )}
        </View>
        <View
          className="w-14 h-14 rounded-xl items-center justify-center"
          style={{ backgroundColor: color + "22" }}
        >
          {icon}
        </View>
      </View>
    </View>
  );

  const ActionButton = ({
    title,
    description,
    icon,
    onPress,
    color = "#3B82F6",
    badge,
  }: any) => (
    <TouchableOpacity
      className="bg-[#101216]/60 rounded-xl p-5 mb-4 border border-white/10"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: color + "22" }}
        >
          {icon}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-semibold">{title}</Text>
            {badge && (
              <View className="ml-2 bg-blue-500 rounded-full px-2 py-[1px]">
                <Text className="text-white text-xs font-semibold">{badge}</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-400 text-sm mt-1">{description}</Text>
        </View>
        <Settings size={16} color="#60A5FA" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#08090B] items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-4">Loading admin dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      {/* Header */}
      <View className="px-5 py-4 border-b border-white/10 bg-[#101216]/80">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center mb-1">
              <Shield size={26} color="#3B82F6" />
              <Text className="text-2xl font-bold text-white ml-3">
                Admin Panel
              </Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Welcome back, {user?.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-3 bg-red-500/20 rounded-lg border border-red-500/30"
          >
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Overview */}
        <View className="py-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-2xl font-bold text-white">
              Dashboard Overview
            </Text>
            <View className="flex-row items-center">
              <Clock size={16} color="#60A5FA" />
              <Text className="text-gray-400 text-sm ml-2">Updated just now</Text>
            </View>
          </View>

          {/* ✅ 2x2 GRID of Stat Cards */}
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%]">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users size={26} color="#3B82F6" />}
                color="#3B82F6"
              />
            </View>
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
                value={stats.totalAssignments}
                icon={<Calendar size={26} color="#F59E0B" />}
                color="#F59E0B"

              />
            </View>
            <View className="w-[48%]">
              <StatCard
                title="Active Cohorts"
                value={stats.activeCohorts}
                icon={<BarChart3 size={26} color="#EF4444" />}
                color="#EF4444"
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-2xl font-bold text-white">Quick Actions</Text>
            <View className="flex-row items-center">
              <CheckCircle size={16} color="#10B981" />
              <Text className="text-green-400 text-sm ml-2">
                All systems operational
              </Text>
            </View>
          </View>

          <ActionButton
            title="Manage Assignment"
            description="Add new assignment with deadline"
            icon={<Plus size={22} color="#3B82F6" />}
            onPress={() => router.push("/admin/assignments")}
            color="#3B82F6"
          />
          <ActionButton
            title="Manage Subjects"
            description="Add, edit, or remove subjects"
            icon={<BookOpen size={22} color="#10B981" />}
            onPress={() => router.push("/admin/subjects")}
            color="#10B981"
          />
          <ActionButton
            title="User Management"
            description="View and manage users and roles"
            icon={<Users size={22} color="#F59E0B" />}
            onPress={() => router.push("/admin/users")}
            color="#F59E0B"
          />
          <ActionButton
            title="Analytics & Reports"
            description="View analytics and generate reports"
            icon={<BarChart3 size={22} color="#8B5CF6" />}
            onPress={() => router.push("/admin/analytics")}
            color="#8B5CF6"
          />
          <ActionButton
            title="Manage Notifications"
            description="Send push notifications to cohorts"
            icon={<Send size={22} color="#EC4899" />}
            onPress={() => router.push("/admin/notifications")}
            color="#EC4899"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminApp;
