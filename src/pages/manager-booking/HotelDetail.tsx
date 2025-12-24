import { Box, Typography, Button, Chip } from "@mui/material";
import { ArrowBackIos, Edit as EditIcon, Star } from "@mui/icons-material";
import { Grid, Paper, Stack, Divider } from "@mui/material";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotel } from "../../service/hotel";
import BookingDetailController from "./BookingDetailController";

export default function HotelDetail({
  setAction,
  setRoom,
  detailHotel,
  getHotelDetail,
}) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HotelHeader detailHotel={detailHotel} setAction={setAction} />
      <BookingDetailController id={detailHotel.id} />
    </Box>
  );
}

function HotelHeader({ setAction, detailHotel }) {
  const parseVi = (str) => {
    if (!str) return "";
    try {
      const parsed = JSON.parse(str);
      return parsed.vi || "";
    } catch {
      return str;
    }
  };

  const hotelName = parseVi(detailHotel.name) || "Khách sạn";

  return (
    <Box
      sx={{
        py: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        pt: 0,
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ArrowBackIos
          sx={{
            fontSize: 20,
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "#333" },
          }}
          onClick={() => setAction("manager")}
        />

        <Box>
          <Typography
            fontSize={22}
            fontWeight={700}
            color='#222'
            sx={{ lineHeight: 1.2 }}>
            {hotelName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
