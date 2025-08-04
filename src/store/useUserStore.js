import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(persist(
    (set, get) => ({
        userToken: null,
        tokenExpiry: null,
        setUserToken: (userToken) => {
            const expiry = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7일 후
            set({ userToken, tokenExpiry: expiry });
        },
        clearToken: () => set({ userToken: null, tokenExpiry: null }),
        isTokenValid: () => {
            const { userToken, tokenExpiry } = get();
            if (!userToken || !tokenExpiry) return false;
            
            const now = new Date().getTime();
            if (now > tokenExpiry) {
                // 토큰이 만료되었으면 자동으로 삭제
                set({ userToken: null, tokenExpiry: null });
                return false;
            }
            return true;
        }
    }),
    {
        name: 'user-storage', // localStorage에 저장될 key 이름
        getStorage: () => localStorage,
    }
));

export default useUserStore;