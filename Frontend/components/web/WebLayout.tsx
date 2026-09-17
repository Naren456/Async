import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { BookOpen, LayoutDashboard, ClipboardList, BookMarked, User, Users, BarChart3 } from "lucide-react-native";
import { useSelector } from "react-redux";

type NavItem = { label: string; icon: any; href: string; active?: boolean };

export function WebLayout({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((s: any) => s.user);
  const isAdmin = user?.role === "TEACHER";

  const nav: NavItem[] = isAdmin
    ? [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Assignments", icon: ClipboardList, href: "/admin/assignments" },
        { label: "Subjects", icon: BookMarked, href: "/admin/subjects" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
      ]
    : [
        { label: "Dashboard", icon: LayoutDashboard, href: "/user/home" },
        { label: "Assignments", icon: ClipboardList, href: "/user/assignment" },
        { label: "Notes", icon: BookMarked, href: "/user/notes" },
        { label: "Profile", icon: User, href: "/user/profile" },
      ];

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      <View className="flex-1 flex-row">
        {/* Sidebar - always visible on web (no top navbar) */}
        <View className="hidden md:flex w-64 bg-[#0F1115] border-r border-white/10 p-6 flex-col">
          <View className="flex-row items-center gap-3 mb-8">
            <View className="w-9 h-9 rounded-xl bg-blue-600 items-center justify-center"><BookOpen size={18} color="white"/></View>
            <Text className="text-white font-bold text-lg">ASync</Text>
          </View>
          <View className="gap-1 flex-1">
            {nav.map(n => {
              const active = pathname === n.href;
              return (
                <TouchableOpacity key={n.href} onPress={()=>router.push(n.href as any)} className={`flex-row items-center gap-3 px-3 py-2.5 rounded-xl ${active?"bg-blue-600/20 border border-blue-500/20":""}`}>
                  <n.icon size={18} color={active?"#60A5FA":"#9CA3AF"} />
                  <Text className={`text-sm font-semibold ${active?"text-white":"text-gray-400"}`}>{n.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="border-t border-white/10 pt-4 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-full bg-blue-600/20 items-center justify-center border border-blue-500/20"><Text className="text-blue-300 font-bold">{user?.name?.[0]||"U"}</Text></View>
            <View className="flex-1"><Text className="text-white text-sm font-semibold" numberOfLines={1}>{user?.name}</Text><Text className="text-gray-500 text-xs" numberOfLines={1}>{user?.email}</Text></View>
          </View>
        </View>

        {/* Main - no top navbar, only sidebar */}
        <View className="flex-1 bg-[#08090B]">
          <ScrollView className="flex-1" contentContainerStyle={{ maxWidth: 1280, alignSelf:"center", width:"100%" }} showsVerticalScrollIndicator={false}>
            <View className="p-4 lg:p-8">
              {title && (
                <View className="mb-6">
                  <Text className="text-white font-bold text-2xl">{title}</Text>
                  {subtitle && <Text className="text-gray-400 text-sm mt-1">{subtitle}</Text>}
                </View>
              )}
              {children}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
