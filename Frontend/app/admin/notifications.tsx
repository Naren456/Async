import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Users } from 'lucide-react-native';
import { SendNotification } from '../../api/admin';

const ManageNotifications = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cohort, setCohort] = useState('ALL');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please enter both title and body');
      return;
    }

    setLoading(true);
    try {
      await SendNotification(cohort, title, body);
      Alert.alert('Success', 'Notification sent successfully');
      setTitle('');
      setBody('');
    } catch (error: any) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', error.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      {/* Header */}
      <View className="px-5 py-4 border-b border-white/10 bg-[#1e293b]/80 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 rounded-full bg-white/5"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Send Notifications</Text>
      </View>

      <ScrollView className="flex-1 px-5 py-6">
        {/* Cohort Selection */}
        <View className="mb-6">
          <Text className="text-gray-400 mb-2 text-sm font-medium">Target Audience</Text>
          <View className="flex-row flex-wrap gap-2">
            {['ALL', '4', '6'].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCohort(c)}
                className={`px-4 py-2 rounded-lg border ${
                  cohort === c
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-[#1e293b] border-white/10'
                }`}
              >
                <Text
                  className={`${
                    cohort === c ? 'text-white' : 'text-gray-400'
                  } font-medium`}
                >
                  {c === 'ALL' ? 'All Users' : `Cohort ${c}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-400 mb-2 text-sm font-medium">Notification Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Assignment Due Reminder"
            placeholderTextColor="#64748b"
            className="bg-[#1e293b] text-white p-4 rounded-xl border border-white/10 font-medium"
          />
        </View>

        {/* Body Input */}
        <View className="mb-8">
          <Text className="text-gray-400 mb-2 text-sm font-medium">Message Body</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Enter your message here..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={4}
            className="bg-[#1e293b] text-white p-4 rounded-xl border border-white/10 font-medium h-32"
            textAlignVertical="top"
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading}
          className={`flex-row items-center justify-center p-4 rounded-xl ${
            loading ? 'bg-blue-600/50' : 'bg-blue-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Send size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">  Send Notification</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <View className="flex-row items-center mb-2">
            <Users size={16} color="#3B82F6" />
            <Text className="text-blue-400 font-medium ml-2">Note</Text>
          </View>
          <Text className="text-blue-300/80 text-sm leading-5">
            Notifications will be sent to all users in the selected group who have enabled push notifications on their devices.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageNotifications;
