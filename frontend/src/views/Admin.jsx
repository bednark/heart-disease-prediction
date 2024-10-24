import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Clear, Edit, LockReset, Add } from '@mui/icons-material';
import Header from '../components/Header';
import UserEditPopup from '../components/UserEditPopup';
import DeleteConfirmPopup from '../components/DeleteConfirmPopup';
import NotificationSnackbar from '../components/NotificationSnackbar';
import api from '../api';

const Admin = ({ fullname, isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    api.get('/users').then(res => {
      setUsers(res.data);
    }).catch(() => {});
  }, []);

  const closeSnackbar = () => setOpenSnackbar(false);

  const confirmDeleteUser = (index) => {
    setUserToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const editDialogHandler = (task, index) => {
    if(task === 'close') {
      setEditUser(null);
      setIsEditDialogOpen(false);
      return;
    }

    if(task === 'add')
      setEditUser({ firstname: '', lastname: '', username: '', access_group: '', password: '' });
    else if(task === 'edit')
      setEditUser({ ...users[index], index });
    else if(task === 'reset') {
      const userToReset = { ...users[index], index }
      userToReset.password = '';
      userToReset.confirmPassword = '';
      setEditUser(userToReset);
    }

    setEditTask(task);
    setIsEditDialogOpen(true);
  };

  const openErrorSnackbar = (message) => {
    if (typeof message === 'object') {
      const errors = Object.keys(message).map((key) => [key, message[key]]);
      setSnackbarMessage(errors[0][1]);
    }
    else
      setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  }

  const saveUser = async (task, userToSave) => {
    var updatedUsers = users;
    const { id, index, ...user } = userToSave;
    if(task === 'add') {
      updatedUsers = [...users, userToSave];
      await api.post('/users', user).then((res) => {
        setUsers(updatedUsers);
        setSnackbarMessage(res.data.msg);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        editDialogHandler('close');
      }).catch(err => openErrorSnackbar(err.response.data));
    }
    else if(task === 'reset' || task === 'edit') {
      await api.put(`/user/${userToSave.id}`, user).then((res) => {
        updatedUsers = users.map((user, i) =>
          i === index ? { id: res.data.id, firstname: userToSave.firstname, lastname: userToSave.lastname,
            username: userToSave.username, access_group: userToSave.access_group } : user
        );
        setUsers(updatedUsers);
        setSnackbarMessage(res.data.msg);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        editDialogHandler('close');
      }).catch(err => openErrorSnackbar(err.response.data));
    }
  };

  const deleteUser = async (confirm) => {
    if(confirm) {
      await api.delete(`/user/${users[userToDelete].id}`).then((res) => {
        const newUsers = users.filter((user, index) => index !== userToDelete);
        setUsers(newUsers);
        setSnackbarMessage(res.data.msg);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }).catch(err => openErrorSnackbar(err.response.data));
    }
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Header title="Predykcja chorób serca - Panel Administratora" fullname={fullname} isAdmin={isAdmin} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: 'calc(100vh - 150px)' }}>
        <TableContainer component={Paper} style={{ height: '100%', overflow: 'auto', width: '100%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ height: '30px' }}>
                <TableCell align="center" sx={{ padding: '4px' }}>Imię</TableCell>
                <TableCell align="center" sx={{ padding: '4px' }}>Nazwisko</TableCell>
                <TableCell align="center" sx={{ padding: '4px' }}>Nazwa użytkownika</TableCell>
                <TableCell align="center" sx={{ padding: '4px' }}>Grupa</TableCell>
                <TableCell align="right" sx={{ padding: '4px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index} sx={{ height: '30px' }}>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.firstname}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.lastname}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.username}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>
                    {user.access_group === 'AuthenticatedUser' ? 'Użytkownik' : user.access_group}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '4px' }}>
                    <IconButton onClick={() => editDialogHandler('edit', index)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => editDialogHandler('reset', index)}>
                      <LockReset />
                    </IconButton>
                    <IconButton onClick={() => confirmDeleteUser(index)}>
                      <Clear />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px', marginRight: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => editDialogHandler('add')}>
          <Add />
        </Button>
      </div>

      {(editUser && isEditDialogOpen) && (<UserEditPopup editUser={ editUser } isDialogOpen={ isEditDialogOpen }
        saveUser={ saveUser } closeDialog={editDialogHandler} task={ editTask } />)}

      <NotificationSnackbar openSnackbar={openSnackbar} closeSnackbar={closeSnackbar} message={snackbarMessage} severity={snackbarSeverity} />
      <DeleteConfirmPopup isDialogOpen={isDeleteDialogOpen}
      confirm={deleteUser}
      message="Czy napewno chcesz usunąć wybranego użytkownika?" />
    </>
  );
};

export default Admin;