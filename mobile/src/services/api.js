/**
 * API Service
 * Connects mobile app to Flask backend
 */

import axios from 'axios';

// Configure your Flask backend URL
// Change this to your actual server IP when running on device
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all jobs (placements and internships)
 */
export const getAllJobs = async () => {
  try {
    const response = await api.get('/api/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Get placements only
 */
export const getPlacements = async () => {
  try {
    const response = await api.get('/api/jobs?type=placement');
    return response.data;
  } catch (error) {
    console.error('Error fetching placements:', error);
    throw error;
  }
};

/**
 * Get internships only
 */
export const getInternships = async () => {
  try {
    const response = await api.get('/api/jobs?type=internship');
    return response.data;
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw error;
  }
};

/**
 * Trigger job scraping
 */
export const scrapeJobs = async (searchQuery, location, jobType, numPages) => {
  try {
    const formData = new FormData();
    formData.append('search_query', searchQuery);
    formData.append('location', location);
    formData.append('job_type', jobType);
    formData.append('num_pages', numPages.toString());

    const response = await api.post('/scrape', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scraping jobs:', error);
    throw error;
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId) => {
  try {
    const response = await api.post(`/delete/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export default {
  getAllJobs,
  getPlacements,
  getInternships,
  scrapeJobs,
  deleteJob,
};
