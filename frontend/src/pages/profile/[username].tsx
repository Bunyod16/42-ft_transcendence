import DefaultLayout from "@/components/layout/DefaultLayout";
import ProfileIconBox from "@/components/profile/ProfileIconBox";
import StatsBox from "@/components/profile/StatsBox";
import { UserProfile } from "@/types/user-profile-type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async (username: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/user/findOneProfileByUsername/${username}`,
      );
      const data = await res.json();
      const status = res.status;
      if (status === 200) {
        setUserExists(true);
      } else {
        setUserExists(false);
      }
      setLoading(false);
      console.log(data);
      setUser(data);
    } catch (err) {
      setLoading(false);
      setUserExists(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    getUserProfile(username as string);
    //eslint-disable-next-line
  }, [router.isReady]);

  return (
    <DefaultLayout>
      {loading ? (
        <>loading</>
      ) : userExists ? (
        <>
          {user !== undefined && (
            <>
              <ProfileIconBox {...user}></ProfileIconBox>
              <StatsBox {...user}></StatsBox>
            </>
          )}
        </>
      ) : (
        <>User {username} Doesnt Exists</>
      )}
    </DefaultLayout>
  );
}
