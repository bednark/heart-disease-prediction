import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import api from '../api';
import NotificationSnackbar from '../components/NotificationSnackbar';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    api.get('/auth/check').then(() => {
      window.location = '/'
      setIsAuthenticated(true);
    }).catch(() => {})
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(5000)
    const data = new FormData(e.currentTarget);
    const credentials = {
      username: data.get('username'),
      password: data.get('password'),
    };

    api.post(`/auth`, credentials).then((res) => {
      window.location.href = '/';
    }).catch(err => {
        const error_msg = err.response.data.msg
        if (typeof error_msg === 'object') {
          const errors = Object.keys(error_msg).map((key) => [key, error_msg[key]]);
          setSnackbarMessage(errors[0][1]);
        }
        else
          setSnackbarMessage(error_msg);

        setSnackbarSeverity('error');
        setOpenSnackBar(true);
        e.target.reset();
        setIsSubmitting(false);
      });
  };

  const closeSnackbar = () => setOpenSnackBar(false);

  return (
    <>
      {!isAuthenticated ? (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
          <div>
            <Typography component="h2" variant="h5" textAlign="center">
              Predykcja chorób serca
            </Typography>
            <Typography component="h1" variant="h6" textAlign="center">
              Logowanie
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nazwa użytkownika"
              name="username"
              autoFocus />
              <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Hasło"
              type="password"
              id="password"
              autoComplete="current-password" />
              <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : 'Zaloguj się'}
              </Button>
            </form>
          </div>
          <NotificationSnackbar
          openSnackbar={openSnackbar}
          closeSnackbar={closeSnackbar}
          message={snackbarMessage}
          severity={snackbarSeverity} />
        </Container>
      ) : null }
    </>
  );
}