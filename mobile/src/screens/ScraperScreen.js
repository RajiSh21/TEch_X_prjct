import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } from '../constants/theme';
import api from '../services/api';

export default function ScraperScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  // Auto-scrape based on user's location
  const handleAutoScrape = async () => {
    try {
      setLoading(true);
      
      const response = await api.post('/gemini-scraper/auto-scrape');
      
      if (response.data.success) {
        const { saved, totalScraped, location } = response.data.data;
        
        Alert.alert(
          'Success! 🎉',
          `Found ${totalScraped} opportunities!\n${saved} new jobs added near ${location.city}.`,
          [
            { text: 'View Jobs', onPress: () => navigation.navigate('Jobs') },
            { text: 'OK' }
          ]
        );
        
        // Refresh stats
        fetchStats();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to scrape jobs. Please try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scraper statistics
  const fetchStats = async () => {
    try {
      const response = await api.get('/gemini-scraper/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  // Load stats on mount
  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="search-circle" size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>AI Job Finder</Text>
        <Text style={styles.subtitle}>
          Powered by Google Gemini AI
        </Text>
      </View>

      {/* Main Action Card */}
      <View style={styles.actionCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Find Jobs Near You</Text>
        </View>
        
        <Text style={styles.cardDescription}>
          Automatically discover internships, apprenticeships, and job opportunities 
          in your area using AI-powered web scraping.
        </Text>

        <TouchableOpacity
          style={[styles.scrapeButton, loading && styles.buttonDisabled]}
          onPress={handleAutoScrape}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color={COLORS.white} style={styles.buttonLoader} />
              <Text style={styles.scrapeButtonText}>Searching...</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={20} color={COLORS.white} style={styles.buttonIcon} />
              <Text style={styles.scrapeButtonText}>Start Smart Search</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={16} color={COLORS.info} />
          <Text style={styles.infoText}>
            Make sure your location is set in your profile
          </Text>
        </View>
      </View>

      {/* Statistics Card */}
      {stats && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Scraping Statistics</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalScraped}</Text>
              <Text style={styles.statLabel}>Total Scraped</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.successful}</Text>
              <Text style={styles.statLabel}>Successful</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.failed}</Text>
              <Text style={styles.statLabel}>Duplicates</Text>
            </View>
          </View>

          {stats.lastRun && (
            <Text style={styles.lastRun}>
              Last updated: {new Date(stats.lastRun).toLocaleDateString()}
            </Text>
          )}

          {/* By Type */}
          {stats.byType && (
            <View style={styles.typeStats}>
              <Text style={styles.typeStatsTitle}>By Opportunity Type</Text>
              
              {Object.entries(stats.byType).map(([type, count]) => (
                <View key={type} style={styles.typeRow}>
                  <View style={styles.typeDot} />
                  <Text style={styles.typeName}>{type}</Text>
                  <Text style={styles.typeCount}>{count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Features List */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>How It Works</Text>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Location-Based</Text>
            <Text style={styles.featureDescription}>
              Finds opportunities near your city or within your state
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="sparkles-outline" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI-Powered</Text>
            <Text style={styles.featureDescription}>
              Gemini AI intelligently extracts and validates job listings
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="refresh-outline" size={24} color={COLORS.success} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Always Fresh</Text>
            <Text style={styles.featureDescription}>
              Real-time scraping from multiple job boards
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.warning} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Instant Alerts</Text>
            <Text style={styles.featureDescription}>
              Get notified when new opportunities are discovered
            </Text>
          </View>
        </View>
      </View>

      {/* Setup Guide */}
      <TouchableOpacity 
        style={styles.guideButton}
        onPress={() => Alert.alert(
          'Setup Location',
          'Go to Profile → Edit Profile → Add your city and state to enable smart job search.',
          [
            { text: 'Go to Profile', onPress: () => navigation.navigate('Profile') },
            { text: 'Later' }
          ]
        )}
      >
        <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
        <Text style={styles.guideButtonText}>How to Setup Your Location</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  cardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  scrapeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoader: {
    marginRight: SPACING.sm,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  scrapeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.info + '15',
    borderRadius: BORDER_RADIUS.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.info,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  statsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  lastRun: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  typeStats: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typeStatsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  typeName: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
  typeCount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  featuresCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  featuresTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  guideButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});
