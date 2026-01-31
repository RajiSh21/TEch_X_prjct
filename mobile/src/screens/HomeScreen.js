/**
 * Home Screen
 * Dashboard with statistics and recent opportunities
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {getAllJobs} from '../services/api';

const HomeScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [placementCount, setPlacementCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs();
      setJobs(response.jobs || []);
      
      // Calculate counts
      const placements = response.jobs.filter(job => job.job_type === 'placement');
      const internships = response.jobs.filter(job => job.job_type === 'internship');
      setPlacementCount(placements.length);
      setInternshipCount(internships.length);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch jobs. Make sure the Flask server is running.');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const openJobLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open job link');
    });
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to</Text>
        <Text style={styles.headerSubtitle}>Placement & Internship Portal</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{placementCount}</Text>
          <Text style={styles.statLabel}>Placements</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{internshipCount}</Text>
          <Text style={styles.statLabel}>Internships</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{placementCount + internshipCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 Recent Opportunities</Text>
        {recentJobs.length > 0 ? (
          recentJobs.map((job, index) => (
            <TouchableOpacity
              key={index}
              style={styles.jobCard}
              onPress={() => openJobLink(job.link)}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={[
                  styles.badge,
                  job.job_type === 'placement' ? styles.placementBadge : styles.internshipBadge
                ]}>
                  <Text style={styles.badgeText}>{job.job_type.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.jobCompany}>🏢 {job.company}</Text>
              <Text style={styles.jobLocation}>📍 {job.location}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No opportunities yet. Go to Scrape tab to add some!
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Placements')}>
          <Text style={styles.buttonText}>View All Placements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Internships')}>
          <Text style={styles.buttonText}>View All Internships</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate('Scrape')}>
          <Text style={styles.buttonText}>Scrape New Jobs</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  placementBadge: {
    backgroundColor: '#d4edda',
  },
  internshipBadge: {
    backgroundColor: '#cce5ff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  actions: {
    padding: 15,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
