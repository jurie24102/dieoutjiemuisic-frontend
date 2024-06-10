import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
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
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
      const checkToken = async () => {
        const { pathname } = router;

        // Routes that require staff check
        const staffRoutes = ["/admin", "/admin/users"];

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

        if (staffRoutes.includes(pathname)) {
          try {
            const response = await axios.get(
              `https://django-hello-world-roan-iota.vercel.app/api/user/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            console.log("User data:", response.data); // Debug statement

            if (response.data && !response.data.is_staff) {
              setIsStaff(false);
              router.replace("/");
            } else {
              setIsStaff(true);
            }
          } catch (error) {
            console.error("Error fetching user:", error);
            router.push("/login");
          }
        }

        setLoading(false);
      };

      checkToken();
    }, [router]);

    if (loading) {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    return <WrappedComponent {...props} isStaff={isStaff} />;
  };
};

export default withAuth;
