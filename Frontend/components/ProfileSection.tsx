import React from 'react';
import { View, Text } from 'react-native';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <View className="mb-6">
    <Text className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
      {title}
    </Text>
    {children}
  </View>
);

export default ProfileSection;
