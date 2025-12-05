import React from 'react';
import { View, Text } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => (
  <View className="bg-[#1e293b]/60 rounded-xl p-4 mb-4 w-full border border-white/10">
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-gray-400 text-sm mb-1">{title}</Text>
        <Text className="text-white text-2xl font-bold">{value}</Text>
        {trend !== undefined && (
          <View className="flex-row items-center mt-1">
            {trend > 0 ? <ArrowUp size={14} color="#10B981" /> : trend < 0 ? <ArrowDown size={14} color="#EF4444" /> : null}
            <Text className="text-gray-400 text-xs ml-1">
              {trend > 0 ? `+${trend} this week` : trend < 0 ? `${trend} this week` : `No change`}
            </Text>
          </View>
        )}
      </View>
      <View className={`w-12 h-12 rounded-xl items-center justify-center`} style={{ backgroundColor: color + "22" }}>
        {icon}
      </View>
    </View>
  </View>
);

export default StatCard;
