import React from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationSnackbar = ({ openSnackbar, closeSnackbar, message, severity }) => {
  return (
    <Snackbar
    open={openSnackbar}
    autoHideDuration={6000}
    onClose={closeSnackbar}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
        { message }
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;