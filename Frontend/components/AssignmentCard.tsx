import { CalendarDays, CheckCircle2, Pen, Trash2, Circle } from "lucide-react-native";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

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
  return (
    <View className="rounded-xl border border-[#242832] bg-[#101216] p-5 mb-3 overflow-hidden">
      
      {/* Subject badge */}
      <View className="self-start bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-3">
        <Text className="text-xs font-medium text-blue-300">{subject}</Text>
      </View>

      {/* Title */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className={`flex-1 text-lg font-semibold leading-6 pr-4 ${Completed ? "text-[#7C8493] line-through" : "text-[#F5F7FA]"}`}>
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
              <Circle size={26} color="#7C8493" />
            )}
          </Pressable>
        )}
      </View>

      {/* Footer: Due Date + Actions */}
      <View className="flex-row items-center justify-between border-t border-[#242832] pt-4 mt-3">
        
        {/* Due Date */}
        <View className="flex-row items-center">
          <CalendarDays size={16} color="#4F8CFF" />
          <Text className="ml-2 text-sm text-[#9CA3AF]">Due: {dueDate}</Text>
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
