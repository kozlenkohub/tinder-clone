import { create } from 'zustand';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/signup', signupData);
      set({ authUser: res.data.user });
      toast.success('Signup successful');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/logout');
      if (res.status === 200) {
        set({ authUser: null });
      }
      toast.success('Logout successful');
    } catch (error) {
      console.log(error);
      toast.error('Logout failed');
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/login', loginData);
      set({ authUser: res.data.user });
      toast.success('Login successful');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ loading: false });
    }
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ authUser: res.data.user });
      set({ checkingAuth: false });
      console.log(res.data);
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
