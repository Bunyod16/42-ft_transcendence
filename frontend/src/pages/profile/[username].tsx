import DefaultLayout from "@/components/layout/DefaultLayout";
import ProfileIconBox from "@/components/profile/ProfileIconBox";
import StatsBox from "@/components/profile/StatsBox";
import useUserStore from "@/store/userStore";
import { UserProfile } from "@/types/user-profile-type";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const name = useUserStore((state) => state.name);

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
    if (name === username) router.push("/profile");
    getUserProfile(username as string);
    //eslint-disable-next-line
  }, [router.isReady]);

  return (
    <DefaultLayout>
      {loading ? (
        <Box
          component="div"
          sx={{ display: "flex", flexDirection: "column", margin: "auto" }}
        >
          <Typography variant="h2" sx={{ fontSize: "2.2em", margin: "auto" }}>
            Loading...
          </Typography>
          <RestartAltIcon
            sx={{
              margin: "auto",
              width: "50px",
              height: "50px",
              animation: "spin 2s linear infinite",
              "@keyframes spin": {
                "0%": {
                  transform: "rotate(360deg)",
                },
                "100%": {
                  transform: "rotate(0deg)",
                },
              },
            }}
          />
        </Box>
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
        <Box component="div" sx={{ margin: "auto" }}>
          <Typography variant="h2" sx={{fontSize:"2.2em"}}>
            User {username} {"doesn't"} exist ):
          </Typography>
        </Box>
      )}
    </DefaultLayout>
  );
}
