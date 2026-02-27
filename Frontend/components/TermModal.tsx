import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

type TermModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (n?: number) => void;
};

const TermModal: React.FC<TermModalProps> = ({ visible, onClose, onSelect }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-[#1e293b] p-6 rounded-t-3xl border-t border-white/10 max-h-[40%]">
        <Text className="text-white text-lg font-semibold mb-4">Select Term</Text>
        <ScrollView>
          <TouchableOpacity className="py-3 border-b border-white/10" onPress={() => { onSelect(undefined); onClose(); }}>
            <Text className="text-gray-200">All</Text>
          </TouchableOpacity>
          {[1, 2].map((n) => (
            <TouchableOpacity key={n} className="py-3 border-b border-white/10" onPress={() => { onSelect(n); onClose(); }}>
              <Text className="text-gray-200">Term {n}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default TermModal;
