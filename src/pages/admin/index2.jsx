import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConfirmDeleteSong from "./dialogs/ConfirmDeleteSong";
import EditSongName from "./dialogs/EditSongName";
import UploadSongs from "./dialogs/UploadSongs";

import Delete from "../../../public/delete.svg";
import Edit from "../../../public/edit.svg";
import Play from "../../../public/play.svg";
import Stop from "../../../public/stop.svg";
import Upload from "../../../public/upload.svg";

import { useRouter } from "next/router";

const SongList = ({ isStaff }) => {
  const [songs, setSongs] = useState([]);
  const [deleteSongSlug, setDeleteSongSlug] = useState(null);
  const [openEditSongName, setOpenEditSongName] = useState(null);
  const [openUploadSongs, setOpenUploadSongs] = useState(false);
  const [playingSongSlug, setPlayingSongSlug] = useState(null);
  const audioRef = useRef(null);
  const [userCount, setUserCount] = useState(null);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await axios.get(
          `https://django-hello-world-roan-iota.vercel.app/api/user-count/`,
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
        setLoadingUser(false);
      }
    };

    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoadingSongs(true);
        const response = await axios.get(
          "https://django-hello-world-roan-iota.vercel.app/api/songs/songs/"
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoadingSongs(false);
      }
    };
    fetchSongs();
  }, [deleteSongSlug, openEditSongName, openUploadSongs]);

  const handleDeleteClick = (slug) => {
    setDeleteSongSlug(slug);
  };

  const handlePlayClick = async (slug) => {
    if (audioRef.current) {
      if (playingSongSlug === slug) {
        audioRef.current.pause();
        setPlayingSongSlug(null);
      } else {
        try {
          const response = await axios.get(
            `https://django-hello-world-roan-iota.vercel.app/api/songs/songs/${slug}/`
          );
          const songUrl = response.data.song;
          audioRef.current.src = songUrl;
          audioRef.current.play();
          setPlayingSongSlug(slug);
        } catch (error) {
          console.error("Error fetching song:", error);
        }
      }
    }
  };

  if (loadingUser || loadingSongs) {
    return (
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
    );
  }

  console.log("isStaff in SongList:", isStaff); // Debug statement

  if (!isStaff) {
    return (
      <Typography variant="h6">You do not have access to this page.</Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h4">DieoutjieAdmin</Typography>
        <Typography>{userCount} Users</Typography>
      </Box>
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Button variant="contained" onClick={() => router.push("/admin/users")}>
          Users
        </Button>
      </Box>
      <Container sx={{ mt: 4 }}>
        <IconButton
          sx={{ color: "#1FDD00", mb: 2 }}
          onClick={() => setOpenUploadSongs(true)}
          color="primary"
        >
          <Image src={Upload} width={24} height={24} alt="Upload" />
          <Typography sx={{ ml: 1 }}>Upload New Song</Typography>
        </IconButton>
        <TableContainer>
          <Table sx={{ border: 1, borderColor: "#f5f5f5" }}>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Song name</TableCell>
                <TableCell align="center" sx={{ width: 70 }}>
                  Play/Stop
                </TableCell>
                <TableCell align="center" sx={{ width: 70 }}>
                  Delete
                </TableCell>
                <TableCell align="center" sx={{ width: 70 }}>
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map((song) => (
                <TableRow key={song.slug}>
                  <TableCell>{song.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handlePlayClick(song.slug)}
                      color={
                        playingSongSlug === song.slug ? "secondary" : "primary"
                      }
                    >
                      {playingSongSlug === song.slug ? (
                        <Image src={Stop} width={24} height={24} alt="Upload" />
                      ) : (
                        <Image src={Play} width={24} height={24} alt="Upload" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteClick(song.slug)}
                      color="error"
                    >
                      <Image src={Delete} width={24} height={24} alt="Upload" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => setOpenEditSongName(song.slug)}
                      color="primary"
                    >
                      <Image src={Edit} width={24} height={24} alt="Upload" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <audio ref={audioRef} onEnded={() => setPlayingSongSlug(null)} />
        {deleteSongSlug && (
          <ConfirmDeleteSong
            open={true}
            onClose={() => setDeleteSongSlug(null)}
            slug={deleteSongSlug}
          />
        )}
        {openEditSongName && (
          <EditSongName
            open={true}
            onClose={() => setOpenEditSongName(null)}
            slug={openEditSongName}
          />
        )}
        {openUploadSongs && (
          <UploadSongs
            open={openUploadSongs}
            onClose={() => setOpenUploadSongs(false)}
          />
        )}
      </Container>
    </>
  );
};

export default SongList;
