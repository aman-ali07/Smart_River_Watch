/**
 * Expo Notifications Service
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNELS } from '@/constants';
import { Alert } from './store';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.WATER_QUALITY,
        {
          name: 'Water Quality Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3B82F6',
        }
      );

      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.FLOOD,
        {
          name: 'Flood Alerts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#EF4444',
          sound: 'default',
        }
      );

      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.SAFETY,
        {
          name: 'Safety Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#F59E0B',
        }
      );

      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.GENERAL,
        {
          name: 'General Notifications',
          importance: Notifications.AndroidImportance.DEFAULT,
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  data?: any,
  channelId?: string
): Promise<string> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

/**
 * Send notification for an alert
 */
export async function sendAlertNotification(alert: Alert): Promise<void> {
  const channelId = getChannelIdForAlertType(alert.type);
  
  await scheduleNotification(
    alert.title,
    alert.message,
    {
      alertId: alert.id,
      type: alert.type,
      severity: alert.severity,
    },
    channelId
  );
}

/**
 * Get notification channel ID for alert type
 */
function getChannelIdForAlertType(
  type: Alert['type']
): string {
  switch (type) {
    case 'water_quality':
      return NOTIFICATION_CHANNELS.WATER_QUALITY;
    case 'flood':
      return NOTIFICATION_CHANNELS.FLOOD;
    case 'safety':
      return NOTIFICATION_CHANNELS.SAFETY;
    default:
      return NOTIFICATION_CHANNELS.GENERAL;
  }
}

/**
 * Get Expo Push Token for remote notifications
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    return tokenData.data;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
}

/**
 * Cancel a notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

