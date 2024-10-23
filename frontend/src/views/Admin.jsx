import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import UserEditPopup from '../components/UserEditPopup';
import DeleteConfirmPopup from '../components/DeleteConfirmPopup';

const Admin = () => {
  const [users, setUsers] = useState([
    { firstName: 'John', lastName: 'Doe', username: 'johndoe', group: 'Użytkownicy' },
    { firstName: 'Jane', lastName: 'Smith', username: 'janesmith', group: 'Administratorzy' },
    { firstName: 'Alice', lastName: 'Johnson', username: 'alicejohnson', group: 'Użytkownicy' },
    { firstName: 'Bob', lastName: 'Brown', username: 'bobbrown', group: 'Administratorzy' },
    { firstName: 'Charlie', lastName: 'Davis', username: 'charliedavis', group: 'Użytkownicy' },
    { firstName: 'David', lastName: 'Wilson', username: 'davidwilson', group: 'Użytkownicy' },
    { firstName: 'Eve', lastName: 'Taylor', username: 'evetaylor', group: 'Administratorzy' },
    { firstName: 'Frank', lastName: 'Anderson', username: 'frankanderson', group: 'Użytkownicy' },
    { firstName: 'Grace', lastName: 'Thomas', username: 'gracethomas', group: 'Administratorzy' },
    { firstName: 'Hank', lastName: 'Moore', username: 'hankmoore', group: 'Użytkownicy' }
  ]);
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

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
      setEditUser({ firstName: '', lastName: '', username: '', group: '', password: '' });
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

  const saveUser = (task, userToSave) => {
    var updatedUsers = users;
    if(task === 'add') {
      updatedUsers = [...users, userToSave];
    }
    else if(task === 'edit') {
      updatedUsers = users.map((user, i) =>
        i === userToSave.index ? { firstName: userToSave.firstName, lastName: userToSave.lastName, username: userToSave.username, group: userToSave.group } : user
      );
    }
    else if(task === 'reset') {
      console.log('reset')
    }
    setUsers(updatedUsers);
    editDialogHandler('close');
  };

  const deleteUser = (confirm) => {
    if(confirm) {
      const newUsers = users.filter((user, index) => index !== userToDelete);
      setUsers(newUsers);
    }

    console.log(users);
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Header title="Predykcja chorób serca - Panel Administratora" />

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
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.firstName}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.lastName}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.username}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px' }}>{user.group}</TableCell>
                  <TableCell align="right" sx={{ padding: '4px' }}>
                    <IconButton onClick={() => editDialogHandler('edit', index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => editDialogHandler('reset', index)}>
                      <LockResetIcon />
                    </IconButton>
                    <IconButton onClick={() => confirmDeleteUser(index)}>
                      <ClearIcon />
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
          <AddIcon />
        </Button>
      </div>

      {(editUser && isEditDialogOpen) && (<UserEditPopup editUser={ editUser } isDialogOpen={ isEditDialogOpen }
        saveUser={ saveUser } closeDialog={editDialogHandler} task={ editTask } />)}

      <DeleteConfirmPopup isDialogOpen={isDeleteDialogOpen} confirm={deleteUser} />
    </>
  );
};

export default Admin;