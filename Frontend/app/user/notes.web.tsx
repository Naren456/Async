import React, { useEffect, useState, useCallback } from "react";
import { Text, View, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, TextInput, Linking } from "react-native";
import { useSelector } from "react-redux";
import { WebLayout } from "../../components/web/WebLayout";
import { DataManager } from "../../utils/DataManager";
import { GetUserSubjectsWithNotes } from "../../api/apiCall";
import { FileText, Search, Filter, Download, Eye } from "lucide-react-native";

export default function NotesWeb() {
  const user = useSelector((s:any)=>s.user);
  const [subjects,setSubjects]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [selectedSem,setSelectedSem]=useState<number|null>(null);

  const load=useCallback(async()=>{
    if(!user?.id) return;
    setLoading(true);
    try{
      const cached=await DataManager.getSubjects(user.id);
      if(cached?.subjects) setSubjects(cached.subjects);
      const fresh=await GetUserSubjectsWithNotes(user.id);
      if(fresh?.subjects){ setSubjects(fresh.subjects); await DataManager.syncSubjects(user.id); }
    }finally{ setLoading(false); }
  },[user?.id]);
  useEffect(()=>{ load(); },[load]);

  const filtered=subjects.filter(s=>{
    if(search && !`${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase())) return false;
    if(selectedSem && s.semester!==selectedSem) return false;
    return true;
  });
  const semesters=[...new Set(subjects.map(s=>s.semester))].sort();

  return (
    <WebLayout title="Notes & Resources" subtitle={`${filtered.length} subjects • ${filtered.reduce((a,s)=>a+(s.notes?.length||0),0)} PDFs`}>
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 flex-row items-center bg-[#101216] border border-white/10 rounded-xl px-4 py-2.5 max-w-md">
          <Search size={16} color="#6B7280"/><TextInput value={search} onChangeText={setSearch} placeholder="Search subjects..." placeholderTextColor="#6B7280" className="flex-1 ml-2 text-white text-sm outline-none" style={{outlineStyle:"none"} as any}/>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          <TouchableOpacity onPress={()=>setSelectedSem(null)} className={`px-4 py-2 rounded-full border ${!selectedSem?"bg-blue-600 border-blue-600":"bg-[#101216] border-white/10"}`}><Text className={`text-sm ${!selectedSem?"text-white":"text-gray-400"}`}>All Sem</Text></TouchableOpacity>
          {semesters.map(sem=>(
            <TouchableOpacity key={sem} onPress={()=>setSelectedSem(sem===selectedSem?null:sem)} className={`px-4 py-2 rounded-full border ${selectedSem===sem?"bg-blue-600 border-blue-600":"bg-[#101216] border-white/10"}`}>
              <Text className={`text-sm ${selectedSem===sem?"text-white":"text-gray-400"}`}>Sem {sem}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading? <View className="py-20 items-center"><ActivityIndicator size="large" color="#3B82F6"/></View> :
      filtered.length===0? <Text className="text-gray-400">No subjects found.</Text> :
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sub=>(
          <View key={sub.code} className="bg-[#101216] border border-white/10 rounded-2xl p-5">
            <View className="flex-row justify-between items-start mb-3">
              <View className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full"><Text className="text-blue-300 text-xs font-bold">{sub.code}</Text></View>
              <Text className="text-gray-500 text-xs">Sem {sub.semester} • Term {sub.term}</Text>
            </View>
            <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>{sub.name}</Text>
            <Text className="text-gray-500 text-xs mb-4">{sub.notes?.length||0} notes</Text>
            <View className="gap-2">
              {(sub.notes||[]).slice(0,3).map((n:any)=>(
                <TouchableOpacity key={n.id} onPress={()=> n.pdfUrl && Linking.openURL(n.pdfUrl)} className="flex-row items-center gap-3 bg-[#0B0C0F] border border-white/5 rounded-xl px-3 py-2.5">
                  <FileText size={16} color="#60A5FA"/><Text className="flex-1 text-white text-sm" numberOfLines={1}>{n.title}</Text><Eye size={14} color="#9CA3AF"/>
                </TouchableOpacity>
              ))}
              {(sub.notes||[]).length===0 && <Text className="text-gray-600 text-sm">No PDFs yet</Text>}
              {(sub.notes||[]).length>3 && <Text className="text-blue-400 text-xs">+{sub.notes.length-3} more</Text>}
            </View>
          </View>
        ))}
      </View>
      }
    </WebLayout>
  );
}
