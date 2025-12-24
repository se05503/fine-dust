export type Language = 'ko' | 'en' | 'ja';

export const translations = {
  ko: {
    // Header
    appName: 'AirCheck',

    // Loading
    loadingData: '데이터를 불러오는 중...',

    // Air Quality
    airQuality: '공기질',
    index: '지수',

    // PM Values
    pm10: 'PM10',
    pm25: 'PM2.5',
    unit: 'μg/m³',

    // Grades
    good: '좋음',
    moderate: '보통',
    bad: '나쁨',
    veryBad: '매우나쁨',
    unknown: '-',

    // Recommendations
    recommendations: {
      good: { text: '야외 활동하기', highlight: '좋은 날', suffix: '이에요!' },
      moderate: { text: '야외 활동', highlight: '무난한 날', suffix: '이에요.' },
      bad: { text: '야외 활동', highlight: '자제', suffix: '가 필요해요.' },
      veryBad: { text: '외출을', highlight: '삼가', suffix: '세요!' },
      unknown: { text: '데이터를', highlight: '확인', suffix: ' 중이에요.' },
    },

    // Footer
    lastUpdate: '마지막 업데이트',
    refresh: '새로고침',
    measurementTime: '측정시간',

    // Errors
    networkError: '네트워크가 불안정합니다. 잠시 후 다시 시도해주세요.',
    dataLoadError: '데이터를 불러오는데 실패했습니다.',
    apiKeyError: 'API 키가 설정되지 않았습니다.',

    // Toast
    dataUpdateSuccess: '데이터 업데이트 완료',
    dataUpdateSuccessMessage: '측정소 데이터를 불러왔습니다.',
    dataLoadFail: '데이터 로드 실패',

    // Time
    am: '오전',
    pm: '오후',

    // Language
    language: '언어',
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
  },
  en: {
    // Header
    appName: 'AirCheck',

    // Loading
    loadingData: 'Loading data...',

    // Air Quality
    airQuality: 'Air Quality',
    index: 'Index',

    // PM Values
    pm10: 'PM10',
    pm25: 'PM2.5',
    unit: 'μg/m³',

    // Grades
    good: 'Good',
    moderate: 'Moderate',
    bad: 'Bad',
    veryBad: 'Very Bad',
    unknown: '-',

    // Recommendations
    recommendations: {
      good: { text: "It's a", highlight: 'great day', suffix: ' for outdoor activities!' },
      moderate: { text: "It's a", highlight: 'decent day', suffix: ' for outdoor activities.' },
      bad: { text: 'Please', highlight: 'limit', suffix: ' outdoor activities.' },
      veryBad: { text: 'Please', highlight: 'avoid', suffix: ' going outside!' },
      unknown: { text: '', highlight: 'Checking', suffix: ' data...' },
    },

    // Footer
    lastUpdate: 'Last update',
    refresh: 'Refresh',
    measurementTime: 'Measured at',

    // Errors
    networkError: 'Network is unstable. Please try again later.',
    dataLoadError: 'Failed to load data.',
    apiKeyError: 'API key is not configured.',

    // Toast
    dataUpdateSuccess: 'Data Updated',
    dataUpdateSuccessMessage: 'Station data has been loaded.',
    dataLoadFail: 'Data Load Failed',

    // Time
    am: 'AM',
    pm: 'PM',

    // Language
    language: 'Language',
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
  },
  ja: {
    // Header
    appName: 'AirCheck',

    // Loading
    loadingData: 'データを読み込み中...',

    // Air Quality
    airQuality: '空気質',
    index: '指数',

    // PM Values
    pm10: 'PM10',
    pm25: 'PM2.5',
    unit: 'μg/m³',

    // Grades
    good: '良い',
    moderate: '普通',
    bad: '悪い',
    veryBad: '非常に悪い',
    unknown: '-',

    // Recommendations
    recommendations: {
      good: { text: '外出に', highlight: '最適な日', suffix: 'です！' },
      moderate: { text: '外出に', highlight: '問題ない日', suffix: 'です。' },
      bad: { text: '外出を', highlight: '控えた方', suffix: 'が良いです。' },
      veryBad: { text: '外出を', highlight: '避けて', suffix: 'ください！' },
      unknown: { text: 'データを', highlight: '確認', suffix: '中です。' },
    },

    // Footer
    lastUpdate: '最終更新',
    refresh: '更新',
    measurementTime: '測定時間',

    // Errors
    networkError: 'ネットワークが不安定です。しばらくしてからもう一度お試しください。',
    dataLoadError: 'データの読み込みに失敗しました。',
    apiKeyError: 'APIキーが設定されていません。',

    // Toast
    dataUpdateSuccess: 'データ更新完了',
    dataUpdateSuccessMessage: '測定所のデータを読み込みました。',
    dataLoadFail: 'データ読み込み失敗',

    // Time
    am: '午前',
    pm: '午後',

    // Language
    language: '言語',
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
  },
} as const;

export type TranslationKey = keyof typeof translations.ko;
