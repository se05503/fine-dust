import { create } from 'zustand';
import {
  AirQualityItem,
  SidoName,
  fetchAirQuality,
} from '@/services/airQualityApi';

// 환경 변수 또는 설정에서 API 키를 가져옵니다
// 실제 사용 시 .env 파일에 EXPO_PUBLIC_AIR_QUALITY_API_KEY 값을 설정하세요
const API_KEY = process.env.EXPO_PUBLIC_AIR_QUALITY_API_KEY || '';

interface AirQualityState {
  // 데이터
  items: AirQualityItem[];
  selectedItem: AirQualityItem | null;
  selectedSido: SidoName;
  // 상태
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  // 액션
  setSelectedSido: (sido: SidoName) => void;
  setSelectedItem: (item: AirQualityItem | null) => void;
  fetchData: (sido?: SidoName) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAirQualityStore = create<AirQualityState>((set, get) => ({
  // 초기 상태
  items: [],
  selectedItem: null,
  selectedSido: '서울',
  isLoading: false,
  error: null,
  lastUpdated: null,

  // 시도 선택
  setSelectedSido: (sido: SidoName) => {
    set({ selectedSido: sido, selectedItem: null });
    get().fetchData(sido);
  },

  // 측정소 선택
  setSelectedItem: (item: AirQualityItem | null) => {
    set({ selectedItem: item });
  },

  // 데이터 가져오기
  fetchData: async (sido?: SidoName) => {
    const targetSido = sido || get().selectedSido;

    if (!API_KEY) {
      set({
        error:
          'API 키가 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_AIR_QUALITY_API_KEY를 설정하세요.',
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const items = await fetchAirQuality({
        serviceKey: API_KEY,
        sidoName: targetSido,
      });

      // 첫 번째 측정소를 기본 선택
      const firstValidItem =
        items.find((item) => item.pm10Value || item.pm25Value) || items[0];

      set({
        items,
        selectedItem: firstValidItem || null,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : '데이터를 가져오는데 실패했습니다.',
        isLoading: false,
      });
    }
  },

  // 새로고침
  refresh: async () => {
    const { selectedSido, fetchData } = get();
    await fetchData(selectedSido);
  },
}));
