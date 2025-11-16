/**
 * VolunteerEventsScreen
 * Display volunteer events with join functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { EventCard } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  getVolunteerEvents,
  getEventsByType,
  getUpcomingEvents,
  type VolunteerEvent,
} from '@/utils/volunteerEvents';

type EventFilter = 'all' | 'upcoming' | 'cleanup' | 'awareness' | 'monitoring' | 'workshop';

export default function VolunteerEventsScreen() {
  const [events, setEvents] = useState<VolunteerEvent[]>(getUpcomingEvents());
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      applyFilter(selectedFilter);
      setRefreshing(false);
    }, 1000);
  };

  const applyFilter = (filter: EventFilter) => {
    setSelectedFilter(filter);
    switch (filter) {
      case 'all':
        setEvents(getVolunteerEvents());
        break;
      case 'upcoming':
        setEvents(getUpcomingEvents());
        break;
      case 'cleanup':
        setEvents(getEventsByType('cleanup'));
        break;
      case 'awareness':
        setEvents(getEventsByType('awareness'));
        break;
      case 'monitoring':
        setEvents(getEventsByType('monitoring'));
        break;
      case 'workshop':
        setEvents(getEventsByType('workshop'));
        break;
      default:
        setEvents(getUpcomingEvents());
    }
  };

  const handleJoin = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      Alert.alert(
        'Event Joined!',
        `You've successfully joined "${event.title}". We'll send you event details via email.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleEventPress = (event: VolunteerEvent) => {
    // Could navigate to event details screen
    Alert.alert(
      event.title,
      `${event.description}\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\nContact: ${event.contactInfo || 'N/A'}`,
      [{ text: 'OK' }]
    );
  };

  const filters: { key: EventFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { key: 'cleanup', label: 'Cleanup', icon: 'trash' },
    { key: 'awareness', label: 'Awareness', icon: 'megaphone' },
    { key: 'monitoring', label: 'Monitoring', icon: 'analytics' },
    { key: 'workshop', label: 'Workshop', icon: 'school' },
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
              <Text style={styles.headerTitle}>Volunteer Events</Text>
              <Text style={styles.headerSubtitle}>
                {events.length} {events.length === 1 ? 'event' : 'events'} available
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Filter Chips */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => applyFilter(filter.key)}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.filterChipActive,
              ]}>
              <Ionicons
                name={filter.icon}
                size={16}
                color={
                  selectedFilter === filter.key
                    ? colors.text.inverse.light
                    : colors.text.primary.light
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.key && styles.filterChipTextActive,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => handleEventPress(event)}
            onJoin={handleJoin}
            delay={index * 50}
          />
        ))}

        {/* Empty State */}
        {events.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <BlurView intensity={60} tint="light" style={styles.emptyCard}>
              <Ionicons
                name="calendar-outline"
                size={64}
                color={colors.gray[400]}
              />
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptyText}>
                No volunteer events available in this category. Check back later
                for new opportunities.
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary.light,
  },
  filterChipTextActive: {
    color: colors.text.inverse.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
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
});

