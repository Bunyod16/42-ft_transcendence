import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  isLoggedIn: boolean;
  name: string;
  login: (name: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      name: "",
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

      login: (name: string) => {
        set(() => ({
          isLoggedIn: true,
          name,
        }));
      },
      logout: () => {
        set(() => ({
          isLoggedIn: false,
          name: "",
          email: "",
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
