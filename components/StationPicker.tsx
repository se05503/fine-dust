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

  const handleSelect = (station: AirQualityItem) => {
    onSelect(station);
    setModalVisible(false);
  };

  if (!selectedStation) {
    return (
      <View className="flex-row items-center">
        <Ionicons name="radio-outline" size={14} color="#9ca3af" />
        <Text className="text-gray-400 ml-1 text-sm">측정소 없음</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center"
      >
        <Ionicons name="radio-outline" size={14} color="#6b7280" />
        <Text className="text-gray-600 ml-1 text-sm">
          {selectedStation.stationName}
        </Text>
        <Ionicons name="chevron-down" size={14} color="#6b7280" />
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
                측정소 선택
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
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
                    className={`flex-row items-center justify-between p-4 mb-2 rounded-xl ${
                      isSelected ? 'bg-green-50 border border-green-400' : 'bg-gray-50'
                    }`}
                  >
                    <View className="flex-1">
                      <Text
                        className={`font-semibold ${
                          isSelected ? 'text-green-700' : 'text-gray-800'
                        }`}
                      >
                        {item.stationName}
                      </Text>
                      {item.mangName && (
                        <Text className="text-gray-500 text-xs mt-0.5">
                          {item.mangName}
                        </Text>
                      )}
                    </View>

                    <View className="flex-row items-center gap-3">
                      <View className="items-end">
                        <Text className="text-gray-500 text-xs">PM10</Text>
                        <Text className="text-gray-800 font-medium">
                          {item.pm10Value || '-'}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-gray-500 text-xs">PM2.5</Text>
                        <Text className="text-gray-800 font-medium">
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
