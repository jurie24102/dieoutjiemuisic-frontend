import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditSong = ({ open, onClose, slug }) => {
  const router = useRouter();
  const [song, setSong] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (slug) {
      const fetchSong = async () => {
        try {
          const response = await axios.get(
            `https://die-outjie-muisic.vercel.app/api/songs/songs/${slug}/`
          );
          setSong(response.data);
          setUpdatedName(response.data.name);
        } catch (error) {
          console.error("Error fetching song:", error);
        }
      };
      fetchSong();
    }
  }, [slug]);

  const handleNameChange = (event) => {
    setUpdatedName(event.target.value);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`https://die-outjie-muisic.vercel.app/api/songs/songs/${slug}/`, {
        name: updatedName,
      });
      // Close the dialog
      onClose();
      // Trigger a re-fetch of the song list by setting openEditSongName to null
      setOpenEditSongName(null);
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  if (!song) return <div>Loading...</div>;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Song</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="songName"
          label="Song Name"
          type="text"
          fullWidth
          value={updatedName}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
        <Button onClick={onClose} sx={{ color: "black" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSong;
