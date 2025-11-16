import './global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator, { navigationRef } from './navigation/AppNavigator';
import { useColorScheme } from './hooks/use-color-scheme';
import { requestNotificationPermissions } from './services/notifications';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

