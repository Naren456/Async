import React, { useState, useEffect } from 'react';
import { View, Text, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
  initialValues: {
    name: string;
    email: string;
    cohortNo: string;
    semester: string;
    term: string;
    cgr: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onSave, isLoading, initialValues }) => {
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCohortNo, setEditCohortNo] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editTerm, setEditTerm] = useState('');
  const [editCgr, setEditCgr] = useState('');

  useEffect(() => {
    if (visible) {
      setEditName(initialValues.name);
      setEditEmail(initialValues.email);
      setEditCohortNo(initialValues.cohortNo);
      setEditSemester(initialValues.semester);
      setEditTerm(initialValues.term);
      setEditCgr(initialValues.cgr);
    }
  }, [visible, initialValues]);

  const handleSave = () => {
    onSave({
      name: editName,
      email: editEmail,
      cohortNo: editCohortNo,
      semester: editSemester,
      term: editTerm,
      cgr: editCgr,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-[#0f172b]">
        <View className="flex-row items-center justify-between p-4 border-b border-white/10">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-400 text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text className="text-blue-400 text-base font-semibold">
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">Email</Text>
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">Cohort Number</Text>
            <TextInput
              value={editCohortNo}
              onChangeText={setEditCohortNo}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your cohort number"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">Semester</Text>
            <TextInput
              value={editSemester}
              onChangeText={setEditSemester}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your semester"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">Term</Text>
            <TextInput
              value={editTerm}
              onChangeText={setEditTerm}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your term"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-2">CGR</Text>
            <TextInput
              value={editCgr}
              onChangeText={setEditCgr}
              className="bg-[#1e293b] text-white rounded-lg px-4 py-3 border border-white/10"
              placeholder="Enter your CGR"
              placeholderTextColor="#6B7280"
              keyboardType="decimal-pad"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfileModal;
