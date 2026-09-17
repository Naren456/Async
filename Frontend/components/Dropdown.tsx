import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

type Option = { label: string; value: string };

export function Dropdown({
  value,
  onValueChange,
  options,
  placeholder = "Select",
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {label ? <Text className="text-white text-sm font-medium mb-2">{label}</Text> : null}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="bg-[#101216] border border-white/10 rounded-xl px-4 py-3 flex-row items-center justify-between"
      >
        <Text className={selected ? "text-white text-sm" : "text-gray-500 text-sm"} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={16} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={{ maxHeight: "70%" }}>
            <View className="bg-[#101216] border border-white/10 rounded-2xl overflow-hidden max-h-[70%]">
              <View className="px-4 py-3 border-b border-white/10">
                <Text className="text-white font-bold text-center">{label || placeholder}</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
                {options.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => {
                        onValueChange(opt.value);
                        setOpen(false);
                      }}
                      className={`flex-row items-center justify-between px-4 py-3 border-b border-white/5 ${isSelected ? "bg-blue-600/20" : ""}`}
                    >
                      <Text className={`text-sm ${isSelected ? "text-white font-bold" : "text-gray-300"}`}>{opt.label}</Text>
                      {isSelected && <Check size={16} color="#60A5FA" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity onPress={() => setOpen(false)} className="p-3 border-t border-white/10 items-center">
                <Text className="text-gray-400 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
