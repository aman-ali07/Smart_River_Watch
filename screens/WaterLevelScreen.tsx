/**
 * WaterLevelScreen
 * Circular animated gauge showing water level with rainfall card
 */

import { GlassCard, WaterLevelGauge } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateRainfallData,
  generateWaterLevelData,
  getStatusColor,
  getWaterLevelStatus,
  type RainfallData,
  type WaterLevelData,
} from '@/utils/waterLevel';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WaterLevelScreen() {
  const [waterLevel] = useState<WaterLevelData>(generateWaterLevelData());
  const [rainfall] = useState<RainfallData>(generateRainfallData());

  const status = getWaterLevelStatus(waterLevel.currentLevel, waterLevel.capacity);
  const statusColor = getStatusColor(status);
  const percentage = Math.round((waterLevel.currentLevel / waterLevel.capacity) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={gradients.water.flow.colors as unknown as readonly [string, string, ...string[]]}
        start={gradients.water.flow.start}
        end={gradients.water.flow.end}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Blur Header */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <BlurView intensity={80} tint="light" style={styles.blurHeader}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Water Level Monitor</Text>
              <Text style={styles.headerSubtitle}>
                Real-time water level tracking
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColor + '20' },
              ]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Water Level Gauge */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          style={styles.gaugeContainer}>
          <GlassCard intensity={80} tint="light" style={styles.gaugeCard}>
            <WaterLevelGauge
              level={waterLevel.currentLevel}
              capacity={waterLevel.capacity}
              size={280}
              strokeWidth={24}
            />
          </GlassCard>
        </Animated.View>

        {/* Level Info Cards */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.infoCards}>
          <GlassCard intensity={60} tint="light" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Ionicons
                name="water"
                size={24}
                color={colors.primary[500]}
              />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardLabel}>Current Level</Text>
                <Text style={styles.infoCardValue}>
                  {waterLevel.currentLevel.toFixed(2)} meters
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard intensity={60} tint="light" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Ionicons
                name="speedometer"
                size={24}
                color={colors.warning[500]}
              />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardLabel}>Capacity</Text>
                <Text style={styles.infoCardValue}>
                  {percentage}% filled
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Rainfall Card */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.rainfallContainer}>
          <GlassCard intensity={80} tint="light" style={styles.rainfallCard}>
            <View style={styles.rainfallHeader}>
              <View style={styles.rainfallHeaderLeft}>
                <View style={styles.rainfallIconContainer}>
                  <Ionicons
                    name="rainy"
                    size={28}
                    color={colors.deepBlue[500]}
                  />
                </View>
                <View>
                  <Text style={styles.rainfallTitle}>Rainfall Data</Text>
                  <Text style={styles.rainfallSubtitle}>
                    Precipitation tracking
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rainfallStats}>
              <View style={styles.rainfallStat}>
                <Text style={styles.rainfallStatLabel}>Today</Text>
                <Text style={styles.rainfallStatValue}>
                  {rainfall.today} mm
                </Text>
              </View>
              <View style={styles.rainfallStat}>
                <Text style={styles.rainfallStatLabel}>Yesterday</Text>
                <Text style={styles.rainfallStatValue}>
                  {rainfall.yesterday} mm
                </Text>
              </View>
              <View style={styles.rainfallStat}>
                <Text style={styles.rainfallStatLabel}>This Week</Text>
                <Text style={styles.rainfallStatValue}>
                  {rainfall.weekTotal} mm
                </Text>
              </View>
              <View style={styles.rainfallStat}>
                <Text style={styles.rainfallStatLabel}>This Month</Text>
                <Text style={styles.rainfallStatValue}>
                  {rainfall.monthTotal} mm
                </Text>
              </View>
            </View>

            <View style={styles.rainfallFooter}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.text.secondary.light}
              />
              <Text style={styles.rainfallFooterText}>
                Updated: {new Date(rainfall.lastUpdated).toLocaleTimeString()}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gaugeCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    padding: 16,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
  },
  rainfallContainer: {
    marginBottom: 20,
  },
  rainfallCard: {
    padding: 20,
  },
  rainfallHeader: {
    marginBottom: 20,
  },
  rainfallHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rainfallIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.deepBlue[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rainfallTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  rainfallSubtitle: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  rainfallStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  rainfallStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rainfallStatLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 8,
    fontWeight: '500',
  },
  rainfallStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary.light,
  },
  rainfallFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  rainfallFooterText: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
});

