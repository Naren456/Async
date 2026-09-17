import React from "react";
import { View } from "react-native";

export function ResponsiveContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </View>
  );
}
export function ResponsiveGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: number }) {
  const colClass = cols === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2";
  return <View className={`grid ${colClass} gap-4`}>{children}</View>;
}
