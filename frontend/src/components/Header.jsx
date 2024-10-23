import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Header = ({ title }) => {
  return (
    <AppBar position="static">
<Toolbar>
  <Typography variant="h6" style={{ flexGrow: 1 }}>
    {title}
  </Typography>
  <Typography variant="body1" style={{ marginRight: '20px' }}>
    Zalogowany jako: John Doe
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
      }}
    >
      <HomeIcon style={{ fontSize: '1.5rem' }} />
    </Link>
  </Button>
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
      }}
    >
      <AdminPanelSettingsIcon style={{ fontSize: '1.5rem' }} />
    </Link>
  </Button>
  <Button color="inherit" style={{ padding: 0, height: '100%' }}>
    <Link
      to="/logout"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <LogoutIcon style={{ fontSize: '1.5rem' }} />
    </Link>
  </Button>
</Toolbar>

    </AppBar>
  );
};

export default Header;