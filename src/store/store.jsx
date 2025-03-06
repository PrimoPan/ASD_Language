import { create } from 'zustand';

const useStore = create((set, get) => ({
    // ============== 账号 & 令牌 ==============
    username: '',
    token: '',  // ✅ 新增 JWT 令牌存储

    setUsername: (payload) => set({ username: payload }),
    setToken: (payload) => set({ token: payload }),  // ✅ 新增设置 Token 的方法

    setUsernameAsync: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ username: payload });
    },

    // ============== 儿童信息 ==============
    currentChildren: {},
    setCurrentChildren: (data) => {
        const oldData = get().currentChildren;
        if (JSON.stringify(oldData) === JSON.stringify(data)) return;
        set({
            currentChildren: {
                ...data,
                selectedInitials: data.selectedInitials ?? get().learningGoals?.构音?.split(', ') ?? [],
            },
        });
    },

    learningGoals: null,
    setLearningGoals: (data) => {
        console.log('updateLearningGoals:', data);
        const oldData = get().learningGoals;
        if (JSON.stringify(oldData) === JSON.stringify(data)) return;
        set({ learningGoals: data });
    }
}));

export default useStore;
