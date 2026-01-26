const Notification = require('../models/Notification');

class NotificationService {
  // Create a new notification
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      
      // In production, you would also:
      // 1. Send push notification via Firebase/OneSignal
      // 2. Send email notification
      // 3. Emit socket.io event for real-time updates
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create bulk notifications
  async createBulkNotifications(users, notificationData) {
    try {
      const notifications = users.map(userId => ({
        user: userId,
        ...notificationData
      }));

      const result = await Notification.insertMany(notifications);
      return result;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Send reminder notifications for upcoming interviews
  async sendInterviewReminders() {
    // This would be called by a cron job
    // Implementation would check for interviews in next 24 hours
    // and send reminder notifications
    console.log('Sending interview reminders...');
  }
}

module.exports = new NotificationService();
