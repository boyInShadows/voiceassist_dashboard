// Path: store/faqs.ts
import { create } from "zustand";
import {
    getFaqs,
    getFaqCategories,
    createFaq,
    updateFaq,
    deleteFaq,
  } from "@/lib/api/voiceAssistantApi";
import type { FaqItem } from "@/lib/types";

type Store = {
  q: string;
  category: string;

  rows: FaqItem[];
  categories: string[];

  loading: boolean;
  error: string | null;

  modalOpen: boolean;
  editing: FaqItem | null;

  setQuery: (v: string) => void;
  setCategory: (v: string) => void;

  openCreate: () => void;
  openEdit: (faq: FaqItem) => void;
  closeModal: () => void;

  refresh: () => Promise<void>;
  save: (payload: { question: string; answer: string; category?: string }) => Promise<void>;
  deactivate: (id: string | number) => Promise<void>;
};

function normalizeText(s: string): string {
  return s.toLowerCase().trim();
}

export const useFaqsStore = create<Store>((set, get) => ({
  q: "",
  category: "",

  rows: [],
  categories: [],

  loading: false,
  error: null,

  modalOpen: false,
  editing: null,

  setQuery: (v) => set({ q: v }),
  setCategory: (v) => set({ category: v }),

  openCreate: () => set({ modalOpen: true, editing: null }),
  openEdit: (faq) => set({ modalOpen: true, editing: faq }),
  closeModal: () => set({ modalOpen: false }),

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const { category } = get();
      const [listRes, catRes] = await Promise.all([
        getFaqs(category ? { category } : undefined),
        getFaqCategories(),
      ]);

      const rows = listRes.data;
      const categories = catRes.data;

      set({
        rows,
        categories,
        loading: false,
        error: null,
      });
    } catch (e: unknown) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : String(e),
        rows: [],
      });
    }
  },

  save: async (payload) => {
    const { editing } = get();
    set({ loading: true, error: null });

    try {
      if (editing) {
        await updateFaq(editing.id as string, payload);
      } else {
        await createFaq({
          question: payload.question,
          answer: payload.answer,
          category: payload.category,
          active: true,
        } as unknown as Omit<FaqItem, "id">);
      }
      set({ modalOpen: false, editing: null });
      await get().refresh();
    } catch (e: unknown) {
      set({ loading: false, error: e instanceof Error ? e.message : String(e) });
      return;
    } finally {
      set({ loading: false });
    }
  },

  deactivate: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteFaq(String(id));
      await get().refresh();
    } catch (e: unknown) {
      set({ loading: false, error: e instanceof Error ? e.message : String(e) });
      return;
    } finally {
      set({ loading: false });
    }
  },
}));