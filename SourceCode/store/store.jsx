import { create } from 'zustand';

// 创建 store
const useStore = create((set) => ({
    // ============== 原有 username 相关 ==============
    username: '', // 当前用户名

    setUsername: (payload) => set({ username: payload }), // 同步更新用户名

    setUsernameAsync: async (payload) => {
        // 模拟异步操作，设置用户名
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟1秒延迟
        set({ username: payload });
    },

    // ============== 新增 currentChildren 相关 ==============
    currentChildren: {}, // 用于存放提交后形成的儿童表单信息

    setCurrentChildren: (data) =>
        set((state) => {
            // 如果新数据和原有数据在“内容”上无变化，则不更新 store
            const oldData = state.currentChildren;
            console.log("data_changed!");
            // 这里简易用 JSON.stringify 做深比较；也可用其他库或更复杂逻辑
            if (JSON.stringify(oldData) === JSON.stringify(data)) {
                return {}; // 返回空对象，表示不修改 state
            }
            return { currentChildren: data };
        }),
}));

export default useStore;
