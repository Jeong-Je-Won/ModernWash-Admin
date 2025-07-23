import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(persist(
    (set) => ({
        userToken: null,
        setUserToken: (userToken) => set({ userToken }),
    }),
    {
        name: 'user-storage', // localStorage에 저장될 key 이름
        getStorage: () => localStorage,
    }
));

export default useUserStore;