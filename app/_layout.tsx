import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Only import notification services on native platforms
let requestNotificationPermissions: (() => Promise<void>) | null = null;

if (Platform.OS !== 'web') {
  const notifications = require('@/services/notifications');
  requestNotificationPermissions = notifications.requestNotificationPermissions;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Request notification permissions on app start (native only)
    if (requestNotificationPermissions && Platform.OS !== 'web') {
      requestNotificationPermissions();
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}
