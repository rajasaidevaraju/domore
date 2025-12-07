import { create } from 'zustand';
import { ServerStats } from '@/app/types/Types';
import { ServerRequest } from '@/app/service/ServerRequest';

interface StatsState {
  stats: ServerStats | undefined;
  isLoading: boolean;
  error: string | null;
  fetchStats: (signal: AbortSignal) => Promise<void>;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: undefined,
  isLoading: false,
  error: null,

  fetchStats: async (signal: AbortSignal) => {

    set({ isLoading: true, error: null }); 

    try {
      const result = await ServerRequest.fetchStats(signal);
      set({ stats: result, isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Stats fetch aborted.');
           set({ isLoading: false, error: null });
        } else {
          console.error('Error fetching stats:', error);
          set({ error: error.message, isLoading: false });
        }
      } else {
        console.error('Unknown error fetching stats:', error);
        set({ error: 'An unknown error occurred while fetching stats.', isLoading: false });
      }
    }
  },
}));