import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import { UserProfile } from "@/types/user-profile-type";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Profile from "@/components/profile/Profile";
import axios from "../../components/apiClient/apiClient"
export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const nickName = useUserStore((state) => state.nickName);
  const hostUrl = process.env.HOST_URL || 'localhost';

  const getUserProfile = async (username: string) => {
    try {
      const res = await axios.get(
        `/user/findOneProfileByUsername/${username}`,
      );
      const data = await res.data;
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
    if (nickName === username) router.push("/profile");
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
              <Profile {...user} />
            </>
          )}
        </>
      ) : (
        <Box component="div" sx={{ margin: "auto" }}>
          <Typography variant="h2" sx={{ fontSize: "2.2em" }}>
            User {username} {"doesn't"} exist ):
          </Typography>
        </Box>
      )}
    </DefaultLayout>
  );
}
