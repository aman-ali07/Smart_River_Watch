/**
 * WasteTrendsScreen
 * Bar chart for daily detections and pie chart for waste categories
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChartContainer } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateDailyDetections,
  generateWasteCategories,
  getTotalDetections,
  type DailyDetection,
  type WasteCategory,
} from '@/utils/wasteTrends';

const { width } = Dimensions.get('window');
const chartWidth = width - 80;

export default function WasteTrendsScreen() {
  const [dailyDetections] = useState<DailyDetection[]>(generateDailyDetections());
  const [wasteCategories] = useState<WasteCategory[]>(generateWasteCategories());

  const totalDetections = getTotalDetections(wasteCategories);

  // Prepare bar chart data
  const barChartData = {
    labels: dailyDetections.map((d) => d.label),
    datasets: [
      {
        data: dailyDetections.map((d) => d.count),
      },
    ],
  };

  // Prepare pie chart data
  const pieChartData = wasteCategories.map((category) => ({
    name: category.name,
    population: category.count,
    color: category.color,
    legendFontColor: colors.text.primary.light,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`, // Primary Blue
    labelColor: (opacity = 1) => colors.text.secondary.light,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.gray[200],
      strokeWidth: 1,
      opacity: 0.3,
    },
    propsForVerticalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
  };

  const pieChartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.text.primary.light,
    style: {
      borderRadius: 16,
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
              <Text style={styles.headerTitle}>Waste Trends</Text>
              <Text style={styles.headerSubtitle}>
                Detection analytics and category distribution
              </Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalDetections}</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Daily Detections Bar Chart */}
        <ChartContainer
          title="Daily Detections"
          subtitle="Last 7 days"
          icon="bar-chart"
          variant="glass"
          style={styles.chartCard}>
          <View style={styles.chartWrapper}>
            <BarChart
              data={barChartData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withShadow={true}
              showValuesOnTopOfBars={true}
              fromZero={true}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              segments={4}
            />
          </View>
        </ChartContainer>

        {/* Waste Categories Pie Chart */}
        <ChartContainer
          title="Waste Categories"
          subtitle="Distribution by type"
          icon="pie-chart"
          variant="glass"
          style={styles.chartCard}>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={chartWidth}
              height={220}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // Show absolute values instead of percentages
            />
          </View>

          {/* Category Legend */}
          <View style={styles.legendContainer}>
            {wasteCategories.map((category, index) => (
              <View key={category.name} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: category.color },
                  ]}
                />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendName}>{category.name}</Text>
                  <Text style={styles.legendCount}>
                    {category.count} ({Math.round((category.count / totalDetections) * 100)}%)
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ChartContainer>

        {/* Summary Stats */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.summaryCard}>
          <BlurView intensity={60} tint="light" style={styles.summaryBlur}>
            <Text style={styles.summaryTitle}>Weekly Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Ionicons
                  name="trending-up"
                  size={24}
                  color={colors.primary[500]}
                />
                <Text style={styles.summaryValue}>
                  {dailyDetections.reduce((sum, d) => sum + d.count, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Total Detections</Text>
              </View>
              <View style={styles.summaryStat}>
                <Ionicons
                  name="calendar"
                  size={24}
                  color={colors.ecoGreen[500]}
                />
                <Text style={styles.summaryValue}>
                  {Math.round(
                    dailyDetections.reduce((sum, d) => sum + d.count, 0) / 7
                  )}
                </Text>
                <Text style={styles.summaryLabel}>Daily Average</Text>
              </View>
              <View style={styles.summaryStat}>
                <Ionicons
                  name="trophy"
                  size={24}
                  color={colors.warning[500]}
                />
                <Text style={styles.summaryValue}>
                  {Math.max(...dailyDetections.map((d) => d.count))}
                </Text>
                <Text style={styles.summaryLabel}>Peak Day</Text>
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
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  chartCard: {
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
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  legendCount: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
  },
  summaryBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
});

