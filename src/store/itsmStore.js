// src/store/itsmStore.js
// Zustand store for ITSM tab system — ported from hi5tech TypeScript platform
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DASHBOARD_TAB = {
  id: "dashboard",
  title: "Dashboard",
  href: "/dashboard",
  pinned: true,
};

export const useItsmStore = create(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarOpen: true,
      sidebarDrawerOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      openDrawer: () => set({ sidebarDrawerOpen: true }),
      closeDrawer: () => set({ sidebarDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ sidebarDrawerOpen: !s.sidebarDrawerOpen })),

      // Tabs
      tabs: [DASHBOARD_TAB],

      setTabs: (tabs) => {
        const dedup = new Map();
        for (const t of tabs) dedup.set(t.id, t);
        dedup.set(DASHBOARD_TAB.id, DASHBOARD_TAB);
        const list = Array.from(dedup.values());
        list.sort((a, b) => (a.id === "dashboard" ? -1 : b.id === "dashboard" ? 1 : 0));
        set({ tabs: list });
      },

      upsertTab: (tab) => {
        const current = get().tabs ?? [];
        const map = new Map(current.map((t) => [t.id, t]));
        map.set(tab.id, tab);
        map.set(DASHBOARD_TAB.id, DASHBOARD_TAB);
        const list = Array.from(map.values());
        list.sort((a, b) => (a.id === "dashboard" ? -1 : b.id === "dashboard" ? 1 : 0));
        set({ tabs: list });
      },

      closeTab: (id) => {
        if (id === "dashboard") return;
        const next = (get().tabs ?? []).filter((t) => t.id !== id);
        if (!next.some((t) => t.id === "dashboard")) next.unshift(DASHBOARD_TAB);
        set({ tabs: next });
      },

      closeOthers: (keepId) => {
        const keep = (get().tabs ?? []).filter(
          (t) => t.id === keepId || t.id === "dashboard" || t.pinned
        );
        if (!keep.some((t) => t.id === "dashboard")) keep.unshift(DASHBOARD_TAB);
        keep.sort((a, b) => (a.id === "dashboard" ? -1 : b.id === "dashboard" ? 1 : 0));
        set({ tabs: keep });
      },

      togglePin: (id) => {
        const list = [...(get().tabs ?? [])];
        const idx = list.findIndex((t) => t.id === id);
        if (idx < 0) return;
        const t = list[idx];
        const next = { ...t, pinned: id === "dashboard" ? true : !t.pinned };
        list[idx] = next;
        const dashboard = list.find((x) => x.id === "dashboard");
        const others = list.filter((x) => x.id !== "dashboard");
        const reordered = [
          ...(dashboard ? [{ ...dashboard, pinned: true }] : []),
          ...others.filter((x) => x.pinned),
          ...others.filter((x) => !x.pinned),
        ];
        set({ tabs: reordered });
      },
    }),
    {
      name: "hi5-itsm-ui",
      version: 1,
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        tabs: state.tabs,
      }),
    }
  )
);

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      mode: "light", // light | dark | ocean | forest | sunset
      setMode: (mode) => set({ mode }),
    }),
    { name: "hi5-theme", version: 1 }
  )
);
