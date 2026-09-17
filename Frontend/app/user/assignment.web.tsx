import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Text, View, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { WebLayout } from "../../components/web/WebLayout";
import { DataManager } from "../../utils/DataManager";
import { toggleAssignmentCompletion } from "../../api/services/assignmentService";
import { Search, Filter, CheckCircle2, Circle } from "lucide-react-native";

type Assignment = { id: string; title: string; subject: string; isoDate: string; displayDate: string; link: string; Completed: boolean; };
type Grouped = Record<string, Assignment[]>;
type FilterType = "All" | "Upcoming" | "Due";
const transform = (grouped:any): Grouped => {
  const r:Grouped={}; Object.entries(grouped||{}).forEach(([d,items]:any)=>{ r[d]=(items as any[]).map((a:any)=>({ id:a.id, title:a.title, subject:a.subject?.name||a.subject?.code||"Subject", link:a.link||"", isoDate:a.dueDate?new Date(a.dueDate).toISOString():"", displayDate:a.dueDate?new Date(a.dueDate).toLocaleString(undefined,{year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"No due date", Completed:a.Completed||false }));}); return r;
};

export default function AssignmentWeb() {
  const cohortNo=useSelector((s:any)=>s.user?.cohortNo);
  const [grouped,setGrouped]=useState<Grouped>({});
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [filter,setFilter]=useState<FilterType>("All");
  const [search,setSearch]=useState("");

  const load=useCallback(async()=>{
    if(!cohortNo) return;
    const cached=await DataManager.getAssignments(cohortNo); if(cached) setGrouped(transform(cached));
    const fresh=await DataManager.syncAssignments(cohortNo); if(fresh) setGrouped(transform(fresh));
    setLoading(false);
  },[cohortNo]);
  useEffect(()=>{ load(); },[load]);
  useFocusEffect(useCallback(()=>{ load(); },[load]));
  const onRefresh=async()=>{ setRefreshing(true); await load(); setRefreshing(false); };
  const toggle=async(id:string)=>{
    const cur=Object.values(grouped).flat().find(a=>a.id===id);
    const comp=cur?!cur.Completed:false;
    setGrouped(p=>{ const n={...p}; for(const d in n) n[d]=n[d].map(i=>i.id===id?{...i,Completed:!i.Completed}:i); return n; });
    await DataManager.updateAssignmentCompletion(cohortNo,id,comp);
    await toggleAssignmentCompletion(id);
  };

  const now=new Date();
  const filtered:Grouped={};
  Object.entries(grouped).forEach(([date,list])=>{
    const fl=list.filter(a=>{
      if(search && !`${a.title} ${a.subject}`.toLowerCase().includes(search.toLowerCase())) return false;
      if(filter==="All") return true;
      const past=new Date(a.isoDate) < now;
      if(filter==="Upcoming") return !past;
      if(filter==="Due") return past && !a.Completed;
      return true;
    });
    if(fl.length) filtered[date]=fl;
  });
  const flat=Object.values(filtered).flat();

  return (
    <WebLayout title="Assignments" subtitle={`${flat.length} total • Cohort ${cohortNo}`}>
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 flex-row items-center bg-[#101216] border border-white/10 rounded-xl px-4 py-2.5 max-w-md">
          <Search size={16} color="#6B7280"/><TextInput value={search} onChangeText={setSearch} placeholder="Search by title or subject..." placeholderTextColor="#6B7280" className="flex-1 ml-2 text-white text-sm outline-none" style={{outlineStyle:"none"} as any}/>
        </View>
        <View className="flex-row gap-2">
          {(["All","Upcoming","Due"] as FilterType[]).map(f=>(
            <TouchableOpacity key={f} onPress={()=>setFilter(f)} className={`px-4 py-2 rounded-full border ${filter===f?"bg-blue-600 border-blue-600":"bg-[#101216] border-white/10"}`}><Text className={`text-sm font-semibold ${filter===f?"text-white":"text-gray-400"}`}>{f}</Text></TouchableOpacity>
          ))}
        </View>
      </View>

      {loading? <View className="py-20 items-center"><ActivityIndicator size="large" color="#3B82F6"/></View> :
      flat.length===0? <Text className="text-gray-400">No assignments for this filter.</Text> :
      <View className="bg-[#101216] border border-white/10 rounded-2xl overflow-hidden">
        <View className="flex-row px-6 py-3 bg-[#0B0C0F] border-b border-white/5">
          <Text className="flex-1 text-gray-500 text-xs font-bold tracking-widest uppercase">Subject</Text>
          <Text className="flex-[2] text-gray-500 text-xs font-bold tracking-widest uppercase">Assignment</Text>
          <Text className="flex-1 text-gray-500 text-xs font-bold tracking-widest uppercase">Due</Text>
          <Text className="w-28 text-gray-500 text-xs font-bold tracking-widest uppercase text-center">Status</Text>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6"/>}>
          {Object.entries(filtered).map(([date,list])=>(
            <View key={date}>
              <View className="px-6 py-2 bg-blue-600/10 border-y border-blue-500/10"><Text className="text-blue-300 font-semibold text-sm">{date} • {list.length}</Text></View>
              {list.map(a=>(
                <View key={a.id} className="px-6 py-4 flex-row items-center border-b border-white/5 hover:bg-white/[0.02]">
                  <Text className="flex-1 text-blue-300 text-sm font-medium" numberOfLines={1}>{a.subject}</Text>
                  <Text className="flex-[2] text-white text-sm px-2" numberOfLines={1}>{a.title}</Text>
                  <Text className="flex-1 text-gray-400 text-xs">{a.displayDate}</Text>
                  <View className="w-28 items-center">
                    <TouchableOpacity onPress={()=>toggle(a.id)} className={`px-3 py-1 rounded-full flex-row items-center gap-1 border ${a.Completed?"bg-emerald-500/10 border-emerald-500/20":"bg-amber-500/10 border-amber-500/20"}`}>
                      {a.Completed? <CheckCircle2 size={12} color="#10B981"/> : <Circle size={12} color="#F59E0B"/>}
                      <Text className={`text-xs font-bold ${a.Completed?"text-emerald-400":"text-amber-400"}`}>{a.Completed?"Done":"Pending"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      }
    </WebLayout>
  );
}
