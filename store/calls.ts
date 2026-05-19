// Path: store/calls.ts
import { create } from "zustand";
import { backendGet, BackendError } from "@/lib/backend";

export type CallLike = Record<string, unknown>;

type ListEnvelope = { success?: boolean; data?: CallLike[]; count?: number } | CallLike[];

type Store = {
  q: string;
  limit: number;
  offset: number;

  rows: CallLike[];
  count: number;

  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  setQuery: (v: string) => void;
  setLimit: (n: number) => void;
  setOffset: (n: number) => void;

  refresh: () => Promise<void>;
};

function clampOffset(n: number): number {
  return n < 0 ? 0 : n;
}

function toStringErr(e: unknown): string {
  if (e instanceof BackendError) return `Failed (${e.status})`;
  if (e instanceof Error) return e.message;
  return String(e);
}

export const useCallsStore = create<Store>((set, get) => ({
  q: "",
  limit: 25,
  offset: 0,

  rows: [],
  count: 0,

  loading: false,
  error: null,
  lastFetchedAt: null,

  setQuery: (v) => set({ q: v, offset: 0 }),
  setLimit: (n) => set({ limit: n, offset: 0 }),
  setOffset: (n) => set({ offset: clampOffset(n) }),

  refresh: async () => {
    const s = get();
    set({ loading: true, error: null });

    try {
      // backend supports limit/offset per swagger for calls list
      const data = await backendGet<ListEnvelope>(`/api/calls?limit=${s.limit}&offset=${s.offset}`);

      const list = Array.isArray(data) ? data : (data.data ?? []);
      const count = Array.isArray(data) ? list.length : (data.count ?? list.length);

      set({
        rows: list,
        count,
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
      });
    } catch (e: unknown) {
      set({
        rows: [],
        count: 0,
        loading: false,
        error: toStringErr(e),
      });
    }
  },
}));