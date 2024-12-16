import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const storage = {
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    return AsyncStorage.removeItem(key);
  },
};

const useProfileStore = create(
  persist(
    (set) => ({
      user: {
        fullName: null,
        accountType: null,
        image: null,
        email: null,
      },
      setUserProfile: (response) =>
        set({
          user: {
            fullName: `${response.user.firstName} ${response.user.lastName}`,
            accountType: response.user?.accountType,
            image: response.user?.image,
            email: response.user.email,
          },
        }),
      clearUserProfile: () =>
        set({
          user: {
            fullName: null,
            accountType: null,
            image: null,
            email: null,
          },
        }),
    }),
    {
      name: 'profile-storage',
      storage,
    }
  )
);

export default useProfileStore;
