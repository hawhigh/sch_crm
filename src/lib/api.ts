import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to add token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Owner Dashboard ---
export const useDashboardMetrics = () => 
  useQuery({
    queryKey: ['owner-metrics'],
    queryFn: async () => {
      const { data } = await api.get('/owner/metrics');
      return data;
    }
  });

export const useOwnerMetrics = useDashboardMetrics;

// --- Supervisor Dashboard ---
export const useSupervisorDashboard = () => 
  useQuery({
    queryKey: ['supervisor-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/supervisor/dashboard');
      return data;
    }
  });

// --- Coordinator Dashboard ---
export const useCoordinatorDashboard = () => 
  useQuery({
    queryKey: ['coordinator-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/coordinator/dashboard');
      return data;
    }
  });

// --- Student Portal ---
export const useStudentSchedule = () => 
  useQuery({
    queryKey: ['student-schedule'],
    queryFn: async () => {
      const { data } = await api.get('/student/schedule');
      return data;
    }
  });

export const useStudentProgress = () => 
  useQuery({
    queryKey: ['student-progress'],
    queryFn: async () => {
      const { data } = await api.get('/student/progress');
      return data;
    }
  });

export const useStudentMaterials = () => 
  useQuery({
    queryKey: ['student-materials'],
    queryFn: async () => {
      const { data } = await api.get('/student/materials');
      return data;
    }
  });

export const useStudentLibrary = () => 
  useQuery({
    queryKey: ['student-library'],
    queryFn: async () => {
      const { data } = await api.get('/student/library');
      return data;
    }
  });

export const useParentDashboard = () => 
  useQuery({
    queryKey: ['parent-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/parent/dashboard');
      return data;
    }
  });

// --- Communication Hub (Messenger) ---
export const useConversations = () => 
  useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/messenger/conversations');
      return data;
    }
  });

export const useMessages = (conversationId: string | null) => 
  useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data } = await api.get(`/messenger/conversations/${conversationId}/messages`);
      return data;
    },
    enabled: !!conversationId
  });

export const useSendMessage = () => {
  return async (conversationId: string, content: string) => {
    const { data } = await api.post(`/messenger/conversations/${conversationId}/messages`, { content });
    return data;
  };
};

export const useLibrary = () => 
  useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const { data } = await api.get('/library');
      return data;
    }
  });

export const useCalendar = () => 
  useQuery({
    queryKey: ['calendar'],
    queryFn: async () => {
      const { data } = await api.get('/calendar');
      return data;
    }
  });

export const useLectorDashboard = () => 
  useQuery({
    queryKey: ['lector-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/lector/dashboard');
      return data;
    }
  });

export const useUpdates = (type?: string, targetId?: string) => 
  useQuery({
    queryKey: ['updates', type, targetId],
    queryFn: async () => {
      const { data } = await api.get('/updates', { 
        params: { type, targetId }
      });
      return data;
    }
  });

export const useSchools = () => 
  useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data } = await api.get('/schools');
      return data;
    }
  });
