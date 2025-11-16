/**
 * UnsafeZoneMapScreen
 * Map showing unsafe zones with danger markers and ripple animations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { DangerRipple, DangerPopup } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { MAP_CONFIG } from '@/constants';
import {
  generateUnsafeZones,
  getSeverityColor,
  getDangerIcon,
  type UnsafeZone,
} from '@/utils/unsafeZones';

const { width } = Dimensions.get('window');

export default function UnsafeZoneMapScreen() {
  const [zones] = useState<UnsafeZone[]>(generateUnsafeZones());
  const [selectedZone, setSelectedZone] = useState<UnsafeZone | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleZonePress = (zone: UnsafeZone, event: any) => {
    setSelectedZone(zone);
    // Get touch position for popup placement
    if (event.nativeEvent) {
      setPopupPosition({
        x: event.nativeEvent.locationX || width / 2,
        y: event.nativeEvent.locationY || 200,
      });
    } else {
      setPopupPosition({ x: width / 2, y: 200 });
    }
  };

  const handleClosePopup = () => {
    setSelectedZone(null);
    setPopupPosition(null);
  };

  // Count zones by severity
  const severityCounts = {
    critical: zones.filter((z) => z.severity === 'critical').length,
    high: zones.filter((z) => z.severity === 'high').length,
    moderate: zones.filter((z) => z.severity === 'moderate').length,
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
              <Text style={styles.headerTitle}>Unsafe Zones</Text>
              <Text style={styles.headerSubtitle}>
                {zones.length} danger zones detected
              </Text>
            </View>
          </View>

          {/* Severity Summary */}
          <View style={styles.severitySummary}>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor('critical') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.critical}</Text>
              <Text style={styles.severityLabel}>Critical</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor('high') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.high}</Text>
              <Text style={styles.severityLabel}>High</Text>
            </View>
            <View style={styles.severityItem}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor('moderate') },
                ]}
              />
              <Text style={styles.severityCount}>{severityCounts.moderate}</Text>
              <Text style={styles.severityLabel}>Moderate</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: MAP_CONFIG.DEFAULT_LATITUDE,
          longitude: MAP_CONFIG.DEFAULT_LONGITUDE,
          latitudeDelta: MAP_CONFIG.REGION_DELTA.latitudeDelta,
          longitudeDelta: MAP_CONFIG.REGION_DELTA.longitudeDelta,
        }}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
        onPress={handleClosePopup}>
        {/* Danger Zones with Ripple Circles */}
        {zones.map((zone) => {
          const zoneColor = getSeverityColor(zone.severity);
          const dangerIcon = getDangerIcon(zone.dangerType);

          return (
            <React.Fragment key={zone.id}>
              {/* Ripple Animation Circle */}
              <Circle
                key={`circle-${zone.id}`}
                center={zone.location}
                radius={zone.radius}
                fillColor={`${zoneColor}20`}
                strokeColor={zoneColor}
                strokeWidth={2}
                onPress={(e) => {
                  e.stopPropagation();
                  handleZonePress(zone, e);
                }}
              />

              {/* Danger Marker */}
              <Marker
                key={`marker-${zone.id}`}
                coordinate={zone.location}
                onPress={(e) => {
                  e.stopPropagation();
                  handleZonePress(zone, e);
                }}>
                <View style={styles.markerContainer}>
                  {/* Ripple Animation */}
                  <View style={styles.rippleContainer}>
                    <DangerRipple
                      size={80}
                      color={zoneColor}
                      delay={0}
                    />
                    <DangerRipple
                      size={80}
                      color={zoneColor}
                      delay={400}
                    />
                    <DangerRipple
                      size={80}
                      color={zoneColor}
                      delay={800}
                    />
                  </View>

                  {/* Danger Pin */}
                  <LinearGradient
                    colors={
                      zone.severity === 'critical'
                        ? gradients.status.alert.colors
                        : zone.severity === 'high'
                        ? gradients.status.alert.colors
                        : gradients.status.warning.colors
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.dangerPin}>
                    <Ionicons
                      name={dangerIcon}
                      size={24}
                      color={colors.text.inverse.light}
                    />
                  </LinearGradient>
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText}>{zone.name}</Text>
                  </View>
                </View>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>

      {/* Danger Popup */}
      {selectedZone && (
        <View style={styles.popupContainer}>
          <DangerPopup
            zone={selectedZone}
            onClose={handleClosePopup}
            position={popupPosition || undefined}
          />
        </View>
      )}

      {/* Info Footer */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(300)}
        style={styles.footer}>
        <BlurView intensity={60} tint="light" style={styles.footerBlur}>
          <View style={styles.footerContent}>
            <Ionicons
              name="information-circle"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.footerText}>
              Tap on danger markers to view detailed information. Avoid marked unsafe zones.
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
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 2,
  },
  severityLabel: {
    fontSize: 10,
    color: colors.text.secondary.light,
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  rippleContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background.light,
    ...shadows.xl,
    zIndex: 10,
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: colors.background.light,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    ...shadows.md,
    maxWidth: 120,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.primary.light,
    textAlign: 'center',
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
    zIndex: 1000,
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

