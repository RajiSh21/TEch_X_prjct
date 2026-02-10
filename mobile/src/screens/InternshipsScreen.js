/**
 * Internships Screen
 * List all internship opportunities
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import {getInternships} from '../services/api';

const InternshipsScreen = () => {
  const [internships, setInternships] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInternships = async () => {
    try {
      const response = await getInternships();
      setInternships(response.jobs || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch internships. Make sure the Flask server is running.');
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInternships();
    setRefreshing(false);
  };

  const openJobLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open job link');
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => openJobLink(item.link)}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>🏢 {item.company}</Text>
      <Text style={styles.jobLocation}>📍 {item.location}</Text>
      <Text style={styles.jobDate}>Added: {new Date(item.date_added).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {internships.length} internship opportunities available
        </Text>
      </View>
      <FlatList
        data={internships}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No internship opportunities yet</Text>
            <Text style={styles.emptySubtext}>
              Go to Scrape tab to add some!
            </Text>
          </View>
        }
        contentContainerStyle={internships.length === 0 && styles.emptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 11,
    color: '#999',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default InternshipsScreen;
