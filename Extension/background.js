// Background Service Worker for Async Extension
// Configuration (inline to avoid importScripts issues with ES modules)
const API_BASE_URL = 'https://async-vr1z.onrender.com/api';
const CHECK_INTERVAL = 60; // Check every 60 minutes
const NOTIFICATION_THRESHOLD_HOURS = 24;

// Set up alarm for periodic checks
chrome.runtime.onInstalled.addListener(() => {
  console.log('Async Extension installed');
  
  // Create alarm for checking assignments
  chrome.alarms.create('checkAssignments', {
    periodInMinutes: CHECK_INTERVAL,
  });
});

// Listen to alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkAssignments') {
    checkForUpcomingAssignments();
  }
});

// Check for upcoming assignments and send notifications
async function checkForUpcomingAssignments() {
  try {
    const { authToken, currentUser } = await chrome.storage.local.get(['authToken', 'currentUser']);
    
    if (!authToken || !currentUser) return;
    
    const response = await fetch(
      `${API_BASE_URL}/assignments/by-cohort/${currentUser.cohortNo}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    
    if (!response.ok) return;
    
    const data = await response.json();
    const assignments = data.assignments || [];
    
    // Check for assignments due in the next N hours
    const now = new Date();
    const threshold = new Date(now.getTime() + NOTIFICATION_THRESHOLD_HOURS * 60 * 60 * 1000);
    
    let upcomingCount = 0;
    
    assignments.forEach(assignment => {
      const isCompleted = assignment.completedBy?.includes(currentUser._id);
      if (!isCompleted && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate >= now && dueDate <= threshold) {
          upcomingCount++;
        }
      }
    });
    
    // Send notification if there are upcoming assignments
    if (upcomingCount > 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Async - Assignment Reminder',
        message: `You have ${upcomingCount} assignment${upcomingCount > 1 ? 's' : ''} due in the next ${NOTIFICATION_THRESHOLD_HOURS} hours!`,
        priority: 2,
      });
    }
    
  } catch (error) {
    console.error('Error checking assignments:', error);
  }
}

// Listen for notification clicks
chrome.notifications.onClicked.addListener(() => {
  chrome.action.openPopup();
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkNow') {
    checkForUpcomingAssignments();
    sendResponse({ success: true });
  }
  return true;
});
