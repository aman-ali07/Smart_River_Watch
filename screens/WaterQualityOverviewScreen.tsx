/**
 * WaterQualityOverviewScreen
 * Real-time water quality monitoring with IoT sensor integration ready
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { StatCard, SectionHeader } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { WATER_QUALITY_PARAMS } from '@/constants';
import {
  getpHStatus,
  getDOStatus,
  getBODStatus,
  getCODStatus,
  getTDSStatus,
  getTurbidityStatus,
  getMicrobialLoadStatus,
  formatValue,
  type WaterQualityReading,
} from '@/utils/waterQuality';

const { width } = Dimensions.get('window');

// Mock data generator - Replace with real IoT sensor data
function generateMockReading(): WaterQualityReading {
  return {
    pH: 6.8 + Math.random() * 1.5, // 6.8 - 8.3
    DO: 5 + Math.random() * 10, // 5 - 15
    BOD: Math.random() * 4, // 0 - 4
    COD: Math.random() * 300, // 0 - 300
    TDS: Math.random() * 600, // 0 - 600
    turbidity: Math.random() * 6, // 0 - 6
    temperature: 18 + Math.random() * 20, // 18 - 38
    microbialLoad: Math.random() * 800, // 0 - 800
    timestamp: new Date().toISOString(),
  };
}

export default function WaterQualityOverviewScreen() {
  const [readings, setReadings] = useState<WaterQualityReading>(generateMockReading());
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time updates (every 5 seconds)
  // Replace this with actual IoT sensor WebSocket/API polling
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(generateMockReading());
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setReadings(generateMockReading());
      setLastUpdate(new Date());
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const statCards = [
    {
      title: 'pH Level',
      value: readings.pH ? formatValue(readings.pH, 'pH') : '--',
      unit: WATER_QUALITY_PARAMS.pH.unit,
      status: readings.pH ? getpHStatus(readings.pH) : 'moderate',
      icon: 'water' as const,
      trend: 'stable' as const,
    },
    {
      title: 'Dissolved Oxygen',
      value: readings.DO ? formatValue(readings.DO, 'DO') : '--',
      unit: WATER_QUALITY_PARAMS.DO.unit,
      status: readings.DO ? getDOStatus(readings.DO) : 'moderate',
      icon: 'airplane' as const,
      trend: 'stable' as const,
    },
    {
      title: 'BOD',
      value: readings.BOD ? formatValue(readings.BOD, 'BOD') : '--',
      unit: WATER_QUALITY_PARAMS.BOD.unit,
      status: readings.BOD ? getBODStatus(readings.BOD) : 'moderate',
      icon: 'leaf' as const,
      trend: 'stable' as const,
      subtitle: 'Biological Oxygen Demand',
    },
    {
      title: 'COD',
      value: readings.COD ? formatValue(readings.COD, 'COD') : '--',
      unit: WATER_QUALITY_PARAMS.COD.unit,
      status: readings.COD ? getCODStatus(readings.COD) : 'moderate',
      icon: 'flask' as const,
      trend: 'stable' as const,
      subtitle: 'Chemical Oxygen Demand',
    },
    {
      title: 'TDS',
      value: readings.TDS ? formatValue(readings.TDS, 'TDS') : '--',
      unit: WATER_QUALITY_PARAMS.TDS.unit,
      status: readings.TDS ? getTDSStatus(readings.TDS) : 'moderate',
      icon: 'cube' as const,
      trend: 'stable' as const,
      subtitle: 'Total Dissolved Solids',
    },
    {
      title: 'Turbidity',
      value: readings.turbidity ? formatValue(readings.turbidity, 'turbidity') : '--',
      unit: WATER_QUALITY_PARAMS.TURBIDITY.unit,
      status: readings.turbidity ? getTurbidityStatus(readings.turbidity) : 'moderate',
      icon: 'cloudy' as const,
      trend: 'stable' as const,
    },
    {
      title: 'Microbial Load',
      value: readings.microbialLoad ? formatValue(readings.microbialLoad, 'microbialLoad') : '--',
      unit: 'CFU/mL',
      status: readings.microbialLoad ? getMicrobialLoadStatus(readings.microbialLoad) : 'moderate',
      icon: 'bug' as const,
      trend: 'stable' as const,
    },
  ];

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
              <Text style={styles.headerTitle}>Water Quality Overview</Text>
              <Text style={styles.headerSubtitle}>
                Real-time sensor data • Last update: {formatTime(lastUpdate)}
              </Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
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
        {/* Section Header */}
        <SectionHeader
          title="Water Quality Parameters"
          subtitle="IoT Sensor Readings"
          icon="pulse"
          style={styles.sectionHeader}
        />

        {/* Stat Cards Grid */}
        <View style={styles.cardsGrid}>
          {statCards.map((card, index) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              unit={card.unit}
              status={card.status}
              icon={card.icon}
              trend={card.trend}
              lastUpdated={formatTime(lastUpdate)}
              delay={index * 100}
              style={styles.statCard}
            />
          ))}
        </View>

        {/* Info Card */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(800)}
          style={styles.infoCard}>
          <BlurView intensity={60} tint="light" style={styles.infoBlur}>
            <View style={styles.infoContent}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary[500]}
              />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>IoT Sensor Integration</Text>
                <Text style={styles.infoDescription}>
                  Data updates automatically every 5 seconds. Connect to real
                  sensors via WebSocket or API polling for live monitoring.
                </Text>
              </View>
            </View>
          </BlurView>
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ecoGreen[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.inverse.light,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.inverse.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2, // Two columns with padding
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    ...shadows.md,
  },
  infoBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: colors.text.secondary.light,
    lineHeight: 20,
  },
});

