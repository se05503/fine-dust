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
import { AirQualityItem, getGradeInfo } from '@/services/airQualityApi';
import { useThemeStore, themes } from '@/store/themeStore';

interface StationPickerProps {
  stations: AirQualityItem[];
  selectedStation: AirQualityItem | null;
  onSelect: (station: AirQualityItem) => void;
}

export function StationPicker({
  stations,
  selectedStation,
  onSelect,
}: StationPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useThemeStore();
  const colors = themes[theme];

  const handleSelect = (station: AirQualityItem) => {
    onSelect(station);
    setModalVisible(false);
  };

  if (!selectedStation) {
    return (
      <View className="flex-row items-center">
        <Ionicons name="radio-outline" size={14} color={colors.textMuted} />
        <Text className="ml-1 text-sm" style={{ color: colors.textMuted }}>측정소 없음</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center"
      >
        <Ionicons name="radio-outline" size={14} color={colors.textSecondary} />
        <Text className="ml-1 text-sm" style={{ color: colors.textSecondary }}>
          {selectedStation.stationName}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
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
                측정소 선택
              </Text>
              <Text className="text-sm text-center mt-1" style={{ color: colors.textSecondary }}>
                {stations.length}개 측정소
              </Text>
            </View>

            <FlatList
              data={stations}
              keyExtractor={(item, index) =>
                item.stationCode || `${item.stationName}-${index}`
              }
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => {
                const gradeInfo = getGradeInfo(item.khaiGrade);
                const isSelected =
                  selectedStation?.stationName === item.stationName;

                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center justify-between p-4 mb-2 rounded-xl"
                    style={{
                      backgroundColor: isSelected
                        ? theme === 'light' ? '#dcfce7' : '#14532d'
                        : colors.surface,
                      borderWidth: isSelected ? 1 : 0,
                      borderColor: '#4ade80',
                    }}
                  >
                    <View className="flex-1">
                      <Text
                        className="font-semibold"
                        style={{
                          color: isSelected
                            ? theme === 'light' ? '#15803d' : '#4ade80'
                            : colors.text,
                        }}
                      >
                        {item.stationName}
                      </Text>
                      {item.mangName && (
                        <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                          {item.mangName}
                        </Text>
                      )}
                    </View>

                    <View className="flex-row items-center gap-3">
                      <View className="items-end">
                        <Text className="text-xs" style={{ color: colors.textSecondary }}>PM10</Text>
                        <Text className="font-medium" style={{ color: colors.text }}>
                          {item.pm10Value || '-'}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs" style={{ color: colors.textSecondary }}>PM2.5</Text>
                        <Text className="font-medium" style={{ color: colors.text }}>
                          {item.pm25Value || '-'}
                        </Text>
                      </View>
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: gradeInfo.color }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
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
