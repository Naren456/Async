import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onPress?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center py-4 border-b border-white/5"
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View className="w-8 h-8 rounded-full bg-blue-600/20 items-center justify-center mr-4">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-base mt-1">{value}</Text>
    </View>
    {onPress && <ChevronRight size={20} color="#6B7280" />}
  </TouchableOpacity>
);

export default ProfileItem;
