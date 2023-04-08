import axios from "axios";
import { useRouter } from "next/router";
import create from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  isLoggedIn: boolean;
  name: string;
  login: () => void;
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

      login: () => {
        axios
          .get("/auth/login")
          .then((res) => {
            console.log(res);
            // const { name } = res.data;
            // set(() => ({
            //   isLoggedIn: true,
            //   name,
            // }));
          })
          .catch((err) => console.log(err));
        // set(() => ({
        //   isLoggedIn: true,
        //   name: "jatan",
        // }));
        console.log("logged in");
      },
      logout: async () => {
        // try {
        //   // Send a request to your backend server to invalidate the user's JWT cookie
        //   const response = await fetch("/api/logout", {
        //     method: "POST",
        //     credentials: "include", // Send cookies with the request
        //   });

        //   if (response.ok) {
        //     // The user is logged out, clear their information from the store
        //     set(() => ({
        //       isLoggedIn: false,
        //       name: "",
        //       email: "",
        //     }));
        //   }
        // } catch (error) {
        //   console.error(error);
        // }
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
