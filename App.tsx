import './global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator, { navigationRef } from './navigation/AppNavigator';
import { useColorScheme } from './hooks/use-color-scheme';
import {
  requestNotificationPermissions,
  setupNotificationHandlers,
  removeNotificationHandlers,
} from './services/notifications';
import { AuthProvider } from './contexts/AuthContext';
import { useStartFakeDataEngine } from './hooks/useFakeDataUpdates';
import { useStartAutoAlerts } from './hooks/useAutoAlerts';

// Component to start fake data engine
function FakeDataProvider() {
  useStartFakeDataEngine();
  return null;
}

// Component to start auto-alerts monitoring
function AutoAlertsProvider() {
  useStartAutoAlerts();
  return null;
}

// Component to setup notification handlers
function NotificationProvider() {
  const subscriptionsRef = useRef<{
    foregroundSubscription: any;
    backgroundSubscription: any;
  } | null>(null);

  useEffect(() => {
    // Setup notification handlers
    subscriptionsRef.current = setupNotificationHandlers({
      onForegroundNotification: (notification) => {
        // Handle foreground notifications
        console.log('Foreground notification:', notification);
        // You can show custom UI, update state, etc.
      },
      onBackgroundNotification: (response) => {
        // Handle background notification taps
        console.log('Background notification tapped:', response);
        // Navigation will be handled by handleNotificationNavigation
      },
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionsRef.current) {
        removeNotificationHandlers(subscriptionsRef.current);
      }
    };
  }, []);

  return null;
}

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  return (
    <AuthProvider>
      <FakeDataProvider />
      <AutoAlertsProvider />
      <NotificationProvider />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

