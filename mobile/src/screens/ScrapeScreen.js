/**
 * Scrape Screen
 * Form to trigger job scraping
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {scrapeJobs} from '../services/api';

const ScrapeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('Software Engineer');
  const [location, setLocation] = useState('United States');
  const [jobType, setJobType] = useState('placement');
  const [numPages, setNumPages] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!searchQuery || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await scrapeJobs(searchQuery, location, jobType, parseInt(numPages));
      Alert.alert(
        'Success',
        'Jobs scraped successfully! Check the Placements or Internships tab.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (jobType === 'internship') {
                navigation.navigate('Internships');
              } else {
                navigation.navigate('Placements');
              }
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to scrape jobs. Make sure the Flask server is running and Selenium is set up.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ How it works</Text>
        <Text style={styles.infoText}>
          • Enter your search criteria below{'\n'}
          • Click "Start Scraping" to fetch jobs{'\n'}
          • Jobs will be added to the database{'\n'}
          • View them in Placements or Internships
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Job Search Query *</Text>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="e.g., Python Developer"
        />
        <Text style={styles.helpText}>
          e.g., "Python Developer", "Data Scientist"
        </Text>

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Berlin, Germany"
        />
        <Text style={styles.helpText}>
          e.g., "Berlin, Germany", "Remote", "New York, USA"
        </Text>

        <Text style={styles.label}>Job Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={jobType}
            onValueChange={setJobType}
            style={styles.picker}>
            <Picker.Item label="Placement (Full-time)" value="placement" />
            <Picker.Item label="Internship" value="internship" />
          </Picker>
        </View>
        <Text style={styles.helpText}>
          Select whether these are placement or internship opportunities
        </Text>

        <Text style={styles.label}>Number of Pages</Text>
        <TextInput
          style={styles.input}
          value={numPages}
          onChangeText={setNumPages}
          keyboardType="numeric"
          placeholder="1"
        />
        <Text style={styles.helpText}>
          How many pages to scrape (1-5 recommended)
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleScrape}
          disabled={loading}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" />
              <Text style={styles.buttonText}>  Scraping...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>🚀 Start Scraping</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          <Text style={styles.warningBold}>⚠️ Note:</Text> Scraping may take
          30-60 seconds per page. The browser will run in headless mode. Please
          be patient!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#333',
  },
  warningBold: {
    fontWeight: 'bold',
  },
});

export default ScrapeScreen;
