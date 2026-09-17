import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { WebLayout } from "../../components/web/WebLayout";
import { User, Mail, GraduationCap, LogOut, Edit3 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { clearUser } from "../../store/reducer";
import * as SecureStore from "../../utils/secureStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileWeb() {
  const user=useSelector((s:any)=>s.user);
  const router=useRouter();
  const dispatch=useDispatch();
  const logout=async()=>{
    await SecureStore.deleteItemAsync("authToken"); await SecureStore.deleteItemAsync("userProfile");
    const keys=await AsyncStorage.getAllKeys(); const ck=keys.filter(k=>k.startsWith("cached_")); if(ck.length) await AsyncStorage.multiRemove(ck);
    dispatch(clearUser()); router.replace("/welcome");
  };
  return (
    <WebLayout title="Profile" subtitle="Manage your account">
      <View className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        <View className="bg-[#101216] border border-white/10 rounded-2xl p-6 items-center">
          <View className="w-24 h-24 rounded-full bg-blue-600/20 border border-blue-500/20 items-center justify-center mb-4"><User size={40} color="#60A5FA"/></View>
          <Text className="text-white text-xl font-bold">{user?.name}</Text>
          <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>
          <View className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"><Text className="text-emerald-400 text-xs font-bold">{user?.role}</Text></View>
          <TouchableOpacity onPress={()=>Alert.alert("Edit","Use mobile to edit profile")} className="mt-6 bg-white/5 border border-white/10 rounded-xl px-6 py-2 flex-row items-center gap-2"><Edit3 size={14} color="white"/><Text className="text-white font-semibold">Edit Profile</Text></TouchableOpacity>
        </View>
        <View className="lg:col-span-2 bg-[#101216] border border-white/10 rounded-2xl p-6">
          <Text className="text-white font-bold text-lg mb-4">Academic Info</Text>
          <View className="grid grid-cols-2 gap-4">
            {[
              {label:"Cohort", value:user?.cohortNo||"—"},
              {label:"Semester", value:user?.semester||"—"},
              {label:"Term", value:user?.term||"—"},
              {label:"CGR", value:user?.cgr||"—"},
              {label:"Tone", value:user?.notificationTone||"friendly"},
            ].map(i=>(
              <View key={i.label} className="bg-[#0B0C0F] border border-white/5 rounded-xl p-4">
                <Text className="text-gray-500 text-xs tracking-widest uppercase">{i.label}</Text>
                <Text className="text-white text-lg font-bold mt-1 capitalize">{String(i.value)}</Text>
              </View>
            ))}
          </View>
          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity onPress={logout} className="flex-row items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-2.5"><LogOut size={16} color="#EF4444"/><Text className="text-red-400 font-bold">Logout</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </WebLayout>
  );
}
