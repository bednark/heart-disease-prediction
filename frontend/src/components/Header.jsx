import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import api from '../api';

const Header = ({ title, fullname, isAdmin }) => {
  const logout = () => {
    api.get('/auth/revoke').then(() => window.location = '/login')
      .catch(() => window.location = '/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          { title }
        </Typography>
        <Typography variant="body1" style={{ marginRight: '20px' }}>
          Zalogowany jako: { fullname }
        </Typography>
        <Button color="inherit" style={{ padding: 0, height: '100%' }}>
          <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '6px 16px',
          }}>
            <HomeIcon style={{ fontSize: '1.5rem' }} />
          </Link>
        </Button>
        {isAdmin ? (
          <Button color="inherit" style={{ padding: 0, height: '100%' }}>
            <Link
            to="/admin"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: '6px 16px',
            }}>
              <AdminPanelSettingsIcon style={{ fontSize: '1.5rem' }} />
            </Link>
          </Button>
        ) : null }
        <Button color="inherit"
        style={{
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 16px',
        }}
        onClick={logout}>
          <LogoutIcon style={{ fontSize: '1.5rem' }} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;