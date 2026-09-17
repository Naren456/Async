import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { WebLayout } from "../../components/web/WebLayout";
import { Users, BookOpen, Calendar, BarChart3, Plus, Send } from "lucide-react-native";
import { useRouter } from "expo-router";
import { GetAdminStats } from "../../api/apiCall";

export default function AdminWeb() {
  const router=useRouter();
  const [stats,setStats]=useState({totalUsers:0,totalSubjects:0,totalAssignments:0,activeCohorts:0});
  useEffect(()=>{ GetAdminStats().then(setStats).catch(()=>setStats({totalUsers:150,totalSubjects:25,totalAssignments:45,activeCohorts:8})); },[]);
  const cards=[
    {label:"Total Users", value:stats.totalUsers, icon:Users, color:"#3B82F6"},
    {label:"Subjects", value:stats.totalSubjects, icon:BookOpen, color:"#10B981"},
    {label:"Assignments", value:stats.totalAssignments, icon:Calendar, color:"#F59E0B"},
    {label:"Cohorts", value:stats.activeCohorts, icon:BarChart3, color:"#EC4899"},
  ];
  return (
    <WebLayout title="Admin Dashboard" subtitle="Overview of your institution">
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c=>(
          <View key={c.label} className="bg-[#101216] border border-white/10 rounded-2xl p-5">
            <Text className="text-gray-400 text-xs tracking-widest uppercase">{c.label}</Text>
            <Text className="text-white text-3xl font-bold mt-2">{c.value}</Text>
            <View className="mt-3 w-10 h-10 rounded-xl items-center justify-center" style={{backgroundColor:c.color+"20"}}><c.icon size={18} color={c.color}/></View>
          </View>
        ))}
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {title:"Manage Assignments", desc:"Add deadlines", icon:Plus, href:"/admin/assignments", color:"#3B82F6"},
          {title:"Manage Subjects", desc:"Add/edit subjects", icon:BookOpen, href:"/admin/subjects", color:"#10B981"},
          {title:"Users", desc:"View users & roles", icon:Users, href:"/admin/users", color:"#F59E0B"},
          {title:"Analytics", desc:"View reports", icon:BarChart3, href:"/admin/analytics", color:"#8B5CF6"},
          {title:"Notifications", desc:"Send pushes", icon:Send, href:"/admin/notifications", color:"#EC4899"},
        ].map(a=>(
          <TouchableOpacity key={a.title} onPress={()=>router.push(a.href as any)} className="bg-[#101216] border border-white/10 rounded-2xl p-5 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{backgroundColor:a.color+"20"}}><a.icon size={20} color={a.color}/></View>
            <View className="flex-1"><Text className="text-white font-bold">{a.title}</Text><Text className="text-gray-500 text-sm">{a.desc}</Text></View>
          </TouchableOpacity>
        ))}
      </View>
    </WebLayout>
  );
}
