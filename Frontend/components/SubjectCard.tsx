import React from 'react';
import { TouchableOpacity, Text, View, useColorScheme } from 'react-native';

import { FileUp, Pencil, Trash2 } from 'lucide-react-native';

type Subject = {
  code: string;
  name: string;
  semester?: number;
  term?: number;
  skill?: string;
};

type Props = {
  subject: Subject;
  mode?: 'user' | 'admin'; // mode for UI variation
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNote?: () => void;
  handlePress?: () => void; // user tap action
};

const SubjectCard: React.FC<Props> = ({
  subject,
  mode = 'user',
  onEdit,
  onDelete,
  onAddNote,
  handlePress,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  // Theme classes
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const subText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // const handlePress = () => {
  //   if (mode === 'user') {
  //     onPress
  //       ? onPress()
  //       : router.push({
  //           pathname: '/user/notes',
  //           params: { code: subject.code },
  //         });
  //   }
  // };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
    
      onPress={handlePress}
      className={`mb-3 rounded-2xl p-4 border ${bgClass} ${borderClass} shadow`}
    >

      {/* Subject Info */}
      <Text className={`text-lg font-semibold ${textClass}`}>
        {subject.name}
      </Text>

      {subject.semester && subject.term && (
        <Text className={`text-xs mt-1 ${subText}`}>
          Semester {subject.semester} • Term {subject.term} • Code: {subject.code}
        </Text>
      )}

      {/* Admin Controls */}
      {mode === 'admin' && (
        <View className="flex-row mt-4 space-x-2 gap-5">
          {onEdit && (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-blue-600 py-2 rounded-lg active:opacity-80"
              onPress={onEdit}
            >
              <Pencil size={16} color="white" />
              <Text className="text-white font-medium ml-1">Edit</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-red-600 py-2 rounded-lg active:opacity-80"
              onPress={onDelete}
            >
              <Trash2 size={16} color="white" />
              <Text className="text-white font-medium ml-1">Delete</Text>
            </TouchableOpacity>
          )}

          {onAddNote && (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-green-600 py-2 rounded-lg active:opacity-80"
              onPress={onAddNote}
            >
              <FileUp size={16} color="white" />
              <Text className="text-white font-medium ml-1">Notes</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectCard;
