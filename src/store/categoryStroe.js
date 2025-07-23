import { create } from 'zustand';

const useCategoryStore = create((set) => ({
    categories: [
        {
            id: 1,
            name: '회원/로그인',
        },
        {
            id: 2,
            name: '서비스 이용',
        },
        {
            id: 3,
            name: '자동세차',
        },
        {
            id: 4,
            name: '정기구독/해지',
        },
        {
            id: 5,
            name: '결제/취소/환불',
        },
    ],
    setCategories: (categories) => set({ categories }),
}));

export default useCategoryStore;