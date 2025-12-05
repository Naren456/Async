import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react-native';
import { GetSubjects, DeleteSubject } from '@/api/apiCall';
import FilterBar from '../../components/FilterBar';
import SubjectCard from '../../components/SubjectCard';
import SemesterModal from '../../components/SemesterModel';
import TermModal from '../../components/TermModal';

type Subject = {
  code: string;
  name: string;
  semester: number;
  term: number;
};

const AdminSubjects = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [semModalVisible, setSemModalVisible] = useState(false);
  const [termModalVisible, setTermModalVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [selectedTerm, setSelectedTerm] = useState<number | undefined>();

  useEffect(() => {
    if (!user?.id) return;
    if (user?.role !== 'TEACHER') {
      Alert.alert('Access Denied', 'Admin access required');
      router.replace('/');
      return;
    }
    loadSubjects();
  }, [user?.id, user?.role]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await GetSubjects();
      setSubjects(data.subjects || []);
    } catch {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this subject?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await DeleteSubject(code);
            Alert.alert('Deleted', 'Subject deleted successfully');
            loadSubjects();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEdit = (subject: Subject) => {
    router.push({
      pathname: '/admin/subjectForm',
      params: {
        code: subject.code,
        name: subject.name,
        semester: String(subject.semester),
        term: String(subject.term),
        editMode: 'true',
      },
    });
  };

  const handleViewNote = (subject: Subject) => {
    router.push({
      pathname: '/note/[id]',
      params: {
         id: subject.code ,
        subjectCode: subject.code,
        subjectName: subject.name,
      },
    });
  };

   const handleUploadNote = (subject: Subject) => {
    router.push({
      pathname: '/admin/uploadNotes',
      params: {
        subjectCode: subject.code,
        subjectName: subject.name,
      },
    });
  };

  const filteredSubjects = subjects.filter((s) => {
    if (selectedSemester && s.semester !== selectedSemester) return false;
    if (selectedTerm && s.term !== selectedTerm) return false;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b] px-5">
      {/* Header */}
      <View className="flex-row items-center justify-between py-5 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Subjects</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Add New Button */}
      <TouchableOpacity
        onPress={() => router.push('/admin/subjectForm')}
        className="py-3 my-5 bg-blue-600 rounded-xl shadow-md active:opacity-80"
      >
        <Text className="text-white text-center font-semibold text-base">
          + Add New Subject
        </Text>
      </TouchableOpacity>

      {/* Filter Bar */}
      <FilterBar
        selectedSemester={selectedSemester}
        selectedTerm={selectedTerm}
        onSemesterPress={() => setSemModalVisible(true)}
        onTermPress={() => setTermModalVisible(true)}
      />

      {/* Subject List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
       <FlatList
  data={filteredSubjects}
  keyExtractor={(item) => item.code}
  renderItem={({ item }) => (
    <SubjectCard
      subject={item}
      mode={"admin"}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.code)}
      handlePress={() => handleViewNote(item)}
      onAddNote={()=> handleUploadNote(item)}
    />
  )}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-10 text-base">
              No subjects found
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modals */}
      <SemesterModal 
        visible={semModalVisible}
        onClose={() => setSemModalVisible(false)}
        onSelect={setSelectedSemester}
      />
      <TermModal
        visible={termModalVisible}
        onClose={() => setTermModalVisible(false)}
        onSelect={setSelectedTerm}
      />
    </SafeAreaView>
  );
};

export default AdminSubjects;
