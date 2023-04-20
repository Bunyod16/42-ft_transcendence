import DefaultLayout from "@/components/layout/DefaultLayout";
import ProfileIconBox from "@/components/profile/ProfileIconBox";
import StatsBox from "@/components/profile/StatsBox";
import { UserProfile } from "@/types/user-profile-type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const {username} = router.query;
  const [user, setUser] = useState<UserProfile>({name:""});

  useEffect(() => {
    if (!router.isReady) return;
    setUser({...user, name: username as string});
  },[router.isReady]);

  useEffect(() => {
    console.log(`Profile Page of :`,user);
  },[user]);
  
  return (
    <DefaultLayout>
      <ProfileIconBox {...user}></ProfileIconBox>
      <StatsBox></StatsBox>
    </DefaultLayout>
  );
}
