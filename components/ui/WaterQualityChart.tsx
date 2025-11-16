/**
 * WaterQualityChart Component
 * Line chart with bezier curves and gradient fill
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/theme';

const { width } = Dimensions.get('window');
const chartWidth = width - 80; // Full width minus padding

interface WaterQualityChartProps {
  title: string;
  data: number[];
  labels: string[];
  unit: string;
  color: string;
  minValue?: number;
  maxValue?: number;
  delay?: number;
}

export default function WaterQualityChart({
  title,
  data,
  labels,
  unit,
  color,
  minValue,
  maxValue,
  delay = 0,
}: WaterQualityChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => color,
        strokeWidth: 3,
      },
    ],
  };

  // Create gradient color with opacity
  const gradientColor = (opacity: number = 1) => {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: gradientColor(0.1),
    backgroundGradientTo: gradientColor(0.05),
    decimalPlaces: 1,
    color: (opacity = 1) => color,
    labelColor: (opacity = 1) => colors.text.secondary.light,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: color,
      fill: colors.background.light,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.gray[200],
      strokeWidth: 1,
      opacity: 0.3,
    },
    fillShadowGradient: color,
    fillShadowGradientOpacity: 0.3,
    propsForVerticalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      fill: colors.text.secondary.light,
    },
  };

  // Calculate min/max for better visualization
  const dataMin = minValue !== undefined ? minValue : Math.min(...data);
  const dataMax = maxValue !== undefined ? maxValue : Math.max(...data);
  const range = dataMax - dataMin || 1;
  const padding = range * 0.1; // 10% padding

  return (
    <Animated.View
      entering={FadeInDown.duration(600).delay(delay)}
      style={styles.container}>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
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
          scrollableDotFill={color}
          segments={4}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix={unit}
          yAxisInterval={1}
          fromZero={false}
          yAxisMin={dataMin - padding}
          yAxisMax={dataMax + padding}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  chartWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

