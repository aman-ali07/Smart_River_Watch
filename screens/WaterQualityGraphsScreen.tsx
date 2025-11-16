/**
 * WaterQualityGraphsScreen
 * Line charts for water quality parameters with time period toggles
 */

import React, { useState, useRef } from 'react';
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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChartContainer, WaterQualityChart } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { WATER_QUALITY_PARAMS } from '@/constants';
import {
  generateLabels,
  generatepHData,
  generateDOData,
  generateBODData,
  generateCODData,
  generateTDSData,
  generateTurbidityData,
  generateMicrobialLoadData,
  type TimePeriod,
} from '@/utils/chartData';

const { width } = Dimensions.get('window');

const timePeriods: TimePeriod[] = ['24h', '7d', '30d'];

const parameters = [
  {
    key: 'pH',
    title: 'pH Level',
    icon: 'water' as const,
    unit: WATER_QUALITY_PARAMS.pH.unit,
    color: colors.primary[500],
    generateData: generatepHData,
    minValue: 6.0,
    maxValue: 9.0,
  },
  {
    key: 'DO',
    title: 'Dissolved Oxygen',
    icon: 'airplane' as const,
    unit: WATER_QUALITY_PARAMS.DO.unit,
    color: colors.ecoGreen[500],
    generateData: generateDOData,
    minValue: 0,
    maxValue: 20,
  },
  {
    key: 'BOD',
    title: 'BOD',
    icon: 'leaf' as const,
    unit: WATER_QUALITY_PARAMS.BOD.unit,
    color: colors.warning[500],
    generateData: generateBODData,
    minValue: 0,
    maxValue: 5,
  },
  {
    key: 'COD',
    title: 'COD',
    icon: 'flask' as const,
    unit: WATER_QUALITY_PARAMS.COD.unit,
    color: colors.alert[500],
    generateData: generateCODData,
    minValue: 0,
    maxValue: 300,
  },
  {
    key: 'TDS',
    title: 'TDS',
    icon: 'cube' as const,
    unit: WATER_QUALITY_PARAMS.TDS.unit,
    color: colors.deepBlue[500],
    generateData: generateTDSData,
    minValue: 0,
    maxValue: 600,
  },
  {
    key: 'Turbidity',
    title: 'Turbidity',
    icon: 'cloudy' as const,
    unit: WATER_QUALITY_PARAMS.TURBIDITY.unit,
    color: colors.warning[600],
    generateData: generateTurbidityData,
    minValue: 0,
    maxValue: 6,
  },
  {
    key: 'MicrobialLoad',
    title: 'Microbial Load',
    icon: 'bug' as const,
    unit: 'CFU/mL',
    color: colors.alert[600],
    generateData: generateMicrobialLoadData,
    minValue: 0,
    maxValue: 800,
  },
];

export default function WaterQualityGraphsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('24h');
  const scrollViewRef = useRef<ScrollView>(null);

  const labels = generateLabels(selectedPeriod);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    // Scroll to top when period changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
              <Text style={styles.headerTitle}>Water Quality Trends</Text>
              <Text style={styles.headerSubtitle}>
                Historical data visualization
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Time Period Toggle */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        style={styles.toggleContainer}>
        <BlurView intensity={60} tint="light" style={styles.toggleBlur}>
          <View style={styles.toggleButtons}>
            {timePeriods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => handlePeriodChange(period)}
                activeOpacity={0.7}
                style={[
                  styles.toggleButton,
                  selectedPeriod === period && styles.toggleButtonActive,
                ]}>
                {selectedPeriod === period ? (
                  <LinearGradient
                    colors={gradients.primary.default.colors}
                    start={gradients.primary.default.start}
                    end={gradients.primary.default.end}
                    style={styles.toggleGradient}>
                    <Text style={styles.toggleTextActive}>{period}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.toggleText}>{period}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </Animated.View>

      {/* Swipeable Charts */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        {parameters.map((param, index) => {
          const data = param.generateData(selectedPeriod);

          return (
            <ChartContainer
              key={param.key}
              title={param.title}
              icon={param.icon}
              variant="glass"
              style={styles.chartCard}>
              <WaterQualityChart
                title={param.title}
                data={data}
                labels={labels}
                unit={param.unit}
                color={param.color}
                minValue={param.minValue}
                maxValue={param.maxValue}
                delay={index * 100}
              />
            </ChartContainer>
          );
        })}
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
  toggleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 9,
  },
  toggleBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.sm,
  },
  toggleButtons: {
    flexDirection: 'row',
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  toggleButtonActive: {
    ...shadows.sm,
  },
  toggleGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
    textAlign: 'center',
    paddingVertical: 10,
  },
  toggleTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse.light,
    textAlign: 'center',
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
});

