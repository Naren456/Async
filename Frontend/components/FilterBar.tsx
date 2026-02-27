import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type FilterBarProps = {
  selectedSemester?: number;
  selectedTerm?: number;
  onSemesterPress: () => void;
  onTermPress: () => void;
};

const FilterBar: React.FC<FilterBarProps> = ({
  selectedSemester,
  selectedTerm,
  onSemesterPress,
  onTermPress,
}) => (
  <View className="flex-row mb-5 space-x-3 gap-5">
    <TouchableOpacity
      className="flex-1 py-3 px-4 rounded-xl bg-[#1e293b] border border-white/10"
      onPress={onSemesterPress}
    >
      <Text className="text-gray-400 text-sm">Semester</Text>
      <Text className="text-white text-base mt-1 font-medium">
        {selectedSemester ?? 'All'}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      className="flex-1 py-3 px-4 rounded-xl bg-[#1e293b] border border-white/10"
      onPress={onTermPress}
    >
      <Text className="text-gray-400 text-sm">Term</Text>
      <Text className="text-white text-base mt-1 font-medium">
        {selectedTerm ?? 'All'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default FilterBar;
