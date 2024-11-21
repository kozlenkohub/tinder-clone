import { create } from 'zustand';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (profileData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put('users/update', profileData);
      set({ authUser: res.data.user });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      set({ loading: false });
    }
  },
}));
