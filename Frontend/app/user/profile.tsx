import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Edit3, LogOut, User, ChevronRight } from "lucide-react-native";
import { UpdateProfile } from "../../api/apiCall";
import { setUser, clearUser } from "../../store/reducer";
import ProfileSection from "../../components/ProfileSection";
import ProfileItem from "../../components/ProfileItem";
import EditProfileModal from "../../components/EditProfileModal";

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCohortNo, setEditCohortNo] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editTerm, setEditTerm] = useState('');
  const [editCgr, setEditCgr] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditCohortNo(user.cohortNo !== null && user.cohortNo !== undefined ? String(user.cohortNo) : '');
      setEditSemester(user.semester !== null && user.semester !== undefined ? String(user.semester) : '');
      setEditTerm(user.term !== null && user.term !== undefined ? String(user.term) : '');
      setEditCgr(user.cgr !== null && user.cgr !== undefined ? String(user.cgr) : '');
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await SecureStore.deleteItemAsync("authToken");
              dispatch(clearUser());
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditCohortNo(user?.cohortNo !== null && user?.cohortNo !== undefined ? String(user?.cohortNo) : '');
    setEditSemester(user?.semester !== null && user?.semester !== undefined ? String(user?.semester) : '');
    setEditTerm(user?.term !== null && user?.term !== undefined ? String(user?.term) : '');
    setEditCgr(user?.cgr !== null && user?.cgr !== undefined ? String(user?.cgr) : '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const updatedData = {
        name: data.name,
        email: data.email,
        cohortNo: data.cohortNo ? Number(data.cohortNo) : null,
        semester: data.semester ? Number(data.semester) : null,
        term: data.term ? Number(data.term) : null,
        cgr: data.cgr && data.cgr.trim() ? Number(data.cgr.trim()) : null,
      };
      const response = await UpdateProfile(updatedData);
      dispatch(setUser({ user: response.user, token: user.token }));
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (e: any) {
      console.error("Error updating profile:", e);
      Alert.alert("Error", e.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-white">Profile</Text>
          <Text className="text-gray-400 mt-2">Manage your account settings</Text>
        </View>

        {/* User Info Section */}
        <ProfileSection title="ACCOUNT">
          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-blue-600/20 items-center justify-center mr-4 overflow-hidden">
                {user?.profilePic ? (
                  <Image source={{ uri: user.profilePic }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                ) : (
                  <User size={32} color="#3B82F6" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-semibold">
                  {user?.name || 'Guest User'}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {user?.email || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity
                className="p-2 rounded-full bg-blue-600/20"
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Edit3 size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>



            <View className="flex-row flex-wrap justify-between mt-6 border-t border-white/10 pt-6">
              <View className="w-[48%] bg-[#1e293b] p-4 rounded-xl mb-4 border border-white/5">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cohort</Text>
                <Text className="text-white text-xl font-bold">{user?.cohortNo || 'N/A'}</Text>
              </View>
              <View className="w-[48%] bg-[#1e293b] p-4 rounded-xl mb-4 border border-white/5">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Semester</Text>
                <Text className="text-white text-xl font-bold">{user?.semester || 'N/A'}</Text>
              </View>
              <View className="w-[48%] bg-[#1e293b] p-4 rounded-xl border border-white/5">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Term</Text>
                <Text className="text-white text-xl font-bold">{user?.term || 'N/A'}</Text>
              </View>
              <View className="w-[48%] bg-[#1e293b] p-4 rounded-xl border border-white/5">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">CGR</Text>
                <Text className="text-white text-xl font-bold">{user?.cgr || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </ProfileSection>






        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600/20 border border-red-600/30 rounded-xl p-4 mb-8"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-center">
            <LogOut size={20} color="#EF4444" />
            <Text className="text-red-400 font-semibold ml-2">
              {isLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
        isLoading={isLoading}
        initialValues={{
          name: editName,
          email: editEmail,
          cohortNo: editCohortNo,
          semester: editSemester,
          term: editTerm,
          cgr: editCgr,
        }}
      />
    </SafeAreaView>
  );
};

export default UserProfile;
