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
import { useState } from "react";

const UploadSong = ({ open, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    song: null,
  });
  const [songFileName, setSongFileName] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      song: file,
    });
    setSongFileName(file ? file.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("slug", generateRandomSlug());
    data.append("name", formData.name);
    data.append("song", formData.song);

    try {
      const response = await axios.post(
        "https://die-outjie-muisic.vercel.app/api/songs/songs/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      // Close the dialog
      onClose();
      // Clear the form
      setFormData({
        name: "",
        song: null,
      });
      setSongFileName("");
      // Set success message and navigate to songs page
      setSuccessMessage("Song uploaded successfully!");
      router.push("/songs");
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage("Error uploading song.");
    }
  };

  // Function to generate a random slug
  function generateRandomSlug() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8;
    let randomSlug = "";
    for (let i = 0; i < length; i++) {
      randomSlug += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomSlug;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Song</DialogTitle>
      <DialogContent>
        {successMessage && <p>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <TextField
              autoFocus
              label="Name"
              id="name"
              name="name"
              type="text"
              margin="normal"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              accept="audio/*"
              id="song"
              name="song"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="song">
              <Button variant="contained" component="span">
                Select Song
              </Button>
            </label>
            {songFileName && (
              <span style={{ marginLeft: "8px" }}>{songFileName}</span>
            )}
          </div>
          <DialogActions>
            <Button type="submit" sx={{ color: "#1FDD00" }}>
              Upload
            </Button>
            <Button onClick={onClose} sx={{ color: "black" }}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSong;
