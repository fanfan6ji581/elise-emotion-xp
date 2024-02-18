import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { loginAdmin, logout } from "../../slices/adminSlice";
import { useNavigate } from "react-router-dom"

export default function AdminAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginAdminS = useSelector(loginAdmin);

  const onClickLogout = () => {
    dispatch(logout());
    navigate('/admin/login')
  }

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Emotion XP
          </Typography>
          {loginAdminS && <Button component={Link} to="/admin/dashboard" color="inherit">Dashboard</Button>}
          {loginAdminS && <Button color="inherit" onClick={onClickLogout}>Logout</Button>}
          {!loginAdminS && <Button component={Link} to="/admin/login" color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}