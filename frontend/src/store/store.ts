import { create } from 'zustand';

interface ComputerStore {
  computers: Computer[];
  loading: boolean;
  error: string;
  fetchComputers: () => Promise<void>;
  startSession: (computerId: number, user?: string) => Promise<void>;
  endSession: (computerId: number) => Promise<void>;
}

const useComputerStore = create<ComputerStore>((set) => ({
  computers: [],
  loading: false,
  error: '',
  fetchComputers: async () => {
    set({ loading: true, error: '' });
    try {
      const computers = await getComputers();
      set({ computers, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch computers', loading: false });
    }
  },
  startSession: async (computerId, user) => {
    try {
      await startSession(computerId, user);
      await useComputerStore.getState().fetchComputers();
    } catch (err) {
      set({ error: 'Failed to start session' });
    }
  },
  endSession: async (computerId) => {
    try {
      await endSession(computerId);
      await useComputerStore.getState().fetchComputers();
    } catch (err) {
      set({ error: 'Failed to end session' });
    }
  },
}));

export default useComputerStore;