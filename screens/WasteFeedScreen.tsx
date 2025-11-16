/**
 * WasteFeedScreen
 * Horizontal feed of AI-detected waste images with severity badges
 */

import React, { useState } from 'react';
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
import { WasteCard } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { generateWasteDetections, type WasteDetection } from '@/utils/wasteData';

const { width } = Dimensions.get('window');

export default function WasteFeedScreen() {
  const [wasteDetections, setWasteDetections] = useState<WasteDetection[]>(
    generateWasteDetections()
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setWasteDetections(generateWasteDetections());
      setRefreshing(false);
    }, 1000);
  };

  // Count by severity
  const severityCounts = {
    low: wasteDetections.filter((w) => w.severity === 'low').length,
    medium: wasteDetections.filter((w) => w.severity === 'medium').length,
    high: wasteDetections.filter((w) => w.severity === 'high').length,
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
              <Text style={styles.headerTitle}>Waste Detection Feed</Text>
              <Text style={styles.headerSubtitle}>
                AI-powered waste monitoring • {wasteDetections.length} detections
              </Text>
            </View>
          </View>

          {/* Severity Summary */}
          <View style={styles.severitySummary}>
            <View style={styles.severityItem}>
              <View style={[styles.severityDot, { backgroundColor: colors.alert[500] }]} />
              <Text style={styles.severityCount}>{severityCounts.high}</Text>
              <Text style={styles.severityLabel}>High</Text>
            </View>
            <View style={styles.severityItem}>
              <View style={[styles.severityDot, { backgroundColor: colors.warning[500] }]} />
              <Text style={styles.severityCount}>{severityCounts.medium}</Text>
              <Text style={styles.severityLabel}>Medium</Text>
            </View>
            <View style={styles.severityItem}>
              <View style={[styles.severityDot, { backgroundColor: colors.ecoGreen[500] }]} />
              <Text style={styles.severityCount}>{severityCounts.low}</Text>
              <Text style={styles.severityLabel}>Low</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Horizontal Scroll Feed */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
          />
        }>
        {wasteDetections.map((waste, index) => (
          <WasteCard
            key={waste.id}
            imageUrl={waste.imageUrl}
            severity={waste.severity}
            wasteType={waste.wasteType}
            timestamp={waste.timestamp}
            location={waste.location}
            delay={index * 50}
          />
        ))}
      </ScrollView>

      {/* Info Footer */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(300)}
        style={styles.footer}>
        <BlurView intensity={60} tint="light" style={styles.footerBlur}>
          <View style={styles.footerContent}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.primary[500]}
            />
            <Text style={styles.footerText}>
              Swipe horizontally to view all detections. Images are AI-detected
              and verified.
            </Text>
          </View>
        </BlurView>
      </Animated.View>
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
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 20,
    zIndex: 9,
  },
  footerBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.sm,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary.light,
    lineHeight: 16,
  },
});

