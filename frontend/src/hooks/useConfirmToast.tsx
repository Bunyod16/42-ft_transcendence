import { Button, Typography } from "@mui/material";
import NotificationImportantSharpIcon from "@mui/icons-material/NotificationImportantSharp";
import toast from "react-hot-toast";

// interface useConfirmToastProp {
//   action: string;
//   callback: () => void;
// }
const useConfirmToast = () => {
  const confirmToast = (action: string, callback: () => void) =>
    toast.loading(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            Are you sure you want to {action}?
          </Typography>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{ ml: 1 }}
              onClick={() => {
                toast.dismiss(t.id);
                callback();
              }}
            >
              Yes
            </Button>
            <Button onClick={() => toast.dismiss(t.id)}>No</Button>
          </span>
        </span>
      ),
      {
        icon: <NotificationImportantSharpIcon color="error" />,
        id: "toastConfirm",
      },
    );

  return { confirmToast };
};

export default useConfirmToast;
