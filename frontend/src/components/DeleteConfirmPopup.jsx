import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent,
  Typography, DialogActions, Button, CircularProgress } from "@mui/material";

const DeleteConfirmPopup = ({ isDialogOpen, confirm, message }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = async () => {
    setIsSubmitting(true);
    await confirm(true);
    setIsSubmitting(false);
  }
  return (
    <Dialog open={isDialogOpen} fullWidth>
      <DialogTitle>Potwierdź</DialogTitle>
      <DialogContent>
        <Typography>{ message }</Typography>
      </DialogContent>
      <DialogActions>
        <Button  color="primary" onClick={() => confirm(false)}>
          Anuluj
        </Button>
        <Button color="error" onClick={() => closeDialog()} disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Usuń'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmPopup;