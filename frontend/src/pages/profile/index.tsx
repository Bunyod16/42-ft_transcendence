import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import { UserProfile } from "@/types/user-profile-type";
import { useEffect, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Typography, Box } from "@mui/material";
import Profile from "@/components/profile/Profile";
import axios from "../../components/utils/apiClient";

/*
 * Default page for the user themselves
 * Have to query from userStore or wtv.
 * */

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  // const nickName = useUserStore((state) => state.nickName);
  const [nickName, avatar] = useUserStore((state) => [
    state.nickName,
    state.avatar,
  ]);
  const hostUrl = process.env.HOST_URL || "localhost";

  const getUserProfile = async (username: string) => {
    try {
      const res = await axios.get(`/user/findOneProfileByUsername/${username}`);
      const data = await res.data;
      const status = res.status;

      //not sure if it will ever 404 since user is logged in but just incase
      if (status === 200) {
        setUserExists(true);
      } else {
        setUserExists(false);
      }
      setLoading(false);

      setUser({ ...data, avatar: avatar });
      // setUser((prev) => ({ ...prev }));
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserProfile(nickName);
    //eslint-disable-next-line
  }, []);

  return (
    // <DefaultLayout>
    <>
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
        <>User Not Logged In or you do not exist, hence you are here</>
      )}
    </>
    // </DefaultLayout>
  );
}
