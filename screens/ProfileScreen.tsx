/**
 * Profile Screen - User profile and settings
 */

import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton, GlassCard } from '@/components/ui';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation to Login is automatic
            } catch (error: any) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerStyle={styles.content}>
        <View className="p-4">
          {/* User Info Card */}
          <GlassCard intensity={80} tint="light" style={styles.card}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={48} color={colors.primary[500]} />
              </View>
              <Text style={styles.email}>{user?.email || 'No email'}</Text>
              <Text style={styles.userId}>ID: {user?.uid || 'N/A'}</Text>
              {user?.emailVerified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.ecoGreen[500]} />
                  <Text style={styles.verifiedText}>Email Verified</Text>
                </View>
              ) : (
                <View style={styles.unverifiedBadge}>
                  <Ionicons name="warning" size={16} color={colors.warning[500]} />
                  <Text style={styles.unverifiedText}>Email Not Verified</Text>
                </View>
              )}
            </View>
          </GlassCard>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <PrimaryButton
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              size="md"
              icon="log-out-outline"
              iconPosition="left"
              loading={loading}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  card: {
    padding: 24,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary.light,
    marginBottom: 8,
  },
  userId: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ecoGreen[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ecoGreen[200],
  },
  verifiedText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.ecoGreen[700],
    fontWeight: '500',
  },
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  unverifiedText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.warning[700],
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});


