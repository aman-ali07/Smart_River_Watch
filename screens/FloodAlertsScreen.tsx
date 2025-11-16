/**
 * FloodAlertsScreen
 * List of flood alerts sorted by severity with color-coded badges
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
import { GlassCard, StatusChip } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateFloodAlerts,
  getSeverityColor,
  getSeverityStatus,
  formatAlertTimestamp,
  type FloodAlert,
} from '@/utils/floodAlerts';

export default function FloodAlertsScreen() {
  const [alerts, setAlerts] = useState<FloodAlert[]>(generateFloodAlerts());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(generateFloodAlerts());
      setRefreshing(false);
    }, 1000);
  };

  // Count alerts by severity
  const severityCounts = {
    high: alerts.filter((a) => a.severity === 'high').length,
    moderate: alerts.filter((a) => a.severity === 'moderate').length,
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
              <Text style={styles.headerTitle}>Flood Alerts</Text>
              <Text style={styles.headerSubtitle}>
                {alerts.length} active alerts
              </Text>
            </View>
          </View>

          {/* Severity Summary */}
          <View style={styles.severitySummary}>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor('high') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.high}</Text>
              <Text style={styles.severityLabel}>High</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor('moderate') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.moderate}</Text>
              <Text style={styles.severityLabel}>Moderate</Text>
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
        {alerts.map((alert, index) => {
          const severityColor = getSeverityColor(alert.severity);
          const statusType = getSeverityStatus(alert.severity);

          return (
            <Animated.View
              key={alert.id}
              entering={FadeInDown.duration(600).delay(index * 100)}
              style={styles.alertContainer}>
              <GlassCard intensity={80} tint="light" style={styles.alertCard}>
                {/* Alert Header */}
                <View style={styles.alertHeader}>
                  <View style={styles.alertHeaderLeft}>
                    <View
                      style={[
                        styles.alertIconContainer,
                        { backgroundColor: severityColor + '20' },
                      ]}>
                      <Ionicons
                        name={
                          alert.severity === 'high'
                            ? 'warning'
                            : 'alert-circle'
                        }
                        size={24}
                        color={severityColor}
                      />
                    </View>
                    <View style={styles.alertTitleContainer}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertLocation}>
                        <Ionicons
                          name="location"
                          size={12}
                          color={colors.text.secondary.light}
                        />{' '}
                        {alert.location}
                      </Text>
                    </View>
                  </View>
                  <StatusChip
                    status={statusType}
                    label={alert.severity.toUpperCase()}
                    size="sm"
                  />
                </View>

                {/* Alert Description */}
                <Text style={styles.alertDescription}>{alert.description}</Text>

                {/* Alert Stats */}
                <View style={styles.alertStats}>
                  <View style={styles.alertStat}>
                    <Ionicons
                      name="water"
                      size={16}
                      color={colors.primary[500]}
                    />
                    <Text style={styles.alertStatLabel}>Risk Level:</Text>
                    <Text
                      style={[
                        styles.alertStatValue,
                        { color: severityColor },
                      ]}>
                      {alert.riskLevel}%
                    </Text>
                  </View>
                  {alert.waterLevel && (
                    <View style={styles.alertStat}>
                      <Ionicons
                        name="speedometer"
                        size={16}
                        color={colors.warning[500]}
                      />
                      <Text style={styles.alertStatLabel}>Water Level:</Text>
                      <Text style={styles.alertStatValue}>
                        {alert.waterLevel}m
                      </Text>
                    </View>
                  )}
                  {alert.rainfall && (
                    <View style={styles.alertStat}>
                      <Ionicons
                        name="rainy"
                        size={16}
                        color={colors.deepBlue[500]}
                      />
                      <Text style={styles.alertStatLabel}>Rainfall:</Text>
                      <Text style={styles.alertStatValue}>
                        {alert.rainfall}mm
                      </Text>
                    </View>
                  )}
                </View>

                {/* Action Required */}
                {alert.actionRequired && (
                  <View
                    style={[
                      styles.actionRequiredContainer,
                      { backgroundColor: severityColor + '15' },
                    ]}>
                    <Ionicons
                      name="information-circle"
                      size={18}
                      color={severityColor}
                    />
                    <Text
                      style={[
                        styles.actionRequiredText,
                        { color: severityColor },
                      ]}>
                      {alert.actionRequired}
                    </Text>
                  </View>
                )}

                {/* Alert Footer */}
                <View style={styles.alertFooter}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={colors.text.secondary.light}
                  />
                  <Text style={styles.alertTimestamp}>
                    {formatAlertTimestamp(alert.timestamp)}
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>
          );
        })}

        {/* Empty State (if no alerts) */}
        {alerts.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <GlassCard intensity={60} tint="light" style={styles.emptyCard}>
              <Ionicons
                name="checkmark-circle"
                size={64}
                color={colors.ecoGreen[500]}
              />
              <Text style={styles.emptyTitle}>No Active Alerts</Text>
              <Text style={styles.emptyText}>
                All flood conditions are normal. Continue monitoring.
              </Text>
            </GlassCard>
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 2,
  },
  severityLabel: {
    fontSize: 11,
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
  alertContainer: {
    marginBottom: 16,
  },
  alertCard: {
    padding: 20,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
    marginRight: 12,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.text.primary.light,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  alertStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: '45%',
  },
  alertStatLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  alertStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary.light,
  },
  actionRequiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  actionRequiredText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  alertTimestamp: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  emptyState: {
    marginTop: 40,
  },
  emptyCard: {
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

