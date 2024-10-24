import React, { useState, useEffect, cloneElement } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { Box, CircularProgress } from '@mui/material';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fullname, setFullname] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await api.get('/auth/check');
        if (isMounted) {
          setFullname(res.data.fullname);
          setIsAuthenticated(true);
          if (res.data.access_group === 'Administrator') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated)
    return <Navigate to="/login" />;

  if (!isAdmin)
    return <Navigate to="/" />;


  return cloneElement(children, { fullname, isAdmin });
};

export default AdminRoute;