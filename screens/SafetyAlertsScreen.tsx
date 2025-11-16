/**
 * SafetyAlertsScreen
 * List of safety alerts with expandable items
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ExpandableAlert } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateSafetyAlerts,
  getSafetySeverityColor,
  type SafetyAlert,
} from '@/utils/safetyAlerts';

export default function SafetyAlertsScreen() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(generateSafetyAlerts());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(generateSafetyAlerts());
      setRefreshing(false);
    }, 1000);
  };

  // Count alerts by severity
  const severityCounts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    moderate: alerts.filter((a) => a.severity === 'moderate').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={gradients.water.flow.colors}
        start={gradients.water.flow.start}
        end={gradients.water.flow.end}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Blur Header */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <BlurView intensity={80} tint="light" style={styles.blurHeader}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Safety Alerts</Text>
              <Text style={styles.headerSubtitle}>
                {alerts.length} active safety alerts
              </Text>
            </View>
          </View>

          {/* Severity Summary */}
          <View style={styles.severitySummary}>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSafetySeverityColor('critical') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.critical}</Text>
              <Text style={styles.severityLabel}>Critical</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSafetySeverityColor('high') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.high}</Text>
              <Text style={styles.severityLabel}>High</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSafetySeverityColor('moderate') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.moderate}</Text>
              <Text style={styles.severityLabel}>Moderate</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSafetySeverityColor('low') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.low}</Text>
              <Text style={styles.severityLabel}>Low</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}>
        {alerts.map((alert, index) => (
          <Animated.View
            key={alert.id}
            entering={FadeInDown.duration(600).delay(index * 80)}>
            <ExpandableAlert alert={alert} delay={index * 80} />
          </Animated.View>
        ))}

        {/* Empty State */}
        {alerts.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <View style={styles.emptyCard}>
              <BlurView intensity={60} tint="light" style={styles.emptyBlur}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={colors.ecoGreen[500]}
                />
                <Text style={styles.emptyTitle}>No Active Alerts</Text>
                <Text style={styles.emptyText}>
                  All safety conditions are normal. Continue monitoring.
                </Text>
              </BlurView>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  blurHeader: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.md,
  },
  headerContent: {
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 12,
  },
  severitySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  severityItem: {
    alignItems: 'center',
    flex: 1,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  severityCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 2,
  },
  severityLabel: {
    fontSize: 10,
    color: colors.text.secondary.light,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  emptyState: {
    marginTop: 40,
  },
  emptyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
  },
  emptyBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: 20,
  },
});

