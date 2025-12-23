import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

import { Box } from "@mui/material";
import Footer from "../Footer";
import SidebarMenu from "../SidebarMenu";

const LayoutWebsite = () => {
  return (
    <Box bgcolor={"#f8fafc"} display={"flex"}>
      <SidebarMenu />
      <Box sx={{ overflowY: "scroll", height: "100vh" }} flex={3.3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutWebsite;
