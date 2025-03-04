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

    learningGoals: null,
    setLearningGoals: (data) => {
        const oldData = get().learningGoals;
        if (JSON.stringify(oldData) === JSON.stringify(data)) return;
        set({ learningGoals: data });
    }
}));

export default useStore;