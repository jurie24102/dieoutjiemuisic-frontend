import { AppBar, Button, Divider, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TopNav = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await axios.get(`https://die-outjie-muisic.vercel.app/api/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        if (response.data && !response.data.is_staff) {
          setIsStaff(false); // User is not staff
          router.replace("/");
          return;
        }
        setIsStaff(true); // User is staff
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await axios.get(`https://die-outjie-muisic.vercel.app/api/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppBar position="static" sx={{ mb: 2, backgroundColor: "#333333" }}>
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>Stryt vani georgi</Typography>
        {isStaff ? (
          <Button
            onClick={() => router.push("/admin")}
            sx={{ mr: 2, color: "orange" }}
          >
            Hi, {user?.username}
          </Button>
        ) : (
          <Typography variant="body1" sx={{ mr: 2 }}>
            Hi, {user?.username}
          </Typography>
        )}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
      <Divider sx={{ width: "100%", height: 2, backgroundColor: "orange" }} />
    </AppBar>
  );
};

export default TopNav;
