import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useAirQualityStore } from '@/store/airQualityStore';
import { getGradeInfo } from '@/services/airQualityApi';
import { SidoPicker } from '@/components/SidoPicker';
import { StationPicker } from '@/components/StationPicker';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore, themes } from '@/store/themeStore';

export default function Home() {
  const {
    items,
    selectedItem,
    selectedSido,
    isLoading,
    error,
    errorType,
    lastUpdated,
    isHydrated,
    setSelectedSido,
    setSelectedItem,
    fetchData,
    refresh,
  } = useAirQualityStore();

  const { language, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const colors = themes[theme];

  // 저장된 상태가 로드된 후 데이터 가져오기
  useEffect(() => {
    if (isHydrated) {
      fetchData();
    }
  }, [isHydrated]);

  // 등급 정보
  const gradeInfo = getGradeInfo(selectedItem?.khaiGrade || null);
  const pm10GradeInfo = getGradeInfo(selectedItem?.pm10Grade || null);
  const pm25GradeInfo = getGradeInfo(selectedItem?.pm25Grade || null);

  // 추천 메시지
  const getRecommendation = () => {
    const grade = selectedItem?.khaiGrade;
    switch (grade) {
      case '1':
        return t('recommendations.good');
      case '2':
        return t('recommendations.moderate');
      case '3':
        return t('recommendations.bad');
      case '4':
        return t('recommendations.veryBad');
      default:
        return t('recommendations.unknown');
    }
  };

  const recommendation = getRecommendation();

  // 마지막 업데이트 시간 포맷
  const formatLastUpdated = () => {
    if (!lastUpdated) return '-';
    const hours = lastUpdated.getHours();
    const minutes = lastUpdated.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? t('pm') : t('am');
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${period} ${displayHours.toString().padStart(2, '0')}:${minutes}`;
  };

  // 구름 애니메이션
  const cloud1X = useSharedValue(-80);
  const cloud2X = useSharedValue(-60);
  const cloud3X = useSharedValue(-100);
  const cloud4X = useSharedValue(-50);

  useEffect(() => {
    cloud1X.value = withRepeat(
      withSequence(
        withTiming(400, { duration: 8000, easing: Easing.linear }),
        withTiming(-80, { duration: 0 })
      ),
      -1,
      false
    );
    cloud2X.value = withSequence(
      withTiming(-60, { duration: 2000 }),
      withRepeat(
        withSequence(
          withTiming(420, { duration: 12000, easing: Easing.linear }),
          withTiming(-60, { duration: 0 })
        ),
        -1,
        false
      )
    );
    cloud3X.value = withSequence(
      withTiming(-100, { duration: 4000 }),
      withRepeat(
        withSequence(
          withTiming(400, { duration: 10000, easing: Easing.linear }),
          withTiming(-100, { duration: 0 })
        ),
        -1,
        false
      )
    );
    cloud4X.value = withSequence(
      withTiming(-50, { duration: 6000 }),
      withRepeat(
        withSequence(
          withTiming(380, { duration: 14000, easing: Easing.linear }),
          withTiming(-50, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const cloud1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud1X.value }],
  }));
  const cloud2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud2X.value }],
  }));
  const cloud3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud3X.value }],
  }));
  const cloud4Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud4X.value }],
  }));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-start justify-between mt-2">
          <View>
            <Text className="text-3xl font-bold" style={{ color: colors.headerText }}>AirCheck</Text>
            <View className="flex-row items-center gap-3 mt-1">
              <SidoPicker
                selectedSido={selectedSido}
                onSelect={setSelectedSido}
              />
              <StationPicker
                stations={items}
                selectedStation={selectedItem}
                onSelect={setSelectedItem}
              />
            </View>
          </View>
          <View className="flex-row items-center gap-4 mt-2">
            <LanguageSelector />
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons
                name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={colors.iconColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error State */}
        {error && (
          <View
            className="rounded-xl p-4 mt-4"
            style={{ backgroundColor: theme === 'light' ? '#fef2f2' : '#450a0a' }}
          >
            <Text className="text-sm" style={{ color: theme === 'light' ? '#dc2626' : '#fca5a5' }}>
              {errorType === 'network'
                ? t('networkError')
                : errorType === 'api_key'
                ? t('apiKeyError')
                : t('dataLoadError')}
            </Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4ade80" />
            <Text className="mt-4" style={{ color: colors.textSecondary }}>{t('loadingData')}</Text>
          </View>
        ) : (
          <>
            {/* Air Quality Circle */}
            <View className="items-center mt-12">
              <View
                className="rounded-full items-center justify-center"
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: gradeInfo.color,
                }}
              >
                <Text className="text-white text-sm">{t('airQuality')}</Text>
                <Text className="text-white text-5xl font-bold mt-2">
                  {t(gradeInfo.labelKey)}
                </Text>
                {selectedItem?.khaiValue && selectedItem.khaiValue !== '-' && (
                  <Text className="text-white/80 text-sm mt-1">
                    {t('index')} {selectedItem.khaiValue}
                  </Text>
                )}
              </View>
            </View>

            {/* PM Values */}
            <View className="flex-row mt-8 gap-3">
              <View
                className="rounded-2xl items-center justify-center flex-1 py-6 shadow-sm"
                style={{
                  backgroundColor: colors.cardBg,
                  shadowColor: theme === 'light' ? '#000' : '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: theme === 'light' ? 0.1 : 0.3,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>{t('pm10')}</Text>
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: pm10GradeInfo.color }}
                  />
                </View>
                <Text className="text-4xl font-bold mt-2" style={{ color: colors.text }}>
                  {selectedItem?.pm10Value || '-'}
                </Text>
                <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>{t('unit')}</Text>
              </View>
              <View
                className="rounded-2xl items-center justify-center flex-1 py-6 shadow-sm"
                style={{
                  backgroundColor: colors.cardBg,
                  shadowColor: theme === 'light' ? '#000' : '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: theme === 'light' ? 0.1 : 0.3,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>{t('pm25')}</Text>
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: pm25GradeInfo.color }}
                  />
                </View>
                <Text className="text-4xl font-bold mt-2" style={{ color: colors.text }}>
                  {selectedItem?.pm25Value || '-'}
                </Text>
                <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>{t('unit')}</Text>
              </View>
            </View>

            {/* Recommendation Card */}
            <View
              className="rounded-2xl mt-8 py-8 px-6 relative overflow-hidden"
              style={{ borderRadius: 20, backgroundColor: colors.recommendationBg }}
            >
              {/* Animated Cloud decorations */}
              <Animated.View className="absolute top-1 opacity-30" style={cloud1Style}>
                <Ionicons name="cloud" size={55} color={colors.cloudColor} />
              </Animated.View>
              <Animated.View className="absolute top-3 opacity-20" style={cloud2Style}>
                <Ionicons name="cloud" size={40} color={colors.cloudColor} />
              </Animated.View>
              <Animated.View className="absolute bottom-1 opacity-30" style={cloud3Style}>
                <Ionicons name="cloud" size={60} color={colors.cloudColor} />
              </Animated.View>
              <Animated.View className="absolute bottom-4 opacity-25" style={cloud4Style}>
                <Ionicons name="cloud" size={35} color={colors.cloudColor} />
              </Animated.View>
              <Text className="text-center text-base z-10" style={{ color: colors.text }}>
                {recommendation.text}{' '}
                <Text style={{ color: gradeInfo.color }} className="font-semibold">
                  {recommendation.highlight}
                </Text>
                {recommendation.suffix}
              </Text>
            </View>

            {/* Data Time */}
            {selectedItem?.dataTime && (
              <Text className="text-xs text-center mt-3" style={{ color: colors.textMuted }}>
                {t('measurementTime')}: {selectedItem.dataTime}
              </Text>
            )}
          </>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-auto mb-4">
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            {t('lastUpdate')}: {formatLastUpdated()}
          </Text>
          <TouchableOpacity
            onPress={refresh}
            disabled={isLoading}
            className="flex-row items-center px-4 py-2 rounded-xl"
            style={{
              opacity: isLoading ? 0.5 : 1,
              backgroundColor: theme === 'light' ? '#1f2937' : '#3b82f6',
            }}
          >
            <Text className="text-white text-sm mr-2">{t('refresh')}</Text>
            <Ionicons name="refresh" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
