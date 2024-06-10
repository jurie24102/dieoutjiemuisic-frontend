// hoc/withAuth.js
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
} from "../services/token";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkToken = async () => {
        const { pathname } = router;
        if (pathname === "/register" || pathname === "/login") {
          setLoading(false);
          return;
        }

        let accessToken = getAccessToken();
        if (!accessToken || isTokenExpired(accessToken)) {
          accessToken = await refreshAccessToken();
          if (!accessToken) {
            router.push("/login");
            return;
          }
        }
        setLoading(false);
      };

      checkToken();
    }, [router]);

    if (loading) {
      return (
        <>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        </>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
