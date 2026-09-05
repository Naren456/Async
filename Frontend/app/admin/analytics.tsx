import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Activity, Grid } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const AdminAnalytics = () => {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Dynamic import to avoid cycles if any, or just standard import
      const { GetAdminStats } = await import("../../api/apiCall");
      const data = await GetAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, icon }: any) => (
    <View className="bg-[#101216] p-5 rounded-xl border border-white/10 mb-4 w-[48%]">
       <View className={`w-10 h-10 rounded-full items-center justify-center mb-3`} style={{ backgroundColor: color + '20' }}>
         {icon}
       </View>
       <Text className="text-gray-400 text-xs font-medium mb-1">{title}</Text>
       <Text className="text-white text-2xl font-bold">{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10 bg-[#101216]/80">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Analytics Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="mt-20 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-400 mt-4">Loading insights...</Text>
          </View>
        ) : (
          <>
            <View className="mb-6">
               <Text className="text-lg font-bold text-white mb-4">User Engagement (Today)</Text>
               <View className="flex-row flex-wrap justify-between">
                  <StatCard 
                    title="Daily Active Users" 
                    value={stats?.dailyActiveUsers || 0} 
                    color="#10B981" 
                    icon={<Users size={20} color="#10B981"/>} 
                  />
                  <StatCard 
                    title="Total App Opens" 
                    value={stats?.totalActivities || 0} 
                    color="#3B82F6" 
                    icon={<Activity size={20} color="#3B82F6"/>} 
                  />
               </View>
            </View>

            <View className="bg-[#101216] p-5 rounded-xl border border-white/10 mb-6">
               <Text className="text-white font-semibold mb-2">Engagement Rate</Text>
               <View className="flex-row items-end">
                   <Text className="text-4xl font-bold text-yellow-400">
                     {stats?.dailyActiveUsers ? (stats.totalActivities / stats.dailyActiveUsers).toFixed(1) : 0}
                   </Text>
                   <Text className="text-gray-400 mb-2 ml-2">opens / user</Text>
               </View>
               <Text className="text-gray-500 text-xs mt-2">Average number of times a user opens the app daily.</Text>
            </View>
            
            <View className="mb-6">
               <Text className="text-lg font-bold text-white mb-4">Overall Growth</Text>
               <View className="flex-row flex-wrap justify-between">
                  <StatCard 
                    title="Total Users" 
                    value={stats?.totalUsers || 0} 
                    color="#8B5CF6" 
                    icon={<Users size={20} color="#8B5CF6"/>} 
                  />
                  <StatCard 
                    title="Cohorts" 
                    value={stats?.activeCohorts || 0} 
                    color="#EC4899" 
                    icon={<Grid size={20} color="#EC4899"/>} 
                  />
               </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAnalytics;


