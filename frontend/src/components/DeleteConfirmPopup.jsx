import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";

const DeleteConfirmPopup = ({ isDialogOpen, confirm, message }) => {
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
        <Button color="error" onClick={() => confirm(true)}>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmPopup;