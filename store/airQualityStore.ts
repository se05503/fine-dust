import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
  AirQualityItem,
  SidoName,
  fetchAirQuality,
} from '@/services/airQualityApi';

// 환경 변수 또는 설정에서 API 키를 가져옵니다
// 실제 사용 시 .env 파일에 EXPO_PUBLIC_AIR_QUALITY_API_KEY 값을 설정하세요
const API_KEY = process.env.EXPO_PUBLIC_AIR_QUALITY_API_KEY || '';

// 에러 타입 정의
export type ErrorType = 'network' | 'api_key' | 'general' | null;

interface AirQualityState {
  // 데이터
  items: AirQualityItem[];
  selectedItem: AirQualityItem | null;
  selectedSido: SidoName;
  selectedStationName: string | null; // 측정소 이름 저장용
  // 상태
  isLoading: boolean;
  error: string | null;
  errorType: ErrorType; // 에러 타입 추가
  lastUpdated: Date | null;
  isHydrated: boolean; // persist 로딩 완료 여부
  // 액션
  setSelectedSido: (sido: SidoName) => void;
  setSelectedItem: (item: AirQualityItem | null) => void;
  fetchData: (sido?: SidoName) => Promise<void>;
  refresh: () => Promise<void>;
  setHydrated: (state: boolean) => void;
}

export const useAirQualityStore = create<AirQualityState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      items: [],
      selectedItem: null,
      selectedSido: '서울',
      selectedStationName: null,
      isLoading: false,
      error: null,
      errorType: null,
      lastUpdated: null,
      isHydrated: false,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      // 시도 선택
      setSelectedSido: (sido: SidoName) => {
        set({ selectedSido: sido, selectedItem: null, selectedStationName: null });
        get().fetchData(sido);
      },

      // 측정소 선택
      setSelectedItem: (item: AirQualityItem | null) => {
        set({
          selectedItem: item,
          selectedStationName: item?.stationName || null,
        });
      },

      // 데이터 가져오기
      fetchData: async (sido?: SidoName) => {
        const targetSido = sido || get().selectedSido;
        const savedStationName = get().selectedStationName;

        if (!API_KEY) {
          set({
            error: 'api_key',
            errorType: 'api_key',
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true, error: null, errorType: null });

        try {
          const items = await fetchAirQuality({
            serviceKey: API_KEY,
            sidoName: targetSido,
          });

          // 저장된 측정소가 있으면 해당 측정소 선택, 없으면 첫 번째 유효한 측정소 선택
          let selectedItem: AirQualityItem | null = null;

          if (savedStationName) {
            selectedItem = items.find(
              (item) => item.stationName === savedStationName
            ) || null;
          }

          if (!selectedItem) {
            selectedItem =
              items.find((item) => item.pm10Value || item.pm25Value) || items[0] || null;
          }

          set({
            items,
            selectedItem,
            selectedStationName: selectedItem?.stationName || null,
            isLoading: false,
            lastUpdated: new Date(),
          });

          Toast.show({
            type: 'success',
            text1: '데이터 업데이트 완료',
            text2: `${targetSido} ${selectedItem?.stationName || ''} 측정소 데이터를 불러왔습니다.`,
            visibilityTime: 2000,
          });
        } catch (error) {
          // 네트워크 에러 판별
          const isNetworkError =
            error instanceof TypeError ||
            (error instanceof Error &&
              (error.message.includes('Network') ||
                error.message.includes('fetch') ||
                error.message.includes('network') ||
                error.message.includes('Failed to fetch')));

          const errorType = isNetworkError ? 'network' : 'general';

          set({
            error: errorType,
            errorType: errorType,
            isLoading: false,
          });

          Toast.show({
            type: 'error',
            text1: '데이터 로드 실패',
            text2: isNetworkError
              ? '네트워크가 불안정합니다.'
              : '데이터를 불러오는데 실패했습니다.',
            visibilityTime: 3000,
          });
        }
      },

      // 새로고침
      refresh: async () => {
        const { selectedSido, fetchData } = get();
        await fetchData(selectedSido);
      },
    }),
    {
      name: 'air-quality-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 저장할 상태만 선택 (items, isLoading 등은 제외)
      partialize: (state) => ({
        selectedSido: state.selectedSido,
        selectedStationName: state.selectedStationName,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
