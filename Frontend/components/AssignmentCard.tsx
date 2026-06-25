import { CalendarDays, CheckCircle2, ChevronRight, Pen, Trash2, Circle, ExternalLink } from "lucide-react-native";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";


interface AssignmentCardProps {
  title: string;
  subject: string;
  dueDate: string; // formatted string
  link: string;
  isAdmin?: boolean; // new prop
  onEdit?: () => void;
  onDelete?: () => void;
  Completed?: boolean;
  onToggleComplete? : () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  subject,
  dueDate,
  link,
  isAdmin = false,
  onEdit,
  onDelete,
  Completed = false,
  onToggleComplete,
}) => {
  const openAssignment = async () => {
    try {
      if (link) {
        await WebBrowser.openBrowserAsync(link);
      } else {
        Alert.alert("Notice", "No link provided for this assignment.");
      }
    } catch (error) {
      console.error("Failed to open link:", error);
      Alert.alert("Error", "Failed to open the assignment link.");
    }
  };

  return (
    <View className="rounded-2xl border border-white/10 bg-[#334155]/70 shadow-md p-5 mb-4 overflow-hidden">
      
      {/* Subject badge */}
      <View className="self-start bg-blue-600/30 px-3 py-1 rounded-full mb-3">
        <Text className="text-xs font-medium text-blue-300">{subject}</Text>
      </View>

      {/* Title */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="flex-1 text-lg font-semibold text-gray-100 leading-6 pr-4">
          {title}
        </Text>
       
        {!isAdmin && (
          <Pressable 
            onPress={(e) => {
              e.stopPropagation();
              onToggleComplete?.();
            }}
            className="p-1 active:opacity-60"
          >
            {Completed ? (
              <CheckCircle2 size={26} color="#10B981" />
            ) : (
              <Circle size={26} color="#64748b" />
            )}
          </Pressable>
        )}
      </View>

      {/* Footer: Due Date + Actions */}
      <View className="flex-row items-center justify-between border-t border-white/5 pt-4 mt-3">
        
        {/* Due Date */}
        <View className="flex-row items-center">
          <CalendarDays size={16} color="#60A5FA" />
          <Text className="ml-2 text-sm text-gray-300">Due: {dueDate}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row items-center">
          {isAdmin && (
            <>
              <Pressable onPress={onEdit} className="mr-3 p-1 active:opacity-60">
                <Pen size={18} color="#FACC15" />
              </Pressable>
              <Pressable onPress={onDelete} className="mr-3 p-1 active:opacity-60">
                <Trash2 size={18} color="#EF4444" />
              </Pressable>
            </>
          )}
          
          {/* Open Link Button */}
        </View>
        
      </View>
    </View>
  );
};

export default AssignmentCard;
