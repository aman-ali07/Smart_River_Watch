/**
 * SubmitReportScreen
 * Citizen report submission with photo, GPS location, and description
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { PrimaryButton, GlassCard, InputField } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { submitReport } from '@/services/reports';
import { ISSUE_TYPES } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 80;

export default function SubmitReportScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<string>(ISSUE_TYPES.OTHER);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and media library permissions to submit reports.',
        [{ text: 'OK' }]
      );
      return false;
    }

    if (locationStatus !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'Please grant location permission to automatically include your location in the report.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to submit reports.'
        );
        setGettingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      // Reverse geocode to get location name
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (address) {
          const addressParts = [
            address.street,
            address.district,
            address.city,
          ].filter(Boolean);
          setLocationName(addressParts.join(', ') || 'Current Location');
        }
      } catch (geocodeError) {
        setLocationName('Current Location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please provide a description for your report.');
      return;
    }

    if (!location) {
      Alert.alert(
        'Location Required',
        'Please wait for location to be detected or try again.'
      );
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to submit a report.');
      return;
    }

    setSubmitting(true);

    try {
      await submitReport(issueType, description, location, image || undefined);
      Alert.alert(
        'Report Submitted',
        'Your report has been submitted successfully. Thank you for your contribution!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setImage(null);
              setDescription('');
              setIssueType(ISSUE_TYPES.OTHER);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error submitting report:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const issueTypeOptions = [
    { value: ISSUE_TYPES.WASTE, label: 'Waste', icon: 'trash' },
    { value: ISSUE_TYPES.POLLUTION, label: 'Pollution', icon: 'warning' },
    { value: ISSUE_TYPES.SAFETY, label: 'Safety', icon: 'shield' },
    { value: ISSUE_TYPES.VANDALISM, label: 'Vandalism', icon: 'construct' },
    { value: ISSUE_TYPES.OTHER, label: 'Other', icon: 'ellipse' },
  ];

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
              <Text style={styles.headerTitle}>Submit Report</Text>
              <Text style={styles.headerSubtitle}>
                Help us keep the riverfront safe and clean
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Issue Type Selection */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          style={styles.section}>
          <GlassCard intensity={80} tint="light" style={styles.card}>
            <Text style={styles.sectionTitle}>Issue Type</Text>
            <View style={styles.issueTypeGrid}>
              {issueTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setIssueType(option.value)}
                  style={[
                    styles.issueTypeButton,
                    issueType === option.value && styles.issueTypeButtonActive,
                  ]}>
                  <View
                    style={[
                      styles.issueTypeIconContainer,
                      issueType === option.value &&
                        styles.issueTypeIconContainerActive,
                    ]}>
                    <Ionicons
                      name={option.icon as any}
                      size={24}
                      color={
                        issueType === option.value
                          ? colors.text.inverse.light
                          : colors.text.secondary.light
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.issueTypeLabel,
                      issueType === option.value &&
                        styles.issueTypeLabelActive,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Photo Section */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.section}>
          <GlassCard intensity={80} tint="light" style={styles.card}>
            <Text style={styles.sectionTitle}>Photo (Optional)</Text>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  style={styles.removeImageButton}>
                  <Ionicons name="close-circle" size={32} color={colors.alert[500]} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <PrimaryButton
                  title="Take Photo"
                  onPress={handleTakePhoto}
                  icon="camera-outline"
                  iconPosition="left"
                  variant="primary"
                  size="md"
                  style={styles.photoButton}
                />
                <PrimaryButton
                  title="Choose from Gallery"
                  onPress={handlePickImage}
                  icon="images-outline"
                  iconPosition="left"
                  variant="success"
                  size="md"
                  style={styles.photoButton}
                />
              </View>
            )}
          </GlassCard>
        </Animated.View>

        {/* Location Section */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.section}>
          <GlassCard intensity={80} tint="light" style={styles.card}>
            <View style={styles.locationHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
              {gettingLocation && (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              )}
            </View>
            {location ? (
              <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.primary[500]}
                  />
                  <Text style={styles.locationText}>
                    {locationName || 'Current Location'}
                  </Text>
                </View>
                <Text style={styles.locationCoords}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              </View>
            ) : (
              <View style={styles.locationPlaceholder}>
                <Ionicons
                  name="location-outline"
                  size={32}
                  color={colors.text.secondary.light}
                />
                <Text style={styles.locationPlaceholderText}>
                  Getting your location...
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.refreshLocationButton}
              disabled={gettingLocation}>
              <Ionicons
                name="refresh"
                size={18}
                color={colors.primary[500]}
              />
              <Text style={styles.refreshLocationText}>Refresh Location</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Description Section */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.section}>
          <GlassCard intensity={80} tint="light" style={styles.card}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <BlurView intensity={60} tint="light" style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe the issue in detail..."
                placeholderTextColor={colors.text.secondary.light}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </BlurView>
            <Text style={styles.helperText}>
              Please provide as much detail as possible about the issue.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(500)}
          style={styles.submitSection}>
          <PrimaryButton
            title={submitting ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            icon={submitting ? undefined : 'send'}
            iconPosition="right"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting || !location || !description.trim()}
            fullWidth
          />
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
  section: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 16,
  },
  issueTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueTypeButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  issueTypeButtonActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  issueTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  issueTypeIconContainerActive: {
    backgroundColor: colors.primary[500],
  },
  issueTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary.light,
  },
  issueTypeLabelActive: {
    color: colors.primary[700],
  },
  photoButtons: {
    gap: 12,
  },
  photoButton: {
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.background.light,
    borderRadius: 16,
    ...shadows.md,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary.light,
    flex: 1,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.text.secondary.light,
    fontFamily: 'monospace',
  },
  locationPlaceholder: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 12,
  },
  locationPlaceholderText: {
    fontSize: 14,
    color: colors.text.secondary.light,
    marginTop: 8,
  },
  refreshLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  refreshLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[500],
  },
  descriptionContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
    minHeight: 120,
  },
  descriptionInput: {
    padding: 16,
    fontSize: 14,
    color: colors.text.primary.light,
    minHeight: 120,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.secondary.light,
  },
  submitSection: {
    marginTop: 10,
    marginBottom: 20,
  },
});

