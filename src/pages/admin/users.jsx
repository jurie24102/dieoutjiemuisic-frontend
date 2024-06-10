import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [userCount, setUserCount] = useState(null);
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await axios.get(
          `https://die-outjie-muisic.vercel.appworld-roan-iota.vercel.app/api/user-count/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user-count:", error);
      } finally {
        setLoadingUser(false); // Set loading to false when fetch is complete
      }
    };

    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
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
        setLoadingUser(false); // Set loading to false when fetch is complete
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await axios.get(`https://die-outjie-muisic.vercel.app/api/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${day}/${month} ${hours}:${minutes}`;
  };

  if (loadingUser) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    ); // Show loader when loading is true
  }

  if (!isStaff) {
    return null; // Return null if the user is not staff
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Button variant="contained" onClick={() => router.push("/admin/")}>
          Songs
        </Button>
        <Typography>{userCount} Users</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow bgcolor="lightgray">
              <TableCell>
                <Typography fontWeight={800} fontsize={20}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography align="right" fontWeight={800} fontsize={20}>
                  Date Joined
                </Typography>
              </TableCell>
              <TableCell>
                <Typography align="right" fontWeight={800} fontsize={20}>
                  Last Login
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell align="right">
                    {formatDate(user.date_joined)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDate(user.last_login)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Users;
