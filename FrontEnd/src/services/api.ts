const API_URL = import.meta.env.VITE_API_URL || '/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Link {
  _id: string;
  title: string;
  url: string;
  user: string;
  folder: string;
  createdAt: string;
  updatedAt: string;
}

interface Folder {
  _id: string;
  name: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  private getToken(): string | null {
    // Try to get token from cookies or localStorage
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    return localStorage.getItem('token');
  }

  // Auth methods
  async register(data: RegisterData): Promise<User> {
    const response = await this.request<{ token?: string } & User>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token if provided in response
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async login(data: LoginData): Promise<User> {
    const response = await this.request<{ token?: string } & User>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token if provided in response
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      // Clear cookie by setting it to expire
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  async verifyToken(): Promise<User> {
    return this.request<User>('/verify');
  }

  // Link methods
  async getLinks(): Promise<Link[]> {
    return this.request<Link[]>('/links');
  }

  async getLink(id: string): Promise<Link> {
    return this.request<Link>(`/links/${id}`);
  }

  async createLink(data: { title: string; url: string; folderId: string }): Promise<Link> {
    return this.request<Link>('/links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Folder methods
  async getFolders(): Promise<Folder[]> {
    return this.request<Folder[]>('/folders');
  }

  async getFolder(id: string): Promise<Folder & { links: Link[] }> {
    return this.request<Folder & { links: Link[] }>(`/folders/${id}`);
  }

  async createFolder(data: { name: string }): Promise<Folder> {
    return this.request<Folder>('/folders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFolder(id: string, data: { name?: string }): Promise<Folder> {
    return this.request<Folder>(`/folders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFolder(id: string): Promise<void> {
    return this.request<void>(`/folders/${id}`, {
      method: 'DELETE',
    });
  }

  async updateLink(id: string, data: { title?: string; url?: string }): Promise<Link> {
    return this.request<Link>(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLink(id: string): Promise<void> {
    return this.request<void>(`/links/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { User, Link, Folder, LoginData, RegisterData };

