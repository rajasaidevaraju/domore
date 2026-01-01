import { create } from 'zustand';
import { Item, ItemWithCount, EntityType, ApiResponse } from '@/app/types/Types';
import { FilterRequests } from '@/app/service/FilterRequests';

interface PerformersState {
    performers: Item[];
    performersWithCount: ItemWithCount[];

    hasFetchedPerformers: boolean;
    hasFetchedWithCount: boolean;
    isFetchingPerformers: boolean;
    isFetchingWithCount: boolean;
    error: string | null;

    fetchPerformers: () => Promise<void>;
    fetchPerformersWithCount: () => Promise<void>;

    fetchPerformersIfNeeded: () => void;
    fetchPerformersWithCountIfNeeded: () => void;

    addPerformers: (names: string[], token: string) => Promise<ApiResponse>;
    deletePerformers: (ids: number[], token: string) => Promise<ApiResponse>;

    clearError: () => void;
}

export const usePerformersStore = create<PerformersState>((set, get) => ({
    performers: [],
    performersWithCount: [],
    hasFetchedPerformers: false,
    hasFetchedWithCount: false,
    isFetchingPerformers: false,
    isFetchingWithCount: false,
    error: null,

    fetchPerformers: async () => {
        set({ isFetchingPerformers: true, error: null });
        try {
            const data = await FilterRequests.fetchItems(EntityType.Performer);
            set({ performers: data, isFetchingPerformers: false, hasFetchedPerformers: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch performers';
            set({ error: message, isFetchingPerformers: false });
            throw error;
        }
    },

    fetchPerformersWithCount: async () => {
        set({ isFetchingWithCount: true, error: null });
        try {
            const data = await FilterRequests.fetchItemsWithCount(EntityType.Performer);
            set({ performersWithCount: data, isFetchingWithCount: false, hasFetchedWithCount: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch performers';
            set({ error: message, isFetchingWithCount: false });
            throw error;
        }
    },

    fetchPerformersIfNeeded: () => {
        const state = get();
        if (!state.hasFetchedPerformers && !state.isFetchingPerformers) {
            get().fetchPerformers();
        }
    },

    fetchPerformersWithCountIfNeeded: () => {
        const state = get();
        if (!state.hasFetchedWithCount && !state.isFetchingWithCount) {
            get().fetchPerformersWithCount();
        }
    },

    addPerformers: async (names: string[], token: string) => {
        try {
            const response = await FilterRequests.addItems(EntityType.Performer, names, token);
            await Promise.all([
                get().fetchPerformers(),
                get().fetchPerformersWithCount()
            ]);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add performers';
            set({ error: message });
            throw error;
        }
    },

    deletePerformers: async (ids: number[], token: string) => {
        try {
            const response = await FilterRequests.deleteItems(EntityType.Performer, ids, token);
            await Promise.all([
                get().fetchPerformers(),
                get().fetchPerformersWithCount()
            ]);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete performers';
            set({ error: message });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
