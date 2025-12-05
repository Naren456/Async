import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, ArrowLeft } from "lucide-react-native";
import { GetSubjectById } from "@/api/apiCall";
import { useSelector } from "react-redux";
export default function SubjectNotes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: any) => state.user);

  const loadSubject = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await GetSubjectById(id);
      setSubject(data.subject);
    } catch (e: any) {
      setError(e?.message || "Failed to load subject");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubject();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubject();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f172b]">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-4 text-base">Loading notes...</Text>
      </View>
    );
  }

  if (error || !subject) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f172b] p-6">
        <Text className="text-red-400 text-center text-base">
          {error || "Subject not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 py-2 px-6 rounded-lg bg-blue-600 active:opacity-80"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b] px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={22} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">
          {subject.name} ({subject.code})
        </Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Notes List */}
      <FlatList
        data={subject.notes || []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <Text className="text-gray-400 mt-5 mb-3 text-sm">
            Available Notes
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center p-4 mb-3 bg-[#1e293b]/70 rounded-2xl border border-white/10 shadow-sm"
            onPress={() =>
              router.push({
                pathname: "/pdf/[id]",
                params: { id: item.id, url: item.pdfUrl , title: item.title },
              })
            }
          >
            <View className="bg-blue-600/20 p-3 rounded-xl mr-3">
              <FileText size={22} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {item.title}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Tap to open PDF
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-base">
              No notes available for this subject
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
