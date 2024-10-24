import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Box, CircularProgress } from '@mui/material';
import Header from '../components/Header';
import CollapsableRow from '../components/CollapsableRow';
import NotificationSnackbar from '../components/NotificationSnackbar';
import DeleteConfirmPopup from '../components/DeleteConfirmPopup';
import api from '../api';

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await api.get('/patients')
        .then(res => {
          setResults(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
      }
    fetchData();
  }, []);

  const closeSnackbar = () => setOpenSnackbar(false);

  const makePrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData(e.currentTarget);
    const patient = {
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      pesel: data.get('pesel'),
      email: data.get('email'),
      phone: data.get('phone'),
      cp: parseInt(data.get('cp')),
      trestbps: parseInt(data.get('trestbps')),
      chol: parseInt(data.get('chol')),
      fbs: Boolean(data.get('fbs')),
      restecg: parseInt(data.get('restecg')),
      thalach: parseInt(data.get('thalach')),
      exang: Boolean(data.get('exang')),
      oldpeak: parseInt(data.get('oldpeak')),
      slope: parseInt(data.get('slope')),
      ca: parseInt(data.get('ca')),
      thal: parseInt(data.get('thal')),
    };

    await api.post('/patients', patient)
      .then(res => {
        patient.id = res.data.id;
        patient.result = res.data.result;
        patient.age = res.data.age;
        patient.sex = res.data.sex;
        setResults([...results, patient]);
        e.target.reset();
        setSnackbarMessage(res.data.msg);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }).catch(err => {
        const error_msg = err.response.data.msg
        if (typeof error_msg === 'object') {
          const errors = Object.keys(error_msg).map((key) => [key, error_msg[key]]);
          setSnackbarMessage(errors[0][1]);
        }
        else
          setSnackbarMessage(error_msg);

        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
    setIsSubmitting(false);
  }

  const deletePatientConfirm = (id) => {
    setPatientToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  const deletePatient = async (confirm) => {
    if(!confirm)
      return
    await api.delete(`/patient/${patientToDelete}`)
      .then((res) => {
        const newResults = results.filter((result) => result.id !== patientToDelete);
        setResults(newResults);
        setSnackbarMessage(res.data.msg);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }).catch(err => {
        const error_msg = err.response.data.msg
        if (typeof error_msg === 'object') {
          const errors = Object.keys(error_msg).map((key) => [key, error_msg[key]]);
          setSnackbarMessage(errors[0][1]);
        }
        else
          setSnackbarMessage(error_msg);

        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
      setIsDeleteDialogOpen(false);
  }

  return (
    <>
      <Header title="Predykcja chorób serca" />
      <Box display="flex">
        <Box flex={1} p={2}>
          <form onSubmit={makePrediction}>
            <Box display="flex" flexWrap="wrap">
              <Box flex={1} p={1}>
                <TextField label="Imie" id="firstname" name="firstname" fullWidth margin="normal" required />
                <TextField label="Nazwisko" name="lastname" fullWidth margin="normal" required />
                <TextField label="Pesel" name="pesel" fullWidth margin="normal" required />
                <TextField label="Email" name="email" fullWidth margin="normal" required />
                <TextField label="Numer telefonu" name="phone" fullWidth margin="normal" required />
                <TextField
                  label="Ból w klatce piersiowej"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="cp"
                >
                  <option value=""></option>
                  <option value="0">0: Brak bólu</option>
                  <option value="1">1: Typowy ból w klatce piersiowej związany z dławicą piersiową</option>
                  <option value="2">2: Nietypowy ból dławicowy</option>
                  <option value="3">3: Ból niezwiązany z sercem</option>
                </TextField>
                <TextField
                  label="Ciśnienie"
                  type="number"
                  inputProps={{ min: 80, max: 200 }}
                  fullWidth
                  margin="normal"
                  required
                  name="trestbps"
                />
                <TextField
                  label="Cholesterol"
                  type="number"
                  inputProps={{ min: 100, max: 600 }}
                  fullWidth
                  margin="normal"
                  required
                  name="chol"
                />
              </Box>
              <Box flex={1} p={1}>
                <TextField
                  label="Podwyższony cukier na czczo"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="fbs"
                >
                  <option value=""></option>
                  <option value="1">Tak</option>
                  <option value="0">Nie</option>
                </TextField>
                <TextField
                  label="Wyniki spoczynkowego badania EKG"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="restecg"
                >
                  <option value=""></option>
                  <option value="0">0: Normalny</option>
                  <option value="1">1: Nienormalność fal ST-T</option>
                  <option value="2">2: Hipertrofia lewej komory serca</option>
                </TextField>
                <TextField
                  label="Maksymalne tętno"
                  type="number"
                  inputProps={{ min: 60, max: 220 }}
                  fullWidth
                  margin="normal"
                  required
                  name="thalach"
                />
                <TextField
                  label="Dusznica wywołana wysiłkiem"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="exang"
                >
                  <option value=""></option>
                  <option value="1">Tak</option>
                  <option value="0">Nie</option>
                </TextField>
                <TextField
                  label="Depresja odcinka ST"
                  type="number"
                  inputProps={{ min: 0, max: 6 }}
                  fullWidth
                  margin="normal"
                  name="oldpeak"
                />
                <TextField
                  label="Nachylenie szczytowego segmentu ST podczas wysiłku"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="slope"
                >
                  <option value=""></option>
                  <option value="0">0: Nachylenie poziome</option>
                  <option value="1">1: Nachylenie opadające</option>
                  <option value="2">2: Nachylenie rosnące</option>
                </TextField>
                <TextField
                  label="Liczba głównych naczyń krwionośnych"
                  type="number"
                  inputProps={{ min: 0, max: 3 }}
                  fullWidth
                  margin="normal"
                  required
                  name="ca"
                />
                <TextField
                  label="Badanie talasemii"
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="thal"
                >
                  <option value=""></option>
                  <option value="0">0: Normalny</option>
                  <option value="1">1: Defekt stały</option>
                  <option value="2">2: Defekt odwracalny</option>
                </TextField>
              </Box>
            </Box>
            <Button variant="contained" color="primary" type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Wykonaj predykcję'}
            </Button>
          </form>
        </Box>

        <Box flex={1} p={2}>
          {loading ? (
            <div style={{ display: 'flex', height: 'calc(100vh - 150px)', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div style={{ display: 'flex', height: 'calc(100vh - 150px)', justifyContent: 'center', alignItems: 'center', color: 'red' }}>
              Błąd pobierania danych
            </div>
          ) : (
            <div style={{ display: 'flex', height: 'calc(100vh - 150px)' }}>
              <TableContainer style={{ overflowY: 'scroll'}}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Imię</TableCell>
                      <TableCell>Nazwisko</TableCell>
                      <TableCell>Pesel</TableCell>
                      <TableCell>Numer telefonu</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Wynik</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((row) => (
                      <CollapsableRow key={row.id} row={row} deleteRow={deletePatientConfirm} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </Box>
      </Box>
      <NotificationSnackbar openSnackbar={openSnackbar} closeSnackbar={closeSnackbar} message={snackbarMessage} severity={snackbarSeverity} />
      <DeleteConfirmPopup isDialogOpen={isDeleteDialogOpen}
        confirm={deletePatient}
        message="Czy napewno chcesz usunąć wybranego pacjenta?"
      />
    </>
  );
};

export default Home;