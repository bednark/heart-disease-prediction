import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

const UserEditPopup = ({ editUser, isDialogOpen, saveUser, closeDialog, task }) => {
  const [user, setUser] = useState(editUser);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const passwordCheck = () => {
    if (user.password !== user.passwordConfirm) {
      console.log(user.password);
      console.log(user.passwordConfirm);
      alert('Passwords do not match!');
      return false;
    }

    return true;
  };

  const saveEdit = () => {
    if (task === 'reset' || task === 'add') {
      var passCheck = passwordCheck();
    }

    if(passCheck) {
      saveUser(task, user);
      closeDialog('close');
    }
  }

  return (
    <Dialog open={isDialogOpen} maxWidth="md" fullWidth>
      <DialogTitle>Edytuj użytkownika</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        { (task === 'edit' || task === 'add') && (<>
        <TextField
        label="Imię"
        name="firstName"
        value={user.firstName}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Nazwisko"
        name="lastName"
        value={user.lastName}
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
        name="group"
        value={user.group}
        onChange={handleEditInputChange}
        required>
          <option value=""></option>
          <option value="Użytkownicy">Użytkownicy</option>
          <option value="Administratorzy">Administratorzy</option>
        </TextField>
        </>)}
        { (task === 'reset' || task === 'add') && (<>
        <TextField
        label="Hasło"
        name="password"
        type="password"
        value={user.password}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        <TextField
        label="Potwierdź hasło"
        name="passwordConfirm"
        type="password"
        value={user.passwordConfirm}
        onChange={handleEditInputChange}
        margin="normal"
        required />
        </>)}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog('close')} color="primary">
          Cancel
        </Button>
        <Button onClick={saveEdit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditPopup;