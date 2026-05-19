// Path: store/appointments.ts
import { create } from "zustand";
import type { Appointment } from "@/lib/types";
import { getAppointments } from "@/lib/api/voiceAssistantApi";
import { todayISO } from "@/lib/appointments";
import type { AppointmentStatus, DateScope } from "@/lib/appointments";

export type AppointmentStatusFilter = "" | AppointmentStatus;

type Store = {
  // Query state (shared across components)
  scope: DateScope; // "today" | "date" | "all"
  date: string; // used when scope === "date"
  status: AppointmentStatusFilter;
  q: string;
  limit: number;
  offset: number;

  // Data state
  rows: Appointment[];
  count: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  // Actions
  setScope: (v: DateScope) => void;
  setDate: (v: string) => void;
  setStatus: (v: AppointmentStatusFilter) => void;
  setQuery: (v: string) => void;
  setLimit: (n: number) => void;
  setOffset: (n: number) => void;

  refresh: () => Promise<void>;
};

function clampOffset(n: number): number {
  return n < 0 ? 0 : n;
}

export const useAppointmentsStore = create<Store>((set, get) => ({
  scope: "today",
  date: todayISO(),
  status: "",
  q: "",
  limit: 25,
  offset: 0,

  rows: [],
  count: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,

  setScope: (v) => set({ scope: v, offset: 0 }),
  setDate: (v) => set({ date: v, offset: 0 }),
  setStatus: (v) => set({ status: v, offset: 0 }),
  setQuery: (v) => set({ q: v }),
  setLimit: (n) => set({ limit: n, offset: 0 }),
  setOffset: (n) => set({ offset: clampOffset(n) }),

  refresh: async () => {
    const s = get();

    const dateParam =
      s.scope === "all" ? undefined : s.scope === "today" ? todayISO() : s.date || undefined;

    set({ loading: true, error: null });

    try {
      const res = await getAppointments({
        date: dateParam,
        status: s.status || undefined,
        limit: s.limit,
        offset: s.offset,
      });

      set({
        rows: res.data,
        count: res.count,
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
      });
    } catch (e: unknown) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : String(e),
        rows: [],
        count: 0,
      });
    }
  },
}));