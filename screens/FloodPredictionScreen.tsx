/**
 * FloodPredictionScreen
 * 48-hour flood forecast with risk indicator
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChartContainer, StatusChip, GlassCard } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateFloodForecast,
  getFloodRiskStatus,
  getFloodRiskColor,
  getRiskDescription,
  type FloodRiskData,
} from '@/utils/floodPrediction';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const chartWidth = width - 80;

export default function FloodPredictionScreen() {
  const [floodData] = useState<FloodRiskData>(generateFloodForecast());

  const riskStatus = floodData.status;
  const riskColor = getFloodRiskColor(riskStatus);
  const riskDescription = getRiskDescription(riskStatus);

  // Prepare chart data
  const chartData = {
    labels: floodData.forecast.map((f) => f.label),
    datasets: [
      {
        data: floodData.forecast.map((f) => f.riskLevel),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => riskColor,
    labelColor: (opacity = 1) => colors.text.secondary.light,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: riskColor,
      fill: colors.background.light,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.gray[200],
      strokeWidth: 1,
      opacity: 0.3,
    },
    fillShadowGradient: riskColor,
    fillShadowGradientOpacity: 0.2,
    propsForVerticalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
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
              <Text style={styles.headerTitle}>Flood Prediction</Text>
              <Text style={styles.headerSubtitle}>
                48-hour forecast • Last updated:{' '}
                {new Date(floodData.lastUpdated).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Flood Risk Indicator */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          style={styles.riskIndicatorContainer}>
          <GlassCard intensity={80} tint="light" style={styles.riskCard}>
            <View style={styles.riskHeader}>
              <View style={styles.riskHeaderLeft}>
                <View
                  style={[
                    styles.riskIconContainer,
                    { backgroundColor: riskColor + '20' },
                  ]}>
                  <Ionicons
                    name={
                      riskStatus === 'high'
                        ? 'warning'
                        : riskStatus === 'moderate'
                        ? 'alert-circle'
                        : 'checkmark-circle'
                    }
                    size={32}
                    color={riskColor}
                  />
                </View>
                <View style={styles.riskTextContainer}>
                  <Text style={styles.riskTitle}>Flood Risk Status</Text>
                  <Text style={styles.riskDescription}>{riskDescription}</Text>
                </View>
              </View>
              <StatusChip
                status={
                  riskStatus === 'high'
                    ? 'danger'
                    : riskStatus === 'moderate'
                    ? 'warning'
                    : 'success'
                }
                label={riskStatus.toUpperCase()}
                size="lg"
              />
            </View>

            <View style={styles.riskStats}>
              <View style={styles.riskStat}>
                <Text style={styles.riskStatLabel}>Current Risk</Text>
                <Text style={[styles.riskStatValue, { color: riskColor }]}>
                  {floodData.currentRisk}%
                </Text>
              </View>
              <View style={styles.riskStatDivider} />
              <View style={styles.riskStat}>
                <Text style={styles.riskStatLabel}>Peak Risk (48h)</Text>
                <Text style={[styles.riskStatValue, { color: riskColor }]}>
                  {floodData.maxRisk}%
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* 48-Hour Forecast Chart */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.chartContainer}>
          <ChartContainer
            title="48-Hour Risk Forecast"
            subtitle="Flood risk prediction"
            icon="trending-up"
            variant="glass">
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={chartWidth}
                height={240}
                chartConfig={chartConfig}
                bezier // Smooth bezier curves
                withInnerLines={true}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                withDots={true}
                withShadow={true}
                withScrollableDot={true}
                scrollableDotHorizontalOffset={10}
                scrollableDotVerticalOffset={10}
                scrollableDotRadius={6}
                scrollableDotFill={riskColor}
                segments={4}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix="%"
                yAxisInterval={25}
                fromZero={true}
                yAxisMin={0}
                yAxisMax={100}
              />
            </View>
          </ChartContainer>
        </Animated.View>

        {/* Forecast Details */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.detailsContainer}>
          <GlassCard intensity={60} tint="light" style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Forecast Timeline</Text>
            <View style={styles.timeline}>
              {floodData.forecast.slice(0, 6).map((point, index) => {
                const pointStatus = getFloodRiskStatus(point.riskLevel);
                const pointColor = getFloodRiskColor(pointStatus);
                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: pointColor },
                        ]}
                      />
                      <Text style={styles.timelineLabel}>{point.label}</Text>
                    </View>
                    <View style={styles.timelineRight}>
                      <Text
                        style={[
                          styles.timelineRisk,
                          { color: pointColor },
                        ]}>
                        {point.riskLevel}%
                      </Text>
                      <Text style={styles.timelineLevel}>
                        {point.waterLevel}m
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Risk Zones Legend */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.legendContainer}>
          <BlurView intensity={60} tint="light" style={styles.legendBlur}>
            <Text style={styles.legendTitle}>Risk Levels</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getFloodRiskColor('low') },
                  ]}
                />
                <Text style={styles.legendText}>Low (0-39%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getFloodRiskColor('moderate') },
                  ]}
                />
                <Text style={styles.legendText}>Moderate (40-69%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getFloodRiskColor('high') },
                  ]}
                />
                <Text style={styles.legendText}>High (70-100%)</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  riskIndicatorContainer: {
    marginBottom: 20,
  },
  riskCard: {
    padding: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  riskHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  riskIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskTextContainer: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 13,
    color: colors.text.secondary.light,
    lineHeight: 18,
  },
  riskStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  riskStat: {
    flex: 1,
    alignItems: 'center',
  },
  riskStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  riskStatLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  riskStatValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsCard: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 16,
  },
  timeline: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  timelineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timelineRisk: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  timelineLevel: {
    fontSize: 14,
    color: colors.text.secondary.light,
    minWidth: 50,
    textAlign: 'right',
  },
  legendContainer: {
    marginBottom: 20,
  },
  legendBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    ...shadows.sm,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 12,
  },
  legendItems: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary.light,
  },
});

