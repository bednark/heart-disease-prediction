import React, { useState } from "react";
import { TableRow, TableCell, IconButton, Collapse, Table, TableHead, TableBody, Box } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Clear } from "@mui/icons-material";

const CollapsableRow = ({ row, deleteRow }) => {
  const [open, setOpen] = useState(false);

  const parameters = {
    "Wiek": row.age,
    "Płeć": row.sex ? "Kobieta" : "Mężczyzna",
    "Ból w klatce piersiowej": row.cp,
    "Ciśnienie": row.trestbps,
    "Cholesterol": row.chol,
    "Podwyższony cukier na czczo": row.fbs ? "Tak" : "Nie",
    "Wynik spoczynkowego badania EKG": row.restecg,
    "Maksymalne tętno": row.thalach,
    "Dusznica wywołana wysiłkiem": row.exang ? "Tak" : "Nie",
    "Depresja odcinka ST": row.oldpeak,
    "Nachylenie szczytowego segmentu ST podczas wysiłku": row.slope,
    "Liczba głównych naczyń krwionośnych": row.ca,
    "Badanie talasemii": row.thal,
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.firstname}</TableCell>
        <TableCell>{row.lastname}</TableCell>
        <TableCell>{row.pesel}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.result}</TableCell>
        <TableCell align="right" sx={{ padding: '4px' }}>
          <IconButton
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
          <IconButton onClick={() => deleteRow(row.id)}>
            <Clear />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, width: 'calc(100% - 16px)' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Parametr</TableCell>
                    <TableCell>Wartość</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(parameters).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsableRow;