import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIDO_LIST, SidoName } from '@/services/airQualityApi';

interface SidoPickerProps {
  selectedSido: SidoName;
  onSelect: (sido: SidoName) => void;
}

export function SidoPicker({ selectedSido, onSelect }: SidoPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (sido: SidoName) => {
    onSelect(sido);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center"
      >
        <Ionicons name="location" size={16} color="#4ade80" />
        <Text className="text-green-400 ml-1 font-medium">{selectedSido}</Text>
        <Ionicons name="chevron-down" size={16} color="#4ade80" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-gray-100">
              <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-3" />
              <Text className="text-lg font-bold text-gray-800 text-center">
                지역 선택
              </Text>
            </View>

            <FlatList
              data={SIDO_LIST}
              keyExtractor={(item) => item}
              numColumns={3}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`flex-1 m-1 py-3 rounded-xl items-center ${
                    selectedSido === item ? 'bg-green-400' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      selectedSido === item ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View className="p-4 pb-8">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-800 py-4 rounded-xl items-center"
              >
                <Text className="text-white font-semibold">닫기</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
