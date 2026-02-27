const config = window?.APP_CONFIG || {
  API_BASE_URL: 'https://async-vr1z.onrender.com/api'
};

const API_BASE_URL = config.API_BASE_URL;

export const api = {
  async googleSignIn(idToken) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }

    return response.json();
  },

  async getAssignments(authToken, cohortNo) {
    const response = await fetch(`${API_BASE_URL}/assignments/by-cohort/${cohortNo}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const data = await response.json();
    
    // Flatten grouped assignments from backend
    let allAssignments = [];
    if (data.grouped) {
      Object.values(data.grouped).forEach(group => {
        allAssignments = [...allAssignments, ...group];
      });
    }

    return { assignments: allAssignments };
  },

  async toggleCompletion(authToken, assignmentId) {
    const response = await fetch(`${API_BASE_URL}/assignments/toggle-completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignmentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle completion');
    }

    return response.json();
  },

  async sendTestNotification(authToken) {
    const response = await fetch(`${API_BASE_URL}/auth/test-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to send test notification');
    }

    return response.json();
  },
};
