/**
 * WaterSensorMapScreen
 * Interactive map showing sensor locations with color-coded pins and bottom sheet stats
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleSheetProperties,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BottomSheet, StatCard } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { MAP_CONFIG } from '@/constants';
import { generateSensorData, type SensorData } from '@/utils/sensorData';
import { getpHStatus, getDOStatus, getBODStatus, getCODStatus, getTDSStatus, getTurbidityStatus } from '@/utils/waterQuality';
import { formatValue } from '@/utils/waterQuality';

export default function WaterSensorMapScreen() {
  const [sensors] = useState<SensorData[]>(generateSensorData());
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleMarkerPress = (sensor: SensorData) => {
    setSelectedSensor(sensor);
    setBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
    setTimeout(() => setSelectedSensor(null), 300); // Clear after animation
  };

  const getPinColor = (status: SensorData['status']) => {
    switch (status) {
      case 'excellent':
        return colors.ecoGreen[500];
      case 'good':
        return colors.primary[500];
      case 'fair':
        return colors.warning[500];
      case 'poor':
        return colors.alert[500];
      case 'critical':
        return colors.alert[700];
      default:
        return colors.primary[500];
    }
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
              <Text style={styles.headerTitle}>Sensor Map</Text>
              <Text style={styles.headerSubtitle}>
                {sensors.length} active sensors
              </Text>
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.ecoGreen[500] }]} />
                <Text style={styles.legendText}>Excellent</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary[500] }]} />
                <Text style={styles.legendText}>Good</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.warning[500] }]} />
                <Text style={styles.legendText}>Fair</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.alert[500] }]} />
                <Text style={styles.legendText}>Poor</Text>
              </View>
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
        mapType="standard">
        {sensors.map((sensor) => (
          <Marker
            key={sensor.id}
            coordinate={sensor.location}
            onPress={() => handleMarkerPress(sensor)}
            tracksViewChanges={false}>
            <View style={styles.markerContainer}>
              <LinearGradient
                colors={
                  sensor.status === 'excellent'
                    ? gradients.status.success.colors
                    : sensor.status === 'good'
                    ? gradients.primary.default.colors
                    : sensor.status === 'fair'
                    ? gradients.status.warning.colors
                    : gradients.status.alert.colors
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.markerPin}>
                <Ionicons
                  name="water"
                  size={20}
                  color={colors.text.inverse.light}
                />
              </LinearGradient>
              <View style={styles.markerLabel}>
                <Text style={styles.markerLabelText}>{sensor.name}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Sheet */}
      {selectedSensor && (
        <BottomSheet
          visible={bottomSheetVisible}
          onClose={handleCloseBottomSheet}
          title={selectedSensor.name}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bottomSheetContent}>
            {/* Status Header */}
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      selectedSensor.status === 'excellent'
                        ? colors.ecoGreen[50]
                        : selectedSensor.status === 'good'
                        ? colors.primary[50]
                        : selectedSensor.status === 'fair'
                        ? colors.warning[50]
                        : colors.alert[50],
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        selectedSensor.status === 'excellent'
                          ? colors.ecoGreen[700]
                          : selectedSensor.status === 'good'
                          ? colors.primary[700]
                          : selectedSensor.status === 'fair'
                          ? colors.warning[700]
                          : colors.alert[700],
                    },
                  ]}>
                  {selectedSensor.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.lastUpdated}>
                Updated: {new Date(selectedSensor.lastUpdated).toLocaleTimeString()}
              </Text>
            </View>

            {/* Water Quality Stats */}
            <Text style={styles.sectionTitle}>Water Quality Parameters</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="pH"
                  value={formatValue(selectedSensor.waterQuality.pH, 'pH')}
                  unit="pH"
                  status={getpHStatus(selectedSensor.waterQuality.pH)}
                  icon="water"
                  delay={0}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="DO"
                  value={formatValue(selectedSensor.waterQuality.DO, 'DO')}
                  unit="mg/L"
                  status={getDOStatus(selectedSensor.waterQuality.DO)}
                  icon="airplane"
                  delay={100}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="BOD"
                  value={formatValue(selectedSensor.waterQuality.BOD, 'BOD')}
                  unit="mg/L"
                  status={getBODStatus(selectedSensor.waterQuality.BOD)}
                  icon="leaf"
                  delay={200}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="COD"
                  value={formatValue(selectedSensor.waterQuality.COD, 'COD')}
                  unit="mg/L"
                  status={getCODStatus(selectedSensor.waterQuality.COD)}
                  icon="flask"
                  delay={300}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="TDS"
                  value={formatValue(selectedSensor.waterQuality.TDS, 'TDS')}
                  unit="mg/L"
                  status={getTDSStatus(selectedSensor.waterQuality.TDS)}
                  icon="cube"
                  delay={400}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title="Turbidity"
                  value={formatValue(selectedSensor.waterQuality.turbidity, 'turbidity')}
                  unit="NTU"
                  status={getTurbidityStatus(selectedSensor.waterQuality.turbidity)}
                  icon="cloudy"
                  delay={500}
                />
              </View>
            </View>

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="thermometer" size={20} color={colors.primary[500]} />
                <Text style={styles.infoLabel}>Temperature:</Text>
                <Text style={styles.infoValue}>
                  {selectedSensor.waterQuality.temperature.toFixed(1)}°C
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="trash" size={20} color={colors.warning[500]} />
                <Text style={styles.infoLabel}>Waste Level:</Text>
                <Text style={styles.infoValue}>
                  {selectedSensor.waste.detectionLevel}%
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="rainy" size={20} color={colors.alert[500]} />
                <Text style={styles.infoLabel}>Flood Risk:</Text>
                <Text style={styles.infoValue}>
                  {selectedSensor.flood.riskLevel}%
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="leaf" size={20} color={colors.ecoGreen[500]} />
                <Text style={styles.infoLabel}>Species Count:</Text>
                <Text style={styles.infoValue}>
                  {selectedSensor.biodiversity.speciesCount}
                </Text>
              </View>
            </View>
          </ScrollView>
        </BottomSheet>
      )}
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
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  bottomSheetContent: {
    paddingBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  additionalInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary.light,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
});

