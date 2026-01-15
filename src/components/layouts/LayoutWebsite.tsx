import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import Footer from "../Footer";
import SidebarMenu from "../SidebarMenu";

const LayoutWebsite = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box bgcolor={"#f8fafc"} gap={5} display={"flex"}>
      <SidebarMenu />
      <Box sx={{ overflowY: "scroll", height: "100vh",pt:isMobile?"80px":0 }} flex={3.3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutWebsite;
