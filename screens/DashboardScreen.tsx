/**
 * DashboardScreen
 * Premium dashboard with river health metrics, charts, and quick actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  GlassCard,
  GradientCard,
  StatusChip,
  PrimaryButton,
  CircularProgress,
  MiniChart,
} from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { calculateRiverHealth } from '@/utils/riverHealth';

const { width } = Dimensions.get('window');

// Mock data - replace with real data from API/store
const mockWaterData = {
  pH: 7.2,
  DO: 8.5,
  BOD: 2.1,
  COD: 180,
  turbidity: 3.2,
  temperature: 24,
  TDS: 320,
};

const mockWasteData = {
  detectionLevel: 12,
  floatingWaste: 8,
  plasticCount: 15,
};

const mockFloodData = {
  riskLevel: 15,
  waterLevel: 2.8,
  rainfall: 12,
};

const mockBiodiversityData = {
  speciesCount: 18,
  diversityIndex: 0.75,
  aquaticLife: 82,
};

// Calculate river health score
const riverHealth = calculateRiverHealth(
  mockWaterData,
  mockWasteData,
  mockFloodData,
  mockBiodiversityData
);

const mockData = {
  riverHealthScore: riverHealth.score,
  riverHealthStatus: riverHealth.status,
  riverHealthRating: riverHealth.rating,
  waterQualityIndex: riverHealth.breakdown.waterQuality,
  wasteDetectionLevel: mockWasteData.detectionLevel || 0,
  floodRisk: mockFloodData.riskLevel || 0,
  safetyAlerts: 3,
  citizenReports: 24,
  waterQualityTrend: [72, 75, 78, 80, 82, 85, riverHealth.breakdown.waterQuality],
  wasteTrend: [15, 14, 13, 12, 12, 12, mockWasteData.detectionLevel || 12],
  floodTrend: [20, 18, 17, 16, 15, 15, mockFloodData.riskLevel || 15],
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  // Animated header
  const headerScale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }));

  // Get health status from calculated result
  const healthStatusMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    excellent: 'success',
    good: 'info',
    fair: 'warning',
    poor: 'danger',
    critical: 'danger',
  };

  const healthStatus = {
    label: mockData.riverHealthStatus,
    color: healthStatusMap[mockData.riverHealthRating] || 'info',
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
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <BlurView intensity={80} tint="light" style={styles.blurHeader}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Sabarmati Riverfront</Text>
              <Text style={styles.headerSubtitle}>Ahmedabad, Gujarat</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary[500]} />
              {mockData.safetyAlerts > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{mockData.safetyAlerts}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* River Health Score */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          style={styles.healthScoreContainer}>
          <GradientCard gradient="water" style={styles.healthScoreCard}>
            <View style={styles.healthScoreContent}>
              <Text style={styles.healthScoreTitle}>River Health Score</Text>
              <CircularProgress
                value={mockData.riverHealthScore}
                size={220}
                strokeWidth={18}
                label="Health"
                gradient={
                  mockData.riverHealthRating === 'excellent'
                    ? 'success'
                    : mockData.riverHealthRating === 'fair'
                    ? 'warning'
                    : mockData.riverHealthRating === 'poor' || mockData.riverHealthRating === 'critical'
                    ? 'danger'
                    : 'primary'
                }
              />
              <View style={styles.healthStatusContainer}>
                <StatusChip
                  status={healthStatus.color}
                  label={healthStatus.label}
                  size="lg"
                />
                <Text style={styles.healthScoreValue}>
                  {mockData.riverHealthScore}/100
                </Text>
              </View>
            </View>
          </GradientCard>
        </Animated.View>

        {/* Metrics Cards Grid */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.metricsGrid}>
          {/* Water Quality Index */}
          <GlassCard intensity={90} tint="light" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="water" size={24} color={colors.primary[500]} />
              <Text style={styles.metricTitle}>Water Quality</Text>
            </View>
            <Text style={styles.metricValue}>{mockData.waterQualityIndex}</Text>
            <Text style={styles.metricUnit}>Index</Text>
            <MiniChart
              data={mockData.waterQualityTrend}
              type="line"
              color={colors.primary[500]}
              height={60}
            />
          </GlassCard>

          {/* Waste Detection Level */}
          <GlassCard intensity={90} tint="light" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="trash-outline" size={24} color={colors.warning[500]} />
              <Text style={styles.metricTitle}>Waste Level</Text>
            </View>
            <Text style={styles.metricValue}>{mockData.wasteDetectionLevel}%</Text>
            <Text style={styles.metricUnit}>Detection</Text>
            <MiniChart
              data={mockData.wasteTrend}
              type="bar"
              color={colors.warning[500]}
              height={60}
            />
          </GlassCard>

          {/* Flood Risk */}
          <GlassCard intensity={90} tint="light" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="rainy-outline" size={24} color={colors.alert[500]} />
              <Text style={styles.metricTitle}>Flood Risk</Text>
            </View>
            <Text style={styles.metricValue}>{mockData.floodRisk}%</Text>
            <Text style={styles.metricUnit}>Risk Level</Text>
            <MiniChart
              data={mockData.floodTrend}
              type="line"
              color={colors.alert[500]}
              height={60}
            />
          </GlassCard>

          {/* Safety Alerts */}
          <GlassCard intensity={90} tint="light" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.ecoGreen[500]} />
              <Text style={styles.metricTitle}>Safety</Text>
            </View>
            <Text style={styles.metricValue}>{mockData.safetyAlerts}</Text>
            <Text style={styles.metricUnit}>Active Alerts</Text>
            <View style={styles.alertBadge}>
              <StatusChip
                status={mockData.safetyAlerts > 0 ? 'warning' : 'success'}
                label={mockData.safetyAlerts > 0 ? 'Attention' : 'All Clear'}
                size="sm"
              />
            </View>
          </GlassCard>

          {/* Citizen Reports */}
          <GlassCard intensity={90} tint="light" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="people-outline" size={24} color={colors.primary[500]} />
              <Text style={styles.metricTitle}>Reports</Text>
            </View>
            <Text style={styles.metricValue}>{mockData.citizenReports}</Text>
            <Text style={styles.metricUnit}>This Week</Text>
            <View style={styles.reportBadge}>
              <Ionicons name="trending-up" size={16} color={colors.ecoGreen[500]} />
              <Text style={styles.reportTrend}>+12% from last week</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.8}
              style={styles.actionButton}>
              <LinearGradient
                colors={gradients.primary.default.colors}
                start={gradients.primary.default.start}
                end={gradients.primary.default.end}
                style={styles.actionGradient}>
                <Ionicons name="map" size={32} color={colors.text.inverse.light} />
                <Text style={styles.actionLabel}>Live River Map</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Reports')}
              activeOpacity={0.8}
              style={styles.actionButton}>
              <LinearGradient
                colors={gradients.status.success.colors}
                start={gradients.status.success.start}
                end={gradients.status.success.end}
                style={styles.actionGradient}>
                <Ionicons name="document-text" size={32} color={colors.text.inverse.light} />
                <Text style={styles.actionLabel}>Submit Report</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Monitor')}
              activeOpacity={0.8}
              style={styles.actionButton}>
              <LinearGradient
                colors={gradients.status.warning.colors}
                start={gradients.status.warning.start}
                end={gradients.status.warning.end}
                style={styles.actionGradient}>
                <Ionicons name="notifications" size={32} color={colors.text.inverse.light} />
                <Text style={styles.actionLabel}>Alerts Center</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    fontSize: 14,
    color: colors.text.secondary.light,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.alert[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background.light,
  },
  badgeText: {
    color: colors.text.inverse.light,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  healthScoreContainer: {
    marginBottom: 24,
  },
  healthScoreCard: {
    padding: 24,
  },
  healthScoreContent: {
    alignItems: 'center',
  },
  healthScoreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.inverse.light,
    marginBottom: 20,
  },
  healthStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  healthScoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse.light,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 60) / 2,
    padding: 16,
    marginBottom: 16,
    ...shadows.md,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
    flex: 1,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 12,
  },
  alertBadge: {
    marginTop: 8,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  reportTrend: {
    fontSize: 12,
    color: colors.ecoGreen[600],
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.inverse.light,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.lg,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.inverse.light,
    marginTop: 8,
    textAlign: 'center',
  },
});

