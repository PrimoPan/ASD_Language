import { create } from 'zustand';

const useStore = create((set, get) => ({
    // ============== 原有 username 相关 ==============
    username: '',
    setUsername: (payload) => set({ username: payload }),
    setUsernameAsync: async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ username: payload });
    },

    // ============== currentChildren 相关 ==============
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

    // ============== learningGoals 相关 ==============
    /*
        历史遗留问题，教学目标中的构音需要和currentChildren里的selectedInitials相统一
     */
    learningGoals: null,
    setLearningGoals: (data) => {
        const oldData = get().learningGoals;
        if (JSON.stringify(oldData) === JSON.stringify(data)) return;
        set({
            learningGoals: {
                ...data,
                构音: data.构音 ?? get().currentChildren?.selectedInitials?.join(', ') ?? '无',
            },
        });
    },
}));

export default useStore;
