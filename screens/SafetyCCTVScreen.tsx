/**
 * SafetyCCTVScreen
 * Grid of CCTV snapshots with fullscreen modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { CCTVFrame, FullscreenImageModal } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  generateCCTVSnapshots,
  type CCTVSnapshot,
} from '@/utils/cctvSnapshots';

export default function SafetyCCTVScreen() {
  const [snapshots, setSnapshots] = useState<CCTVSnapshot[]>(
    generateCCTVSnapshots()
  );
  const [selectedSnapshot, setSelectedSnapshot] = useState<CCTVSnapshot | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setSnapshots(generateCCTVSnapshots());
      setRefreshing(false);
    }, 1000);
  };

  const handleFramePress = (snapshot: CCTVSnapshot) => {
    setSelectedSnapshot(snapshot);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedSnapshot(null), 300);
  };

  // Count by status
  const statusCounts = {
    active: snapshots.filter((s) => s.status === 'active').length,
    offline: snapshots.filter((s) => s.status === 'offline').length,
    maintenance: snapshots.filter((s) => s.status === 'maintenance').length,
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
              <Text style={styles.headerTitle}>CCTV Snapshots</Text>
              <Text style={styles.headerSubtitle}>
                {snapshots.length} active cameras
              </Text>
            </View>
          </View>

          {/* Status Summary */}
          <View style={styles.statusSummary}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: '#32CD32' }, // Active - Green
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.active}</Text>
              <Text style={styles.statusLabel}>Active</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: '#FFCC00' }, // Maintenance - Yellow
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.maintenance}</Text>
              <Text style={styles.statusLabel}>Maintenance</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: '#FF3B30' }, // Offline - Red
                ]}
              />
              <Text style={styles.statusCount}>{statusCounts.offline}</Text>
              <Text style={styles.statusLabel}>Offline</Text>
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
        {/* Grid of CCTV Frames */}
        <View style={styles.grid}>
          {snapshots.map((snapshot, index) => (
            <CCTVFrame
              key={snapshot.id}
              snapshot={snapshot}
              onPress={() => handleFramePress(snapshot)}
              delay={index * 50}
            />
          ))}
        </View>

        {/* Empty State */}
        {snapshots.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <View style={styles.emptyCard}>
              <BlurView intensity={60} tint="light" style={styles.emptyBlur}>
                <Ionicons
                  name="videocam-off"
                  size={64}
                  color={colors.gray[400]}
                />
                <Text style={styles.emptyTitle}>No Cameras Available</Text>
                <Text style={styles.emptyText}>
                  No CCTV cameras are currently active or available.
                </Text>
              </BlurView>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Fullscreen Modal */}
      <FullscreenImageModal
        visible={modalVisible}
        snapshot={selectedSnapshot}
        onClose={handleCloseModal}
      />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    marginTop: 40,
  },
  emptyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
  },
  emptyBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 40,
    alignItems: 'center',
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
});

