/**
 * Root App Navigator (Stack Navigator)
 * Handles authentication-based navigation
 */

import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Create a navigation ref to handle navigation outside of components
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

function AuthNavigator() {
  const { user, loading } = useAuth();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip navigation on initial mount to avoid navigation before Navigator is ready
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!loading && navigationRef.current?.isReady()) {
      if (user) {
        // User is authenticated, navigate to Dashboard
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        // User is not authenticated, navigate to Login
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Determine initial route based on auth state
  const initialRouteName = user ? 'MainTabs' : 'Login';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Modal"
        component={() => null} // Placeholder - will be replaced with actual modal screen
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Modal',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return <AuthNavigator />;
}

