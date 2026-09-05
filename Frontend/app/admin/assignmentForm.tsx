import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react-native";
import { useSelector } from "react-redux";
import { CreateAssignment, UpdateAssignment } from "../../api/apiCall";
import DateTimePicker from '@react-native-community/datetimepicker';

const AssignmentForm = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const params = useLocalSearchParams();

  // If id exists, it's edit mode
  const isEdit = !!params.id;

  const [form, setForm] = useState({
    id: params.id as string || "",
    title: params.title as string || "",
    dueDate: params.dueDate as string || new Date().toISOString(),
    openingDate: params.openingDate as string || new Date().toISOString(),
    cohortNo: params.cohortNo as string || "",

    subjectCode: params.subjectCode as string || "",
    link: params.link as string || "",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showOpeningDatePicker, setShowOpeningDatePicker] = useState(false);
  const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(form.dueDate || Date.now()));

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const current = new Date(form.dueDate);
      current.setFullYear(selectedDate.getFullYear());
      current.setMonth(selectedDate.getMonth());
      current.setDate(selectedDate.getDate());
      setForm(f => ({ ...f, dueDate: current.toISOString() }));
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const current = new Date(form.dueDate);
      current.setHours(selectedDate.getHours());
      current.setMinutes(selectedDate.getMinutes());
      setForm(f => ({ ...f, dueDate: current.toISOString() }));
    }
  };

  const onOpeningDateChange = (event: any, selectedDate?: Date) => {
    setShowOpeningDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const current = new Date(form.openingDate);
      current.setFullYear(selectedDate.getFullYear());
      current.setMonth(selectedDate.getMonth());
      current.setDate(selectedDate.getDate());
      setForm(f => ({ ...f, openingDate: current.toISOString() }));
    }
  };

  const onOpeningTimeChange = (event: any, selectedDate?: Date) => {
    setShowOpeningTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const current = new Date(form.openingDate);
      current.setHours(selectedDate.getHours());
      current.setMinutes(selectedDate.getMinutes());
      setForm(f => ({ ...f, openingDate: current.toISOString() }));
    }
  };

  const handleSubmit = async () => {
    const { id, title, dueDate, openingDate, cohortNo, subjectCode, link } = form;
    if (!title || !dueDate || !openingDate || !cohortNo || !subjectCode || !link) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await UpdateAssignment(id, { ...form });
        Alert.alert("Success", "Assignment updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await CreateAssignment({ ...form });
        Alert.alert("Success", "Assignment created successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  const displayDate = new Date(form.dueDate).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">{isEdit ? "Edit Assignment" : "Create Assignment"}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View className="p-4 max-w-2xl mx-auto w-full">
        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
            className="bg-[#101216] text-white rounded-lg px-4 py-3 border border-white/10"
            placeholder="Enter title"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View className="mb-3 flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-gray-300 mb-1">Due Date</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="date" 
                value={form.dueDate.split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    const current = new Date(form.dueDate);
                    current.setFullYear(date.getFullYear());
                    current.setMonth(date.getMonth());
                    current.setDate(date.getDate());
                    setForm(f => ({ ...f, dueDate: current.toISOString() }));
                  }
                }}
                style={{ backgroundColor: '#101216', color: 'white', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', colorScheme: 'dark' }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-[#101216] flex-row items-center justify-between rounded-lg px-4 py-3 border border-white/10"
              >
                <Text className="text-white">
                  {new Date(form.dueDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-gray-300 mb-1">Due Time</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="time" 
                value={new Date(form.dueDate).toTimeString().slice(0,5)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [hours, minutes] = e.target.value.split(':');
                    const current = new Date(form.dueDate);
                    current.setHours(parseInt(hours, 10));
                    current.setMinutes(parseInt(minutes, 10));
                    setForm(f => ({ ...f, dueDate: current.toISOString() }));
                  }
                }}
                style={{ backgroundColor: '#101216', color: 'white', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', colorScheme: 'dark' }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-[#101216] flex-row items-center justify-between rounded-lg px-4 py-3 border border-white/10"
              >
                <Text className="text-white">
                  {new Date(form.dueDate).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Clock size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          
          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={new Date(form.dueDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              themeVariant="dark"
            />
          )}
          
          {showTimePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={new Date(form.dueDate)}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              themeVariant="dark"
            />
          )}
        </View>

        <View className="mb-3 flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-gray-300 mb-1">Opening Date</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="date" 
                value={form.openingDate.split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    const current = new Date(form.openingDate);
                    current.setFullYear(date.getFullYear());
                    current.setMonth(date.getMonth());
                    current.setDate(date.getDate());
                    setForm(f => ({ ...f, openingDate: current.toISOString() }));
                  }
                }}
                style={{ backgroundColor: '#101216', color: 'white', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', colorScheme: 'dark' }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowOpeningDatePicker(true)}
                className="bg-[#101216] flex-row items-center justify-between rounded-lg px-4 py-3 border border-white/10"
              >
                <Text className="text-white">
                  {new Date(form.openingDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-gray-300 mb-1">Opening Time</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="time" 
                value={new Date(form.openingDate).toTimeString().slice(0,5)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [hours, minutes] = e.target.value.split(':');
                    const current = new Date(form.openingDate);
                    current.setHours(parseInt(hours, 10));
                    current.setMinutes(parseInt(minutes, 10));
                    setForm(f => ({ ...f, openingDate: current.toISOString() }));
                  }
                }}
                style={{ backgroundColor: '#101216', color: 'white', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', colorScheme: 'dark' }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowOpeningTimePicker(true)}
                className="bg-[#101216] flex-row items-center justify-between rounded-lg px-4 py-3 border border-white/10"
              >
                <Text className="text-white">
                  {new Date(form.openingDate).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Clock size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          
          {showOpeningDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={new Date(form.openingDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onOpeningDateChange}
              themeVariant="dark"
            />
          )}
          
          {showOpeningTimePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={new Date(form.openingDate)}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onOpeningTimeChange}
              themeVariant="dark"
            />
          )}
        </View>


        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Cohort Number</Text>
          <TextInput
            value={form.cohortNo}
            onChangeText={(t) => setForm((f) => ({ ...f, cohortNo: t }))}
            className="bg-[#101216] text-white rounded-lg px-4 py-3 border border-white/10"
            placeholder="Enter cohort number"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>

        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Subject Code</Text>
          <TextInput
            value={form.subjectCode}
            onChangeText={(t) => setForm((f) => ({ ...f, subjectCode: t }))}
            className="bg-[#101216] text-white rounded-lg px-4 py-3 border border-white/10"
            placeholder="Enter subject code"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Link</Text>
          <TextInput
            value={form.link}
            onChangeText={(t) => setForm((f) => ({ ...f, link: t }))}
            className="bg-[#101216] text-white rounded-lg px-4 py-3 border border-white/10"
            placeholder="Enter assignment link"
            placeholderTextColor="#6B7280"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`py-3 rounded-xl ${loading ? "bg-gray-600" : "bg-blue-600"} mt-4`}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              {isEdit ? "Update Assignment" : "Create Assignment"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AssignmentForm;
