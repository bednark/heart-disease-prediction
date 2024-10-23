import React, { useState, useEffect } from 'react';
import { TextField, Button, Table,
  TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, IconButton,
  Collapse, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import Header from '../components/Header';
import axios from 'axios';

const Home = () => {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/patients', { withCredentials: true })
      .then(res => {
        setResults(res.data);
      });
  }, []);

  const makePrediction = async (e) => {
    e.preventDefault();
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

    try {
      await axios.post('http://localhost:8080/patients', patient, { withCredentials: true })
        .then(res => {
          patient.id = res.data.id;
          patient.result = res.data.result;
          setResults([...results, patient]);
          e.form.reset();
        });
    }
    catch (err) {}
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
                label="Cukier na czczo"
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
                <option value="1">1: Nienormalność fal ST-T (np. inwersja fali T, uniesienie ST lub obniżenie ST)</option>
                <option value="2">2: Hipertrofia lewej komory serca.</option>
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
          <Button variant="contained" color="primary" type="submit" fullWidth>Wykonaj predykcję</Button>
        </form>
      </Box>

      <Box flex={1} p={2}>
      <div style={{ display: 'flex', height: 'calc(100vh - 150px)' }}>
        <TableContainer component={Paper}>
          <Table size="small">
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
                <>
                <TableRow key={row.id}>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  <TableCell>{row.pesel}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.result}</TableCell>
                  <TableCell align="right" sx={{ padding: '4px' }}>
                  <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                    <IconButton>
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                      <Table size="small" aria-label="resultDetails">
                        <TableHead>
                          <TableRow>
                            <TableCell>Parametr</TableCell>
                            <TableCell>Wartość</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Ciśnienie</TableCell>
                            <TableCell>150</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                   </Collapse>
                </TableCell> 
                </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      </Box>
    </Box>
    </>
  );
};

export default Home;