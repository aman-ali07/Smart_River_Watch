/**
 * WasteCard Component
 * Card displaying AI-detected waste image with severity badge
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors, gradients, shadows } from '@/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85; // 85% of screen width

export type WasteSeverity = 'low' | 'medium' | 'high';

interface WasteCardProps {
  imageUrl?: string;
  severity: WasteSeverity;
  wasteType: string;
  timestamp: string;
  location?: string;
  delay?: number;
}

const severityConfig = {
  low: {
    color: colors.ecoGreen[500],
    bgColor: colors.ecoGreen[50],
    borderColor: colors.ecoGreen[200],
    gradient: gradients.status.success,
    label: 'Low',
  },
  medium: {
    color: colors.warning[500],
    bgColor: colors.warning[50],
    borderColor: colors.warning[200],
    gradient: gradients.status.warning,
    label: 'Medium',
  },
  high: {
    color: colors.alert[500],
    bgColor: colors.alert[50],
    borderColor: colors.alert[200],
    gradient: gradients.status.alert,
    label: 'High',
  },
};

const wasteTypeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  plastic: 'bag',
  paper: 'document',
  metal: 'construct',
  glass: 'cube',
  organic: 'leaf',
  other: 'trash',
};

export default function WasteCard({
  imageUrl,
  severity,
  wasteType,
  timestamp,
  location,
  delay = 0,
}: WasteCardProps) {
  const config = severityConfig[severity];
  const icon = wasteTypeIcons[wasteType.toLowerCase()] || 'trash';

  // Format timestamp
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(600).delay(delay)}
      style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurCard}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={gradients.water.flow.colors as unknown as readonly [string, string, ...string[]]}
              start={gradients.water.flow.start}
              end={gradients.water.flow.end}
              style={styles.placeholderImage}>
              <Ionicons name={icon} size={48} color={colors.text.inverse.light} />
              <Text style={styles.placeholderText}>Waste Detected</Text>
            </LinearGradient>
          )}

          {/* Severity Badge */}
          <View style={styles.severityBadgeContainer}>
            <LinearGradient
              colors={config.gradient.colors}
              start={config.gradient.start}
              end={config.gradient.end}
              style={styles.severityBadge}>
              <Text style={styles.severityText}>{config.label}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Waste Type */}
          <View style={styles.wasteTypeRow}>
            <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
              <Ionicons name={icon} size={20} color={config.color} />
            </View>
            <Text style={styles.wasteType}>{wasteType}</Text>
          </View>

          {/* Timestamp */}
          <View style={styles.timestampRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.text.secondary.light}
            />
            <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
          </View>

          {/* Location (if provided) */}
          {location && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.text.secondary.light}
              />
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.lg,
  },
  blurCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.inverse.light,
  },
  severityBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...shadows.md,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.inverse.light,
  },
  content: {
    padding: 16,
  },
  wasteTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  wasteType: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    flex: 1,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: colors.text.secondary.light,
    marginLeft: 6,
    flex: 1,
  },
});

