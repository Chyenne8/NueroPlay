// API Client for NeuroPlay Backend
// Configure your backend URL here after deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/make-server-3f317989';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl + API_PREFIX;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============= CAREGIVER METHODS =============

  async createCaregiver(email: string, password: string, name: string) {
    return this.request('/caregivers', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async loginCaregiver(email: string, password: string) {
    return this.request('/caregivers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // ============= CHILD METHODS =============

  async createChild(caregiverId: string, name: string, age?: number, avatar?: string) {
    return this.request('/children', {
      method: 'POST',
      body: JSON.stringify({ caregiverId, name, age, avatar }),
    });
  }

  async getCaregiverChildren(caregiverId: string) {
    return this.request(`/caregivers/${caregiverId}/children`);
  }

  async getChild(childId: string) {
    return this.request(`/children/${childId}`);
  }

  // ============= SESSION METHODS =============

  async saveSession(childId: string, gameData: any, completedAt?: string) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ childId, gameData, completedAt }),
    });
  }

  async getChildSessions(childId: string) {
    return this.request(`/children/${childId}/sessions`);
  }

  async getSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}`);
  }

  async getChildStats(childId: string) {
    return this.request(`/children/${childId}/stats`);
  }

  // ============= HEALTH CHECK =============

  async healthCheck() {
    return this.request('/health');
  }
}

export const api = new ApiClient(API_BASE_URL);

// Helper to check if API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    await api.healthCheck();
    return true;
  } catch {
    return false;
  }
}
