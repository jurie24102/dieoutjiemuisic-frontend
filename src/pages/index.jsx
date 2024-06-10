import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Dieoutjiemuisic from "../../public/Dieoutjiemuisic.png";
import Download from "../../public/download.svg";
import Pause from "../../public/pause.svg";
import Play from "../../public/play.svg";
import Shuffle from "../../public/shuffle.svg";
import SkipB from "../../public/skipB.svg";
import SkipN from "../../public/skipN.svg";

const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playRandom, setPlayRandom] = useState(false);
  const [previousSongIndex, setPreviousSongIndex] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [songs, setSongs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const audioRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          `https://django-hello-world-roan-iota.vercel.appsongs/`
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    setFilteredSongs(
      songs.filter((song) =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, songs]);

  const handleSearch = (event, value) => {
    setSearchQuery(value || "");
  };

  const handleSongSelect = (event, value) => {
    setSelectedSong(value);
    if (value) {
      const songIndex = songs.findIndex((song) => song.name === value.name);
      selectSongHandler(songIndex);
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          `https://django-hello-world-roan-iota.vercel.app/api/songs/songs/?timestamp=${lastUpdated}`
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [lastUpdated]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.src = songs[currentSongIndex]?.url;
    if (isPlaying) {
      audioRef.current.play();
    }
    setCurrentTime(0); // Reset currentTime when changing the song
  }, [currentSongIndex, songs]);

  useEffect(() => {
    if (songs.length > 0) {
      audioRef.current.src = songs[currentSongIndex]?.song; // Update to use song URL
      if (isPlaying) {
        audioRef.current.play();
      }
      setCurrentTime(0); // Reset currentTime when changing the song
    }
  }, [currentSongIndex, songs]);

  const playPauseHandler = () => {
    if (currentSongIndex === null && !playRandom) {
      setCurrentSongIndex(0); // Play the first song if no song is selected
      setIsPlaying(true);
    } else if (currentSongIndex === null && playRandom) {
      playRandomSong();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const skipForwardHandler = () => {
    setPreviousSongIndex(currentSongIndex);
    if (playRandom) {
      playRandomSong();
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === songs.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const skipBackHandler = () => {
    if (previousSongIndex !== null) {
      setCurrentSongIndex(previousSongIndex);
      setPreviousSongIndex(null);
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
    }
  };

  const autoPlayNext = () => {
    if (playRandom) {
      playRandomSong();
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === songs.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const onEndedHandler = () => {
    autoPlayNext();
  };

  const onTimeUpdateHandler = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const onSeekHandler = (e, value) => {
    setCurrentTime(value);
    audioRef.current.currentTime = value;
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const selectSongHandler = (index) => {
    setPreviousSongIndex(currentSongIndex); // Save the current song index before changing
    setCurrentSongIndex(index);
    setIsPlaying(true); // Start playing the selected song
  };

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(randomIndex);
    setIsPlaying(true); // Start playing the random song
  };

  const toggleRandom = () => {
    setPlayRandom((prev) => !prev); // Toggle playRandom state
  };

  const handleDownload = (song) => {
    setSelectedSong(song);
    setOpenDialog(true);
  };

  const confirmDownload = async () => {
    try {
      const response = await axios.get(
        `https://django-hello-world-roan-iota.vercel.app/api/songs/songs/${selectedSong.slug}/download/`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedSong.name}.mp3`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error downloading song:", error);
    }
  };

  const CustomListbox = (props) => {
    const { children, ...other } = props;
    return (
      <ul {...other} style={{ padding: 0, margin: 0 }}>
        {children.map((child, index) => (
          <div key={index}>
            {child}
            {index < children.length - 1 && <Divider />}
          </div>
        ))}
      </ul>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        height: "calc(100vh - 70px)",
        overflow: "hidden",
      }}
    >
      <audio
        ref={audioRef}
        onEnded={onEndedHandler}
        onTimeUpdate={onTimeUpdateHandler}
        onLoadedMetadata={onLoadedMetadata}
      ></audio>

      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", my: 1 }}
      >
        Dieoutjiemuisic
      </Typography>

      <div>
        <Autocomplete
          value={selectedSong}
          onChange={handleSongSelect}
          inputValue={searchQuery}
          onInputChange={handleSearch}
          options={searchQuery ? filteredSongs : []}
          getOptionLabel={(song) => song.name}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a song"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "100px",
                    backgroundColor: "offwhite",
                    borderColor: "grey",
                  },
                  "&:hover fieldset": {
                    borderColor: "#999",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "orange",
                  },
                },
                mb: 1,
                px: 1,
              }}
            />
          )}
          PaperComponent={({ children }) => (
            <Box
              sx={{
                bgcolor: "lightgray",
                borderRadius: "5px",
                mt: 1,
              }}
            >
              {children}
            </Box>
          )}
          ListboxComponent={CustomListbox}
        />
      </div>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Box sx={{ maxWidth: 450, px: 2 }}>
            <Box
              alignItems="center"
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              <IconButton variant="contained" onClick={skipBackHandler}>
                <Image alt="image" src={SkipB} width={20} height={20} />
              </IconButton>
              <IconButton variant="contained" onClick={playPauseHandler}>
                {isPlaying ? (
                  <Image alt="image" src={Pause} width={20} height={20} />
                ) : (
                  <Image alt="image" src={Play} width={20} height={20} />
                )}
              </IconButton>
              <IconButton variant="contained" onClick={skipForwardHandler}>
                <Image alt="image" src={SkipN} width={20} height={20} />
              </IconButton>
              <IconButton variant="contained" onClick={toggleRandom}>
                {playRandom ? (
                  <Image alt="image" src={Shuffle} width={20} height={20} />
                ) : (
                  <Image
                    alt="image"
                    src={Shuffle}
                    width={20}
                    height={20}
                    style={{ transform: "rotate(180deg)" }}
                  />
                )}
              </IconButton>
              <IconButton
                variant="contained"
                onClick={() => handleDownload(songs[currentSongIndex])}
              >
                <Image alt="image" src={Download} width={20} height={20} />
              </IconButton>
            </Box>
            <Box>
              <Slider
                value={currentTime}
                max={duration || 0}
                onChange={onSeekHandler}
                disabled={!isPlaying}
                sx={{
                  width: "100%",
                  color: "red", // Change the color to red
                  "& .MuiSlider-thumb": {
                    width: 12, // Set the width of the thumb
                    height: 12, // Set the height of the thumb
                  },
                }}
              />
            </Box>
            <Typography mt={-0.2}>{songs[currentSongIndex]?.name}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Image
            src={Dieoutjiemuisic}
            alt="Song Cover"
            width={100}
            height={100}
            style={{ borderRadius: "100px", border: "2px solid orange" }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />
      <Box sx={{ maxHeight: "60vh", overflowY: "auto", px: 1 }}>
        <Grid container spacing={1} mb={15}>
          {songs.map((song, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  padding: currentSongIndex === index ? 0.8 : 1,
                  bgcolor: currentSongIndex === index ? "#333333" : "#000000",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: currentSongIndex === index ? "none" : 1,
                  border:
                    currentSongIndex === index ? "2px solid orange" : "none",
                  borderTopRightRadius:
                    currentSongIndex === index ? 15 : "none",
                  borderBottomRightRadius:
                    currentSongIndex === index ? 15 : "none",
                }}
              >
                <Box
                  sx={{ width: "100%", py: 0.9 }}
                  onClick={() => selectSongHandler(index)}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: currentSongIndex === index ? 700 : 400,
                      color: currentSongIndex === index ? "orange" : "white",
                    }}
                  >
                    {song.name}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDownload(song)}
                  sx={{
                    color: currentSongIndex === index ? "red" : "white",
                    bgcolor: currentSongIndex === index ? "orange" : "red",
                  }}
                >
                  <Image alt="image" src={Download} width={20} height={20} />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          textAlign: "center",
          "& .MuiDialog-paper": {
            width: "400px",
            borderRadius: "10px",
            p: 2,
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          Download Song?
        </Typography>
        <Typography
          sx={{
            fontWeight: 100,
            fontSize: 14,
            my: 4,
          }}
        >
          {selectedSong?.name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            sx={{ color: "#000000" }}
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDownload}
            sx={{ bgcolor: "#000000" }}
          >
            Download
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default IndexPage;
