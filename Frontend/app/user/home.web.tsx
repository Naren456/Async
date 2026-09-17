import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { BookOpen, Calendar, ClipboardList, GraduationCap, Search, Filter, CheckCircle2, Circle, ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { DataManager } from "../../utils/DataManager";
import { GetAssignmentsByCohort } from "../../api/apiCall";
import { toggleAssignmentCompletion } from "../../api/services/assignmentService";
import useFeedback from "../../hooks/useFeedback";
import { WebLayout } from "../../components/web/WebLayout";

type Assignment = { id: string; title: string; subject: string; isoDate: string; displayDate: string; link: string; Completed: boolean; };
type Grouped = Record<string, Assignment[]>;

export const sortGrouped = (grouped: Grouped, limitFirst=false) => {
  if (!grouped || !Object.keys(grouped).length) return [];
  const parse = (s: string) => { const [d,m,y]=s.split("-"); const map:any={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}; return new Date(Number(y),map[m],Number(d)); };
  const sorted = Object.keys(grouped).sort((a,b)=>parse(a).getTime()-parse(b).getTime());
  if (limitFirst) return grouped[sorted[0]]||[];
  return sorted.flatMap(d=>grouped[d]||[]);
};
const transform = (grouped:any): Grouped => {
  const r:Grouped={};
  Object.entries(grouped||{}).forEach(([date,items]:any)=>{
    r[date]=(items as any[]).map((a:any)=>{
      const iso=a.dueDate?new Date(a.dueDate).toISOString():"";
      const display=a.dueDate?new Date(a.dueDate).toLocaleString(undefined,{year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"No due date";
      return { id:a.id, title:a.title, subject:a.subject?.name||a.subject?.code||"Subject", link:a.link||"", isoDate:iso, displayDate:display, Completed:a.Completed||false };
    });
  });
  return r;
};

export default function UserDashboardWeb() {
  const router = useRouter();
  const user = useSelector((s:any)=>s.user);
  const [total, setTotal]=useState(0);
  const [grouped,setGrouped]=useState<Grouped>({});
  const [upcoming,setUpcoming]=useState<Assignment[]>([]);
  const [filter,setFilter]=useState<"all"|"upcoming"|"completed">("all");
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const { playSuccessSound }=useFeedback();

  const load=useCallback(async (showLoad=true)=>{
    if(!user?.cohortNo) return;
    if(showLoad) setLoading(true);
    try{
      const cached=await DataManager.getAssignments(user.cohortNo);
      if(cached){ const g=transform(cached); setGrouped(g); setTotal(Object.values(cached).reduce((a:any,b:any)=>a+b.length,0)); }
      const fresh=await DataManager.syncAssignments(user.cohortNo, false);
      if(fresh){ const g=transform(fresh); setGrouped(g); }
      const up=await GetAssignmentsByCohort(user.cohortNo,"upcoming");
      if(up?.grouped){ const g=transform(up.grouped); setUpcoming(sortGrouped(g)); }
    }finally{ setLoading(false); }
  },[user?.cohortNo]);

  useEffect(()=>{ load(true); },[load]);
  useFocusEffect(useCallback(()=>{ load(false); },[load]));

  const onRefresh=async()=>{ setRefreshing(true); await load(false); setRefreshing(false); };
  const toggle=async(id:string)=>{
    const cur=upcoming.find(a=>a.id===id);
    const completing=cur?!cur.Completed:false;
    setUpcoming(p=>p.map(i=>i.id===id?{...i,Completed:!i.Completed}:i));
    if(completing) playSuccessSound();
    await DataManager.updateAssignmentCompletion(user.cohortNo,id,completing);
    await toggleAssignmentCompletion(id);
  };

  const allAssignments=sortGrouped(grouped);
  const filteredUpcoming=upcoming.filter(a=>{
    if(search && !`${a.title} ${a.subject}`.toLowerCase().includes(search.toLowerCase())) return false;
    if(filter==="completed") return a.Completed;
    if(filter==="upcoming") return !a.Completed;
    return true;
  });
  const stats=[
    { label:"Total Subjects", value:3, icon:BookOpen, color:"#10B981", bg:"#10B98115" },
    { label:"Assignments", value:total, icon:ClipboardList, color:"#F59E0B", bg:"#F59E0B15" },
    { label:"Upcoming", value:upcoming.length, icon:Calendar, color:"#3B82F6", bg:"#3B82F615" },
    { label:"CGR", value:user?.cgr||"—", icon:GraduationCap, color:"#EC4899", bg:"#EC489915" },
  ];

  if(loading) return <View className="flex-1 bg-[#08090B] items-center justify-center py-20"><ActivityIndicator size="large" color="#3B82F6"/><Text className="text-gray-400 mt-4">Loading dashboard...</Text></View>;

  return (
    <WebLayout title={`Hello, ${user?.name} 👋`} subtitle={`Cohort ${user?.cohortNo} • Sem ${user?.semester} • Term ${user?.term}`}>
      <View className="flex-row gap-3 mb-6 max-w-md">
        <View className="flex-1 flex-row items-center bg-[#101216] border border-white/10 rounded-xl px-4 py-2.5">
          <Search size={16} color="#6B7280"/><TextInput value={search} onChangeText={setSearch} placeholder="Search assignments..." placeholderTextColor="#6B7280" className="flex-1 ml-2 text-white text-sm outline-none" style={{outlineStyle:"none"} as any}/>
        </View>
      </View>
      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6"/>}>
        {/* Stats Grid */}
        <View>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s=>(
              <View key={s.label} className="bg-[#101216] border border-white/10 rounded-2xl p-5">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-gray-400 text-xs font-medium tracking-widest uppercase">{s.label}</Text>
                    <Text className="text-white text-3xl font-bold mt-2">{s.value}</Text>
                    <View className="flex-row items-center mt-2 gap-1"><ArrowUpRight size={12} color="#10B981"/><Text className="text-emerald-400 text-xs">+2 this week</Text></View>
                  </View>
                  <View className="w-12 h-12 rounded-xl items-center justify-center" style={{backgroundColor:s.bg}}><s.icon size={20} color={s.color}/></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Main Grid: Table + Sidebar */}
        <View className="mt-8 flex-col lg:flex-row gap-6 pb-10">
          {/* Left - Assignments Table */}
          <View className="flex-1 bg-[#101216] border border-white/10 rounded-2xl overflow-hidden">
            <View className="px-6 py-4 border-b border-white/10 flex-row items-center justify-between">
              <Text className="text-white font-bold text-lg">Upcoming Assignments</Text>
              <View className="flex-row gap-2">
                {(["all","upcoming","completed"] as const).map(f=>(
                  <TouchableOpacity key={f} onPress={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full border ${filter===f?"bg-blue-600 border-blue-600":"bg-white/5 border-white/10"}`}><Text className={`text-xs font-semibold capitalize ${filter===f?"text-white":"text-gray-400"}`}>{f}</Text></TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Mobile search */}
            <View className="md:hidden px-6 py-3 border-b border-white/10 flex-row items-center bg-[#0B0C0F] gap-2">
              <Search size={14} color="#6B7280"/><TextInput value={search} onChangeText={setSearch} placeholder="Search..." placeholderTextColor="#6B7280" className="flex-1 text-white text-sm"/>
              <TouchableOpacity><Filter size={16} color="#6B7280"/></TouchableOpacity>
            </View>
            {/* Table Header - hidden on mobile */}
            <View className="hidden md:flex px-6 py-3 bg-[#0B0C0F] flex-row border-b border-white/5">
              <Text className="flex-1 text-gray-500 text-xs font-bold tracking-widest uppercase">Subject</Text>
              <Text className="flex-[2] text-gray-500 text-xs font-bold tracking-widest uppercase">Title</Text>
              <Text className="flex-1 text-gray-500 text-xs font-bold tracking-widest uppercase">Due Date</Text>
              <Text className="w-24 text-gray-500 text-xs font-bold tracking-widest uppercase text-center">Status</Text>
            </View>
            {filteredUpcoming.length===0? <View className="p-12 items-center"><Text className="text-gray-500">No assignments found</Text></View> : filteredUpcoming.map(a=>(
              <View key={a.id} className="px-6 py-4 flex-row items-center border-b border-white/5 hover:bg-white/[0.02]">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="hidden md:flex w-2 h-2 rounded-full bg-blue-500"/>
                  <Text className="text-blue-300 text-sm font-medium flex-1" numberOfLines={1}>{a.subject}</Text>
                </View>
                <Text className="flex-[2] text-white text-sm font-medium px-2" numberOfLines={1}>{a.title}</Text>
                <Text className="flex-1 text-gray-400 text-xs hidden md:flex">{a.displayDate}</Text>
                <View className="w-24 items-center">
                  <TouchableOpacity onPress={()=>toggle(a.id)} className={`px-3 py-1 rounded-full flex-row items-center gap-1 border ${a.Completed?"bg-emerald-500/10 border-emerald-500/20":"bg-amber-500/10 border-amber-500/20"}`}>
                    {a.Completed? <CheckCircle2 size={12} color="#10B981"/> : <Circle size={12} color="#F59E0B"/>}
                    <Text className={`text-xs font-bold ${a.Completed?"text-emerald-400":"text-amber-400"}`}>{a.Completed?"Done":"Pending"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Right Sidebar */}
          <View className="w-full lg:w-80 gap-6">
            <View className="bg-[#101216] border border-white/10 rounded-2xl p-5">
              <Text className="text-white font-bold mb-4">Quick Actions</Text>
              <TouchableOpacity onPress={()=>router.push("/user/notes")} className="bg-blue-600 rounded-xl py-3 items-center mb-3"><Text className="text-white font-bold">View Notes</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>router.push("/user/assignment")} className="bg-white/5 border border-white/10 rounded-xl py-3 items-center"><Text className="text-white font-semibold">All Assignments</Text></TouchableOpacity>
            </View>
            <View className="bg-[#101216] border border-white/10 rounded-2xl p-5">
              <Text className="text-white font-bold mb-3">Cohort Info</Text>
              <View className="gap-3">
                <View className="flex-row justify-between"><Text className="text-gray-400 text-sm">Cohort</Text><Text className="text-white font-bold">{user?.cohortNo}</Text></View>
                <View className="flex-row justify-between"><Text className="text-gray-400 text-sm">Semester</Text><Text className="text-white font-bold">{user?.semester}</Text></View>
                <View className="flex-row justify-between"><Text className="text-gray-400 text-sm">Total Due</Text><Text className="text-amber-400 font-bold">{upcoming.filter(a=>!a.Completed).length}</Text></View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}
