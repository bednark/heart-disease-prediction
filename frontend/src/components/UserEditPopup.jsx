import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, CircularProgress } from "@mui/material";

const UserEditPopup = ({ editUser, isDialogOpen, saveUser, closeDialog, task }) => {
  const [user, setUser] = useState({
    id: editUser.id || '',
    index: editUser.index || '',
    username: editUser.username || '',
    firstname: editUser.firstname || '',
    lastname: editUser.lastname || '',
    access_group: editUser.access_group || '',
  });
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditInputChange = (e) => {
    if(e.target.name !== 'password' && e.target.name !== 'passwordConfirm') {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
    }
    else if(e.target.name === 'password') {
      setPassword(e.target.value);
    }
    else if(e.target.name === 'passwordConfirm') {
      setPasswordConfirm(e.target.value);
    }
  };

  const passwordCheck = () => {
    if (password !== passwordConfirm) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  };

  const saveEdit = async () => {
    setIsSubmitting(true);
    if (task === 'reset' || task === 'add') {
      var passCheck = passwordCheck();
      user.password = password;
    }

    if(passCheck || task === 'edit')
      await saveUser(task, user);
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isDialogOpen} maxWidth="md" fullWidth>
      <DialogTitle>Edytuj użytkownika</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        { (task === 'edit' || task === 'add') && (<>
        <TextField
        label="Imię"
        name="firstname"
        value={user.firstname}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Nazwisko"
        name="lastname"
        value={user.lastname}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Nazwa użytkownika"
        name="username"
        value={user.username}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Grupa"
        select
        SelectProps={{ native: true }}
        margin="normal"
        name="access_group"
        value={user.access_group}
        onChange={handleEditInputChange}
        required>
          <option value=""></option>
          <option value="AuthenticatedUser">Użytkownik</option>
          <option value="Administrator">Administrator</option>
        </TextField>
        </>)}
        { (task === 'reset' || task === 'add') && (<>
        <TextField
        label="Hasło"
        name="password"
        type="password"
        value={password}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Potwierdź hasło"
        name="passwordConfirm"
        type="password"
        value={passwordConfirm}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        </>)}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog('close')} color="primary">
          Anuluj
        </Button>
        <Button onClick={saveEdit} color="primary" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Zapisz'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditPopup;