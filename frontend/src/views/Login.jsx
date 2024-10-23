import React from 'react';
import { Container, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

export default function Login() {

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const credentials = {
      username: data.get('username'),
      password: data.get('password'),
    };

    axios.post(`http://localhost:8080/auth`, credentials, { withCredentials: true }).then((res) => {
      // console.log(res);
    }).catch((err) => {
      // console.error(err);
    });
  };

  return (
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
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Hasło"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Zaloguj się
          </Button>
        </form>
      </div>
    </Container>
  );
}