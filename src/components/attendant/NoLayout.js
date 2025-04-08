import React from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline } from '@mui/material';

const NoLayout = () => {
  return (
    <>
      <CssBaseline />
      <Outlet />
    </>
  );
};

export default NoLayout;
