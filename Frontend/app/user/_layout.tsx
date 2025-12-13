import React from "react";
import { Tabs } from "expo-router";
import {
  Home,
  ClipboardList,
  BookOpen,
  User,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserAppLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          overflow: "hidden",
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,          // thin line on top
          borderTopColor: "rgba(255,255,255,0.1)", // subtle divider
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.4,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={26} color={color} strokeWidth={2.4} />,
        }}
      />

      <Tabs.Screen
        name="assignment"
        options={{
          title: "Assignments",
          tabBarIcon: ({ color }) => <ClipboardList size={26} color={color} strokeWidth={2.4} />,
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <BookOpen size={26} color={color} strokeWidth={2.4} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={26} color={color} strokeWidth={2.4} />,
        }}
      />
    </Tabs>
  );
};

export default UserAppLayout;
