import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';

// 네이티브 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    // 1.5초 후 네이티브 스플래시 화면 숨김
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack />
      <Toast />
    </>
  );
}
