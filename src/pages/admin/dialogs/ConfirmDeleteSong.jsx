// components/DeleteConfirmation.js
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const DeleteConfirmation = ({ open, onClose, slug }) => {
  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting song with slug:", slug); // Log the slug
      await axios.delete(`https://django-hello-world-roan-iota.vercel.app/api/songs/songs/${slug}`);
      handleClose();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this song?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ color: "black" }}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
