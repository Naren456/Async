import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { GetAllUsers } from '../../api/admin';
import { useSelector } from 'react-redux';

const AdminUsers = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await GetAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error loading users:', err?.response || err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    if (user?.role !== 'TEACHER') {
      Alert.alert('Access Denied', 'Admin access required');
      router.replace('/');
      return;
    }
    loadUsers();
  }, [user?.id, user?.role]);

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Users</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadUsers} tintColor="#3B82F6" />}
      >
        {error ? (
          <Text className="text-red-400 mt-4">{error}</Text>
        ) : loading ? (
          <ActivityIndicator color="#3B82F6" style={{ marginTop: 20 }} />
        ) : users.length === 0 ? (
          <Text className="text-gray-400 mt-4">No users to display</Text>
        ) : (
          <>
            <Text className="text-gray-400 mt-2 mb-2">{users.length} users found</Text>
            {users.map((u) => (
              <View key={u.id} className="bg-[#101216] rounded-xl p-4 mb-3 border border-white/10">
                <Text className="text-white font-semibold">{u.name} ({u.email})</Text>
                <Text className="text-gray-400 text-sm">Role: {u.role}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminUsers;
