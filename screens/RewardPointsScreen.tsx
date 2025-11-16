/**
 * RewardPointsScreen
 * Display reward points with animated counter, badge, and level system
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  CircularProgress,
  AnimatedCounter,
  LevelBadge,
  GlassCard,
} from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  getRewardLevel,
  getLevelConfig,
  getProgressToNextLevel,
  getPointsForNextLevel,
  formatPoints,
  getPointsBreakdown,
  type RewardLevel,
} from '@/utils/rewardPoints';

const { width } = Dimensions.get('window');

export default function RewardPointsScreen() {
  // Mock user points - in real app, this would come from backend/state
  const [userPoints, setUserPoints] = useState(1250);
  const [displayPoints, setDisplayPoints] = useState(0);

  const level = getRewardLevel(userPoints);
  const levelConfig = getLevelConfig(userPoints);
  const progress = getProgressToNextLevel(userPoints);
  const pointsNeeded = getPointsForNextLevel(userPoints);
  const breakdown = getPointsBreakdown(userPoints);

  // Animate points counter on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPoints(userPoints);
    }, 100);
    return () => clearTimeout(timer);
  }, [userPoints]);

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
            <Text style={styles.headerTitle}>Reward Points</Text>
            <Text style={styles.headerSubtitle}>Track your contributions</Text>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Points Display Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <GlassCard intensity={80} tint="light" style={styles.pointsCard}>
            <View style={styles.pointsContent}>
              {/* Level Badge */}
              <LevelBadge level={level} size="lg" delay={200} />

              {/* Animated Points Counter */}
              <View style={styles.pointsCounter}>
                <AnimatedCounter
                  value={userPoints}
                  duration={2000}
                  style={styles.pointsText}
                  formatter={(val) => formatPoints(val)}
                />
                <Text style={styles.pointsLabel}>Total Points</Text>
              </View>

              {/* Progress to Next Level */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress to Next Level</Text>
                  <Text style={styles.progressPoints}>
                    {pointsNeeded > 0
                      ? `${formatPoints(pointsNeeded)} points needed`
                      : 'Max Level Achieved!'}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <LinearGradient
                      colors={levelConfig.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: `${progress}%` }]}
                    />
                  </View>
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress)}% Complete
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Circular Progress Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <GlassCard intensity={80} tint="light" style={styles.circularCard}>
            <View style={styles.circularContent}>
              <CircularProgress
                value={progress}
                size={200}
                strokeWidth={20}
                label={levelConfig.name}
                showPercentage={false}
                gradient={
                  level === 'gold'
                    ? 'warning'
                    : level === 'silver'
                    ? 'primary'
                    : 'success'
                }
              />
              <View style={styles.circularInfo}>
                <Text style={styles.circularTitle}>Current Level</Text>
                <Text style={styles.circularSubtitle}>
                  {pointsNeeded > 0
                    ? `${formatPoints(pointsNeeded)} to ${getLevelConfig(userPoints + pointsNeeded).name}`
                    : 'You\'ve reached the highest level!'}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Points Breakdown */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)}>
          <GlassCard intensity={80} tint="light" style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Points Breakdown</Text>
            <Text style={styles.breakdownSubtitle}>
              Your contributions by category
            </Text>
            <View style={styles.breakdownList}>
              {breakdown.map((item, index) => (
                <Animated.View
                  key={item.category}
                  entering={FadeInUp.duration(400).delay(400 + index * 50)}
                  style={styles.breakdownItem}>
                  <View style={styles.breakdownItemLeft}>
                    <View
                      style={[
                        styles.breakdownIcon,
                        { backgroundColor: item.color + '20' },
                      ]}>
                      <Ionicons name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={styles.breakdownText}>
                      <Text style={styles.breakdownCategory}>{item.category}</Text>
                      <Text style={styles.breakdownPoints}>
                        {formatPoints(item.points)} points
                      </Text>
                    </View>
                  </View>
                  <View style={styles.breakdownPercentage}>
                    <Text style={styles.breakdownPercentageText}>
                      {Math.round((item.points / userPoints) * 100)}%
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* How to Earn Points */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <GlassCard intensity={80} tint="light" style={styles.earnCard}>
            <View style={styles.earnHeader}>
              <Ionicons
                name="bulb-outline"
                size={24}
                color={colors.primary[500]}
              />
              <Text style={styles.earnTitle}>How to Earn Points</Text>
            </View>
            <View style={styles.earnList}>
              <View style={styles.earnItem}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={colors.ecoGreen[500]}
                />
                <Text style={styles.earnText}>
                  Submit a report: <Text style={styles.earnPoints}>+50 points</Text>
                </Text>
              </View>
              <View style={styles.earnItem}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={colors.primary[500]}
                />
                <Text style={styles.earnText}>
                  Attend an event: <Text style={styles.earnPoints}>+100 points</Text>
                </Text>
              </View>
              <View style={styles.earnItem}>
                <Ionicons name="trash" size={20} color={colors.warning[500]} />
                <Text style={styles.earnText}>
                  Report waste: <Text style={styles.earnPoints}>+30 points</Text>
                </Text>
              </View>
              <View style={styles.earnItem}>
                <Ionicons
                  name="people"
                  size={20}
                  color={colors.deepBlue[500]}
                />
                <Text style={styles.earnText}>
                  Community engagement: <Text style={styles.earnPoints}>+25 points</Text>
                </Text>
              </View>
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
  pointsCard: {
    marginBottom: 16,
    padding: 24,
  },
  pointsContent: {
    alignItems: 'center',
  },
  pointsCounter: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  pointsText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 16,
    color: colors.text.secondary.light,
    fontWeight: '500',
  },
  progressSection: {
    width: '100%',
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  progressPoints: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[200],
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.text.secondary.light,
    textAlign: 'right',
  },
  circularCard: {
    marginBottom: 16,
    padding: 24,
  },
  circularContent: {
    alignItems: 'center',
  },
  circularInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  circularTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  circularSubtitle: {
    fontSize: 14,
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
  breakdownCard: {
    marginBottom: 16,
    padding: 20,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  breakdownSubtitle: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginBottom: 20,
  },
  breakdownList: {
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  breakdownText: {
    flex: 1,
  },
  breakdownCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  breakdownPoints: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  breakdownPercentage: {
    marginLeft: 12,
  },
  breakdownPercentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[500],
  },
  earnCard: {
    marginBottom: 16,
    padding: 20,
  },
  earnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  earnTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginLeft: 8,
  },
  earnList: {
    gap: 12,
  },
  earnItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnText: {
    fontSize: 14,
    color: colors.text.primary.light,
    marginLeft: 12,
    flex: 1,
  },
  earnPoints: {
    fontWeight: '700',
    color: colors.ecoGreen[500],
  },
});

