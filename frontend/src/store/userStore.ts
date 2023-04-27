import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = "Matching" | "Idle";

type Views = "Lobby" | "Game" | "Profile" | "Settings";

interface UserStore {
  isLoggedIn: boolean;
  id: number | null;
  nickName: string;
  avatar: string;
  state: States;
  view: Views;
  login: (name: string, id: number) => void;
  logout: () => void;
  updateName: (name: string) => void;
  updateState: (state: States) => void;
  updateView: (view: Views) => void;
  updateAvatar: (avatar: string) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      id: null,
      nickName: "",
      avatar: "",
      state: "Idle",
      view: "Lobby",
      // Persist state to localStorage
      // This will allow the state to be restored even if the user leaves the site
      // or refreshes the page
      // Note: Make sure to handle errors when accessing localStorage
      // since it can fail for various reasons
      // and potentially crash the app.
      // Also, consider using a more robust storage solution like IndexedDB
      // for better performance and reliability.
      // See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
      // for more information.
      login: (nickName: string, id: number) => {
        set(() => ({
          isLoggedIn: true,
          id,
          nickName,
        }));
      },
      updateName: (nickName: string) => {
        set(() => ({
          nickName,
        }));
      },
      logout: () => {
        set(() => ({
          isLoggedIn: false,
          nickName: "",
          id: null,
        }));
      },
      updateState: (state: States) => {
        set(() => ({
          state,
        }));
      },
      updateView: (view: Views) => {
        set(() => ({ view }));
      },
      updateAvatar: (avatar: string) => {
        set(() => ({
          avatar,
        }));
      },
    }),
    {
      name: "rgm-user-state", // name of the item in the storage (must be unique)
    },
  ),
);

// Persist state changes to localStorage
// This will ensure that any changes made to the user state are saved
// and can be restored when the user returns to the site
// useUserStore.subscribe(
//   (state) => {
//     localStorage.setItem("user", JSON.stringify(state));
//   },
//   (state) => state.isLoggedIn && typeof window !== "undefined",
// );

export default useUserStore;
