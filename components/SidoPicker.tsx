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
import { useThemeStore, themes } from '@/store/themeStore';

interface SidoPickerProps {
  selectedSido: SidoName;
  onSelect: (sido: SidoName) => void;
}

export function SidoPicker({ selectedSido, onSelect }: SidoPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useThemeStore();
  const colors = themes[theme];

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
            className="rounded-t-3xl max-h-[70%]"
            style={{ backgroundColor: colors.background }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View className="w-10 h-1 rounded-full self-center mb-3" style={{ backgroundColor: colors.textMuted }} />
              <Text className="text-lg font-bold text-center" style={{ color: colors.text }}>
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
                  className="flex-1 m-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: selectedSido === item ? '#4ade80' : colors.surface,
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: selectedSido === item ? '#ffffff' : colors.text,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View className="p-4 pb-8">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="py-4 rounded-xl items-center"
                style={{ backgroundColor: theme === 'light' ? '#1f2937' : '#3b82f6' }}
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
