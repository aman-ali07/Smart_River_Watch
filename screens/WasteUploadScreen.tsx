/**
 * WasteUploadScreen
 * Upload photo, simulate AI detection, and display bounding boxes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { PrimaryButton, BoundingBox } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { simulateAIDetection, getDetectionSummary, getAverageConfidence } from '@/utils/aiDetection';
import type { BoundingBoxData } from '@/components/ui/BoundingBox';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 40;

export default function WasteUploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<BoundingBoxData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and media library permissions to upload photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
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
        const asset = result.assets[0];
        setImage(asset.uri);
        setImageDimensions({
          width: asset.width || IMAGE_WIDTH,
          height: asset.height || (IMAGE_WIDTH * 3) / 4,
        });
        setDetections([]);
        // Auto-process image
        setTimeout(() => {
          processImage();
        }, 500);
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
        const asset = result.assets[0];
        setImage(asset.uri);
        setImageDimensions({
          width: asset.width || IMAGE_WIDTH,
          height: asset.height || (IMAGE_WIDTH * 3) / 4,
        });
        setDetections([]);
        // Auto-process image
        setTimeout(() => {
          processImage();
        }, 500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const processImage = async () => {
    if (!image) return;

    setProcessing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const detected = simulateAIDetection();
      setDetections(detected);
      setProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setDetections([]);
    setImageDimensions(null);
    setProcessing(false);
  };

  const summary = getDetectionSummary(detections);
  const avgConfidence = getAverageConfidence(detections);

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
              <Text style={styles.headerTitle}>Upload Waste Photo</Text>
              <Text style={styles.headerSubtitle}>
                AI-powered waste detection
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Upload Buttons */}
        {!image && (
          <Animated.View
            entering={FadeInUp.duration(600).delay(100)}
            style={styles.uploadSection}>
            <BlurView intensity={60} tint="light" style={styles.uploadCard}>
              <View style={styles.uploadIconContainer}>
                <Ionicons name="camera" size={64} color={colors.primary[500]} />
              </View>
              <Text style={styles.uploadTitle}>Capture or Select Photo</Text>
              <Text style={styles.uploadSubtitle}>
                Take a new photo or choose from gallery
              </Text>

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title="Take Photo"
                  onPress={handleTakePhoto}
                  icon="camera-outline"
                  iconPosition="left"
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={styles.button}
                />
                <PrimaryButton
                  title="Pick from Gallery"
                  onPress={handlePickImage}
                  icon="images-outline"
                  iconPosition="left"
                  variant="success"
                  size="lg"
                  fullWidth
                  style={styles.button}
                />
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Image with Bounding Boxes */}
        {image && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.imageSection}>
            <BlurView intensity={60} tint="light" style={styles.imageCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={[
                    styles.image,
                    imageDimensions && {
                      width: IMAGE_WIDTH,
                      height: (IMAGE_WIDTH * imageDimensions.height) / imageDimensions.width,
                    },
                  ]}
                  resizeMode="contain"
                  onLoad={(e) => {
                    const { width: imgWidth, height: imgHeight } =
                      e.nativeEvent.source;
                    if (imgWidth && imgHeight) {
                      setImageDimensions({
                        width: imgWidth,
                        height: imgHeight,
                      });
                    }
                  }}
                />

                {/* Bounding Boxes */}
                {imageDimensions &&
                  detections.map((box, index) => (
                    <BoundingBox
                      key={box.id}
                      box={box}
                      imageWidth={IMAGE_WIDTH}
                      imageHeight={
                        (IMAGE_WIDTH * imageDimensions.height) /
                        imageDimensions.width
                      }
                      delay={index * 100}
                    />
                  ))}

                {/* Processing Overlay */}
                {processing && (
                  <View style={styles.processingOverlay}>
                    <BlurView intensity={80} tint="light" style={styles.processingBlur}>
                      <ActivityIndicator size="large" color={colors.primary[500]} />
                      <Text style={styles.processingText}>Analyzing image...</Text>
                    </BlurView>
                  </View>
                )}
              </View>

              {/* Detection Results */}
              {detections.length > 0 && (
                <Animated.View
                  entering={FadeInUp.duration(600).delay(500)}
                  style={styles.resultsContainer}>
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>Detection Results</Text>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>
                        {avgConfidence}% avg confidence
                      </Text>
                    </View>
                  </View>

                  <View style={styles.summaryContainer}>
                    {Object.entries(summary).map(([type, count]) => {
                      const typeColors: Record<string, string> = {
                        plastic: colors.alert[500],
                        paper: colors.primary[500],
                        metal: colors.warning[500],
                        glass: colors.deepBlue[500],
                        organic: colors.ecoGreen[500],
                        other: colors.gray[500],
                      };
                      return (
                        <View key={type} style={styles.summaryItem}>
                          <View
                            style={[
                              styles.summaryDot,
                              {
                                backgroundColor: typeColors[type] || colors.primary[500],
                              },
                            ]}
                          />
                          <Text style={styles.summaryText}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </Animated.View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <PrimaryButton
                  title="Process Again"
                  onPress={processImage}
                  icon="refresh-outline"
                  iconPosition="left"
                  variant="primary"
                  size="md"
                  disabled={processing || !image}
                  style={styles.actionButton}
                />
                <PrimaryButton
                  title="Reset"
                  onPress={handleReset}
                  icon="close-outline"
                  iconPosition="left"
                  variant="danger"
                  size="md"
                  style={styles.actionButton}
                />
              </View>
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
  uploadSection: {
    marginTop: 20,
  },
  uploadCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 32,
    alignItems: 'center',
    ...shadows.lg,
  },
  uploadIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: colors.text.secondary.light,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    marginBottom: 0,
  },
  imageSection: {
    marginTop: 20,
  },
  imageCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    ...shadows.lg,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    marginBottom: 16,
  },
  image: {
    width: IMAGE_WIDTH,
    height: (IMAGE_WIDTH * 3) / 4,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingBlur: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary.light,
  },
  confidenceBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[700],
  },
  summaryContainer: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

