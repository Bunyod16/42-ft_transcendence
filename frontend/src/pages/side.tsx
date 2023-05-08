import DefaultLayout from "@/components/layout/DefaultLayout";
import Login from "./login";
import useUserStore from "@/store/userStore";
import { useState, useEffect } from "react";
export default function Side() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isLoggedIn) return <Login />;
  return <></>;
  // return <DefaultLayout />;
}
