// API client for EcoConnect Sphere
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) {
    const response = await this.request<{
      success: boolean;
      message: string;
      token: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.removeToken();
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      user: any;
    }>('/auth/me');
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      count: number;
      users: any[];
      pagination: any;
    }>(`/users?${queryParams.toString()}`);
  }

  async getUser(userId: string) {
    return this.request<{
      success: boolean;
      user: any;
    }>(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: any) {
    return this.request<{
      success: boolean;
      message: string;
      user: any;
    }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserEvents(userId: string, params?: any) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      registrations: any[];
      pagination: any;
    }>(`/users/${userId}/events?${queryParams.toString()}`);
  }

  async getUserBadges(userId: string) {
    return this.request<{
      success: boolean;
      earnedBadges: any[];
      stats: any;
      availableBadges: any[];
    }>(`/users/${userId}/badges`);
  }

  async getUserStats(userId: string) {
    return this.request<{
      success: boolean;
      stats: any;
    }>(`/users/${userId}/stats`);
  }

  async getLeaderboard(params?: {
    page?: number;
    limit?: number;
    timeframe?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      leaderboard: any[];
      pagination: any;
    }>(`/users/leaderboard?${queryParams.toString()}`);
  }

  // Event methods
  async getEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    location?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    lat?: number;
    lon?: number;
    radius?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      count: number;
      events: any[];
      pagination: any;
    }>(`/events?${queryParams.toString()}`);
  }

  async getEvent(eventId: string) {
    return this.request<{
      success: boolean;
      event: any;
    }>(`/events/${eventId}`);
  }

  async createEvent(eventData: any) {
    return this.request<{
      success: boolean;
      message: string;
      event: any;
    }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.request<{
      success: boolean;
      message: string;
      event: any;
    }>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async registerForEvent(eventId: string, registrationData?: any) {
    return this.request<{
      success: boolean;
      message: string;
      registration: any;
    }>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData || {}),
    });
  }

  async cancelEventRegistration(eventId: string, reason?: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/events/${eventId}/register`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  async getEventRegistrations(eventId: string, params?: any) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      registrations: any[];
      pagination: any;
    }>(`/events/${eventId}/registrations?${queryParams.toString()}`);
  }

  async checkInParticipant(eventId: string, userId: string, location?: any) {
    return this.request<{
      success: boolean;
      message: string;
      registration: any;
    }>(`/events/${eventId}/checkin/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ location }),
    });
  }

  async submitEventFeedback(eventId: string, rating: number, feedback?: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/events/${eventId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  }

  // Badge methods
  async getBadges(params?: {
    page?: number;
    limit?: number;
    category?: string;
    rarity?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      count: number;
      badges: any[];
      pagination: any;
    }>(`/badges?${queryParams.toString()}`);
  }

  async getBadge(badgeId: string) {
    return this.request<{
      success: boolean;
      badge: any;
    }>(`/badges/${badgeId}`);
  }

  async getBadgeProgress(userId: string) {
    return this.request<{
      success: boolean;
      badges: any[];
    }>(`/badges/progress/${userId}`);
  }

  async checkAndAwardBadges(userId: string) {
    return this.request<{
      success: boolean;
      message: string;
      newlyAwarded: number;
      badges: any[];
    }>(`/badges/check/${userId}`, {
      method: 'POST',
    });
  }

  async getBadgeStats() {
    return this.request<{
      success: boolean;
      stats: any;
    }>('/badges/stats');
  }

  async getBadgeCategories() {
    return this.request<{
      success: boolean;
      categories: any[];
    }>('/badges/categories');
  }

  // Agency methods
  async getAgencies(params?: {
    page?: number;
    limit?: number;
    type?: string;
    verificationStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      agencies: any[];
      pagination: any;
    }>(`/agencies?${queryParams.toString()}`);
  }

  async getAgency(agencyId: string) {
    return this.request<{
      success: boolean;
      agency: any;
    }>(`/agencies/${agencyId}`);
  }

  async createAgency(agencyData: any) {
    return this.request<{
      success: boolean;
      message: string;
      agency: any;
    }>('/agencies', {
      method: 'POST',
      body: JSON.stringify(agencyData),
    });
  }

  async updateAgency(agencyId: string, agencyData: any) {
    return this.request<{
      success: boolean;
      message: string;
      agency: any;
    }>(`/agencies/${agencyId}`, {
      method: 'PUT',
      body: JSON.stringify(agencyData),
    });
  }

  async getUserAgencies(userId: string) {
    return this.request<{
      success: boolean;
      agencies: any[];
    }>(`/agencies/user/${userId}`);
  }

  async getAgencyStats(agencyId?: string) {
    const endpoint = agencyId ? `/agencies/${agencyId}/stats` : '/agencies/stats/overview';
    return this.request<{
      success: boolean;
      stats: any;
    }>(endpoint);
  }

  // Notification methods
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      notifications: any[];
      pagination: any;
    }>(`/notifications?${queryParams.toString()}`);
  }

  async getNotification(notificationId: string) {
    return this.request<{
      success: boolean;
      notification: any;
    }>(`/notifications/${notificationId}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markNotificationAsUnread(notificationId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/notifications/${notificationId}/unread`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<{
      success: boolean;
      message: string;
    }>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async getNotificationStats() {
    return this.request<{
      success: boolean;
      stats: any;
    }>('/notifications/stats');
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request<{
      success: boolean;
      message: string;
      preferences: any;
    }>('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ notifications: preferences }),
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export types for TypeScript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'organizer' | 'moderator' | 'sponsor' | 'admin';
  avatar?: string;
  stats: {
    eventsAttended: number;
    eventsOrganized: number;
    badgesEarned: number;
    impactPoints: number;
    wasteCollected: string;
    treesPlanted: number;
    itemsRepaired: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'cleanup' | 'tree-planting' | 'repair' | 'e-waste' | 'education' | 'other';
  organizer: string;
  organizerName: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: number;
  registeredParticipants: number;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  tags: string[];
  accessibility: string[];
  images?: string[];
  coverImage?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: string;
  isEarned?: boolean;
  progress?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export default api;
