/**
 * Zustand Global State Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface WaterQualityData {
  pH: number;
  DO: number;
  BOD: number;
  COD: number;
  turbidity: number;
  temperature: number;
  tds: number;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Alert {
  id: string;
  type: 'water_quality' | 'flood' | 'safety' | 'waste' | 'maintenance';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    waterQualityAlerts: boolean;
    floodAlerts: boolean;
    safetyAlerts: boolean;
  };
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  
  // Water quality data
  waterQualityData: WaterQualityData[];
  setWaterQualityData: (data: WaterQualityData[]) => void;
  addWaterQualityData: (data: WaterQualityData) => void;
  
  // Alerts
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  
  // UI state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      // Water quality data
      waterQualityData: [],
      setWaterQualityData: (data) => set({ waterQualityData: data }),
      addWaterQualityData: (data) =>
        set((state) => ({
          waterQualityData: [data, ...state.waterQualityData].slice(0, 100), // Keep last 100 readings
        })),
      
      // Alerts
      alerts: [],
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
        })),
      markAlertAsRead: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId ? { ...alert, read: true } : alert
          ),
        })),
      clearAllAlerts: () => set({ alerts: [] }),
      
      // UI state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Loading states
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'smart-river-watch-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        alerts: state.alerts,
      }),
    }
  )
);

