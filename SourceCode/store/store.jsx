import { create } from 'zustand';

// 创建 store
const useStore = create((set) => ({
    username: '', // 当前用户名
    setUsername: (payload) => set({ username: payload }), // 更新用户名
    setUsernameAsync: async (payload) => {
        // 模拟异步操作，设置用户名
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟延迟
        set({ username: payload });
    },
}));

export default useStore;
