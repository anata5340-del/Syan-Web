import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Favourites, User } from "@/backend/types";
import axios from "axios";

export type UserState = {
  user: User | null;
  admin: {
    id: string;
    email: string;
    password: string;
    userName: string;
    role: "superadmin" | "subadmin";
    excludedModules?: string[];
  } | null;
  setUser: (newUser: User | null) => void;
  setAdmin: (adminData: UserState["admin"]) => void;
  favourites: Favourites | null;
  setFavourites: (newFavourites: Favourites | null) => void;
  getFavourites: () => void;
};

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      admin: null,
      setUser: (newUser: User | null) => set({ user: newUser }),
      setAdmin: (adminData) => set({ admin: adminData }),
      favourites: null,
      setFavourites: (newFavourites: Favourites | null) =>
        set({ favourites: newFavourites }),
      getFavourites: async () => {
        const { data } = await axios.get<{ favourites: Favourites }>(
          "/api/favourites"
        );
        set({ favourites: data.favourites });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
