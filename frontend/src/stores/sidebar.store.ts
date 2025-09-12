import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SidebarStore = {
    collapse: boolean;
    toggleCollapse: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set, get) => ({
            collapse: false,
            toggleCollapse: () => set({ collapse: !get().collapse }),
        }),
        {
            name: "sidebar", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
