/**
 * WasteHotspotMapScreen
 * Heatmap showing waste density hotspots with interactive popups
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
import { HotspotPopup } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { MAP_CONFIG } from '@/constants';
import {
  generateWasteHotspots,
  getDensityLevel,
  getDensityColor,
  type WasteHotspot,
} from '@/utils/wasteHotspots';

const { width } = Dimensions.get('window');

export default function WasteHotspotMapScreen() {
  const [hotspots] = useState<WasteHotspot[]>(generateWasteHotspots());
  const [selectedHotspot, setSelectedHotspot] = useState<WasteHotspot | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleHotspotPress = (hotspot: WasteHotspot, event: any) => {
    setSelectedHotspot(hotspot);
    // Get touch position for popup placement
    if (event.nativeEvent) {
      setPopupPosition({
        x: event.nativeEvent.coordinate?.latitude
          ? width / 2
          : event.nativeEvent.locationX || width / 2,
        y: event.nativeEvent.locationY || 200,
      });
    } else {
      setPopupPosition({ x: width / 2, y: 200 });
    }
  };

  const handleClosePopup = () => {
    setSelectedHotspot(null);
    setPopupPosition(null);
  };

  const getCircleColor = (density: number): string => {
    const level = getDensityLevel(density);
    return getDensityColor(level);
  };

  const getCircleOpacity = (density: number): number => {
    // Higher density = higher opacity (0.2 to 0.6)
    return 0.2 + (density / 100) * 0.4;
  };

  // Count hotspots by density level
  const densityCounts = {
    critical: hotspots.filter((h) => getDensityLevel(h.density) === 'critical').length,
    high: hotspots.filter((h) => getDensityLevel(h.density) === 'high').length,
    medium: hotspots.filter((h) => getDensityLevel(h.density) === 'medium').length,
    low: hotspots.filter((h) => getDensityLevel(h.density) === 'low').length,
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
              <Text style={styles.headerTitle}>Waste Hotspots</Text>
              <Text style={styles.headerSubtitle}>
                {hotspots.length} active hotspots detected
              </Text>
            </View>
          </View>

          {/* Density Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendCircle,
                  { backgroundColor: getDensityColor('critical') },
                ]}
              />
              <Text style={styles.legendText}>Critical ({densityCounts.critical})</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendCircle,
                  { backgroundColor: getDensityColor('high') },
                ]}
              />
              <Text style={styles.legendText}>High ({densityCounts.high})</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendCircle,
                  { backgroundColor: getDensityColor('medium') },
                ]}
              />
              <Text style={styles.legendText}>Medium ({densityCounts.medium})</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendCircle,
                  { backgroundColor: getDensityColor('low') },
                ]}
              />
              <Text style={styles.legendText}>Low ({densityCounts.low})</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Map with Heatmap */}
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
        {/* Heatmap Circles */}
        {hotspots.map((hotspot) => {
          const circleColor = getCircleColor(hotspot.density);
          const opacity = getCircleOpacity(hotspot.density);
          const radius = hotspot.radius || 400;

          return (
            <Circle
              key={hotspot.id}
              center={{
                latitude: hotspot.latitude,
                longitude: hotspot.longitude,
              }}
              radius={radius}
              fillColor={`${circleColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`}
              strokeColor={circleColor}
              strokeWidth={2}
              onPress={(e) => {
                e.stopPropagation();
                handleHotspotPress(hotspot, e);
              }}
            />
          );
        })}

        {/* Hotspot Markers */}
        {hotspots.map((hotspot) => {
          const densityLevel = getDensityLevel(hotspot.density);
          const densityColor = getDensityColor(densityLevel);

          return (
            <Marker
              key={`marker-${hotspot.id}`}
              coordinate={{
                latitude: hotspot.latitude,
                longitude: hotspot.longitude,
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleHotspotPress(hotspot, e);
              }}>
              <View style={styles.markerContainer}>
                <LinearGradient
                  colors={
                    densityLevel === 'critical' || densityLevel === 'high'
                      ? gradients.status.alert.colors
                      : densityLevel === 'medium'
                      ? gradients.status.warning.colors
                      : gradients.status.success.colors
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.markerPin}>
                  <Ionicons
                    name="warning"
                    size={20}
                    color={colors.text.inverse.light}
                  />
                </LinearGradient>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>{hotspot.density}</Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Stats Popup */}
      {selectedHotspot && (
        <View style={styles.popupContainer}>
          <HotspotPopup
            hotspot={selectedHotspot}
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
              Tap on hotspots to view detailed statistics
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 11,
    color: colors.text.inverse.light,
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.light,
    ...shadows.lg,
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: colors.background.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...shadows.sm,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.primary.light,
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

