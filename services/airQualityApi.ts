// 시도별 실시간 측정정보 조회 API 서비스
// API 문서: http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty

// 시도 목록
export const SIDO_LIST = [
  '전국',
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
  '세종',
] as const;

export type SidoName = (typeof SIDO_LIST)[number];

// API 응답 아이템 타입 (버전 1.5)
export interface AirQualityItem {
  stationName: string; // 측정소명
  stationCode?: string; // 측정소 코드
  mangName?: string; // 측정망 정보
  sidoName: string; // 시도명
  dataTime: string; // 측정일시
  // 오염물질 농도 (버전 1.5: 소수점 확대)
  so2Value: string | null; // 아황산가스 농도 (ppm)
  coValue: string | null; // 일산화탄소 농도 (ppm)
  o3Value: string | null; // 오존 농도 (ppm)
  no2Value: string | null; // 이산화질소 농도 (ppm)
  pm10Value: string | null; // 미세먼지 PM10 (㎍/㎥)
  pm10Value24: string | null; // PM10 24시간 예측이동농도
  pm25Value: string | null; // 미세먼지 PM2.5 (㎍/㎥)
  pm25Value24: string | null; // PM2.5 24시간 예측이동농도
  // 통합대기환경지수
  khaiValue: string | null; // 통합대기환경수치
  khaiGrade: string | null; // 통합대기환경지수 (1:좋음, 2:보통, 3:나쁨, 4:매우나쁨)
  // 개별 오염물질 등급
  so2Grade: string | null;
  coGrade: string | null;
  o3Grade: string | null;
  no2Grade: string | null;
  pm10Grade: string | null; // PM10 24시간 등급
  pm25Grade: string | null; // PM2.5 24시간 등급
  pm10Grade1h?: string | null; // PM10 1시간 등급
  pm25Grade1h?: string | null; // PM2.5 1시간 등급
  // 플래그 (측정자료 상태정보)
  so2Flag: string | null;
  coFlag: string | null;
  o3Flag: string | null;
  no2Flag: string | null;
  pm10Flag: string | null;
  pm25Flag: string | null;
}

// API 응답 타입
export interface AirQualityResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: AirQualityItem[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 등급별 정보
export const GRADE_INFO = {
  '1': { label: '좋음', color: '#4ade80', bgColor: 'bg-green-400' },
  '2': { label: '보통', color: '#60a5fa', bgColor: 'bg-blue-400' },
  '3': { label: '나쁨', color: '#fbbf24', bgColor: 'bg-yellow-400' },
  '4': { label: '매우나쁨', color: '#ef4444', bgColor: 'bg-red-500' },
} as const;

export type GradeKey = keyof typeof GRADE_INFO;

// API 요청 파라미터
interface FetchAirQualityParams {
  serviceKey: string;
  sidoName: SidoName;
  pageNo?: number;
  numOfRows?: number;
}

// API 호출 함수
export async function fetchAirQuality({
  serviceKey,
  sidoName,
  pageNo = 1,
  numOfRows = 100,
}: FetchAirQualityParams): Promise<AirQualityItem[]> {
  const baseUrl =
    'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';

  const params = new URLSearchParams({
    serviceKey,
    sidoName: encodeURIComponent(sidoName),
    pageNo: String(pageNo),
    numOfRows: String(numOfRows),
    returnType: 'json',
    ver: '1.5',
  });

  // sidoName은 이미 인코딩되어 있으므로 URLSearchParams가 다시 인코딩하지 않도록
  const url = `${baseUrl}?serviceKey=${serviceKey}&sidoName=${encodeURIComponent(sidoName)}&pageNo=${pageNo}&numOfRows=${numOfRows}&returnType=json&ver=1.5`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AirQualityResponse = await response.json();

    if (data.response.header.resultCode !== '00') {
      throw new Error(
        `API error: ${data.response.header.resultMsg} (code: ${data.response.header.resultCode})`
      );
    }

    return data.response.body.items || [];
  } catch (error) {
    console.error('Failed to fetch air quality data:', error);
    throw error;
  }
}

// 등급 정보 가져오기 헬퍼
export function getGradeInfo(grade: string | null) {
  if (!grade || !(grade in GRADE_INFO)) {
    return { label: '-', color: '#9ca3af', bgColor: 'bg-gray-400' };
  }
  return GRADE_INFO[grade as GradeKey];
}

// 통합대기환경지수로 전체 상태 판단
export function getOverallStatus(khaiGrade: string | null) {
  return getGradeInfo(khaiGrade);
}
