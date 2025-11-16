/**
 * MyReportsScreen
 * List of user's submitted reports with status indicators
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ReportCard } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  getUserReports,
  getReportStatusColor,
  getReportStatusLabel,
  type CitizenReport,
} from '@/services/reports';
import { useAuth } from '@/contexts/AuthContext';

export default function MyReportsScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    try {
      if (!user) {
        setReports([]);
        setLoading(false);
        return;
      }

      const userReports = await getUserReports();
      setReports(userReports);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      // For MVP, use mock data if Firebase fails
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
  };

  // Count reports by status
  const statusCounts = {
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={gradients.water.flow.colors}
          start={gradients.water.flow.start}
          end={gradients.water.flow.end}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.emptyContainer}>
          <BlurView intensity={60} tint="light" style={styles.emptyCard}>
            <Ionicons name="lock-closed" size={64} color={colors.gray[400]} />
            <Text style={styles.emptyTitle}>Authentication Required</Text>
            <Text style={styles.emptyText}>
              Please log in to view your reports.
            </Text>
          </BlurView>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.headerTitle}>My Reports</Text>
              <Text style={styles.headerSubtitle}>
                {reports.length} {reports.length === 1 ? 'report' : 'reports'} submitted
              </Text>
            </View>
          </View>

          {/* Status Summary */}
          <View style={styles.statusSummary}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getReportStatusColor('pending') },
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.pending}</Text>
              <Text style={styles.statusLabel}>Pending</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getReportStatusColor('reviewed') },
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.reviewed}</Text>
              <Text style={styles.statusLabel}>In Review</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getReportStatusColor('resolved') },
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.resolved}</Text>
              <Text style={styles.statusLabel}>Resolved</Text>
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <BlurView intensity={60} tint="light" style={styles.loadingCard}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text style={styles.loadingText}>Loading your reports...</Text>
            </BlurView>
          </View>
        ) : reports.length > 0 ? (
          reports.map((report, index) => (
            <ReportCard
              key={report.id || index}
              report={report}
              delay={index * 50}
            />
          ))
        ) : (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <BlurView intensity={60} tint="light" style={styles.emptyCard}>
              <Ionicons
                name="document-text-outline"
                size={64}
                color={colors.gray[400]}
              />
              <Text style={styles.emptyTitle}>No Reports Yet</Text>
              <Text style={styles.emptyText}>
                You haven't submitted any reports yet. Submit your first report
                to help keep the riverfront safe and clean!
              </Text>
            </BlurView>
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
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 10,
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
  loadingContainer: {
    marginTop: 40,
  },
  loadingCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 40,
    alignItems: 'center',
    ...shadows.md,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.text.secondary.light,
  },
  emptyState: {
    marginTop: 40,
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 40,
    alignItems: 'center',
    ...shadows.md,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

