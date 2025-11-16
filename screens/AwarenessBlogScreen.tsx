/**
 * AwarenessBlogScreen
 * Display awareness blog articles in a card layout with thumbnails
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BlogCard, FullscreenImageModal } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import {
  getBlogArticles,
  getArticlesByCategory,
  type BlogArticle,
} from '@/utils/blogArticles';

export default function AwarenessBlogScreen() {
  const [articles, setArticles] = useState<BlogArticle[]>(getBlogArticles());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setArticles(getBlogArticles());
      setRefreshing(false);
    }, 1000);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setArticles(getArticlesByCategory(category));
    } else {
      setArticles(getBlogArticles());
    }
  };

  // Get unique categories
  const categories = Array.from(
    new Set(getBlogArticles().map((article) => article.category))
  );

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
              <Text style={styles.headerTitle}>Awareness Blogs</Text>
              <Text style={styles.headerSubtitle}>
                {articles.length} articles available
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Category Filter */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            onPress={() => handleCategoryFilter(null)}
            style={[
              styles.filterChip,
              selectedCategory === null && styles.filterChipActive,
            ]}>
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === null && styles.filterChipTextActive,
              ]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryFilter(category)}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive,
                ]}>
                {category}
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
        {articles.map((article, index) => (
          <BlogCard
            key={article.id}
            article={article}
            delay={index * 50}
          />
        ))}

        {/* Empty State */}
        {articles.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}>
            <BlurView intensity={60} tint="light" style={styles.emptyCard}>
              <Ionicons
                name="document-text-outline"
                size={64}
                color={colors.gray[400]}
              />
              <Text style={styles.emptyTitle}>No Articles Found</Text>
              <Text style={styles.emptyText}>
                No articles available in this category. Try selecting a different
                category.
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
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

