import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { GetUserSubjectsWithNotes } from '../../api/apiCall';
import { BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Note = { id: string; title: string; pdfUrl: string };
type SubjectWithNotes = {
  code: string;
  name: string;
  semester?: number;
  term?: number;
  notes: Note[];
};

const UserNotes = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [subjects, setSubjects] = useState<SubjectWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [selectedTerm, setSelectedTerm] = useState<number | undefined>();
  const [semModalVisible, setSemModalVisible] = useState(false);
  const [termModalVisible, setTermModalVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    setError(null);
    try {
      const data = await GetUserSubjectsWithNotes(
        user?.id,
        selectedSemester !== undefined && selectedTerm !== undefined
          ? { semester: selectedSemester, term: selectedTerm }
          : {}
      );
      setSubjects(data.subjects || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load notes');
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, selectedSemester, selectedTerm]);

  // Initialize filters from user
  useEffect(() => {
    if (user?.id) {
      setSelectedSemester((prev) => prev ?? user?.semester);
      setSelectedTerm((prev) => prev ?? user?.term);
    }
  }, [user?.id]);

  // Fetch subjects
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await GetUserSubjectsWithNotes(
          user?.id,
          selectedSemester !== undefined && selectedTerm !== undefined
            ? { semester: selectedSemester, term: selectedTerm }
            : {}
        );
        setSubjects(data.subjects || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, selectedSemester, selectedTerm]);

  const sortedSubjects = useMemo(() => {
    return [...(subjects || [])].sort((a, b) => {
      const semDiff = (a.semester ?? 0) - (b.semester ?? 0);
      if (semDiff !== 0) return semDiff;
      const termDiff = (a.term ?? 0) - (b.term ?? 0);
      if (termDiff !== 0) return termDiff;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    if (selectedSemester !== undefined && selectedTerm !== undefined) {
      return sortedSubjects.filter(
        (s) => s.semester === selectedSemester && s.term === selectedTerm
      );
    }
    return sortedSubjects;
  }, [sortedSubjects, selectedSemester, selectedTerm]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#08090B] items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-3">Loading notes...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#08090B] items-center justify-center p-4">
        <Text className="text-red-400 text-center">{error}</Text>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView className="flex-1 bg-[#08090B] px-4">
      <View className="flex-row items-center mt-4 mb-6">
        <BookOpen size={24} color="#60A5FA" />
        <Text className="text-2xl font-bold text-white ml-2">My Notes</Text>
      </View>

      {/* Filters */}
      <View className="flex-row mb-5">
        <TouchableOpacity
          className="flex-1 mr-2 py-3 px-4 rounded-xl bg-[#101216] border border-white/10"
          onPress={() => setSemModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-sm">Semester</Text>
          <Text className="text-white text-base mt-1">
            {selectedSemester ?? 'All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 ml-2 py-3 px-4 rounded-xl bg-[#101216] border border-white/10"
          onPress={() => setTermModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-sm">Term</Text>
          <Text className="text-white text-base mt-1">
            {selectedTerm ?? 'All'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={(item) => item.code}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3B82F6']}
                tintColor="#3B82F6"
            />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 mb-3 bg-[#101216] rounded-2xl border border-white/10"
            activeOpacity={0.8}
            onPress={() =>
              router.push({ pathname: '/note/[id]', params: { id: item.code } })
            }
          >
            <Text className="text-gray-100 text-lg font-semibold">
              {item.name}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Sem {item.semester} • Term {item.term} • {item.code}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              {item.notes?.length || 0} notes available
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-6">
            No subjects found
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Semester Modal */}
      <Modal
        visible={semModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSemModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#08090B] p-5 rounded-t-3xl border-t border-white/10 max-h-[60%]">
            <Text className="text-white text-lg font-semibold mb-4">
              Select Semester
            </Text>
            <ScrollView>
              <TouchableOpacity
                className="py-3 border-b border-white/5"
                onPress={() => {
                  setSelectedSemester(undefined);
                  setSemModalVisible(false);
                }}
              >
                <Text className="text-gray-200">All</Text>
              </TouchableOpacity>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <TouchableOpacity
                  key={n}
                  className="py-3 border-b border-white/5"
                  onPress={() => {
                    setSelectedSemester(n);
                    setSemModalVisible(false);
                  }}
                >
                  <Text className="text-gray-200">Semester {n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Term Modal */}
      <Modal
        visible={termModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTermModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#08090B] p-5 rounded-t-3xl border-t border-white/10 max-h-[40%]">
            <Text className="text-white text-lg font-semibold mb-4">
              Select Term
            </Text>
            <ScrollView>
              <TouchableOpacity
                className="py-3 border-b border-white/5"
                onPress={() => {
                  setSelectedTerm(undefined);
                  setTermModalVisible(false);
                }}
              >
                <Text className="text-gray-200">All</Text>
              </TouchableOpacity>
              {[1, 2].map((n) => (
                <TouchableOpacity
                  key={n}
                  className="py-3 border-b border-white/5"
                  onPress={() => {
                    setSelectedTerm(n);
                    setTermModalVisible(false);
                  }}
                >
                  <Text className="text-gray-200">Term {n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserNotes;
