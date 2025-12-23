import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Popover,
  List,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CircleNotifications } from "@mui/icons-material";

// Helper: parse tên khách sạn từ JSON đa ngôn ngữ
const parseHotelName = (nameStr: string): string => {
  try {
    const parsed = JSON.parse(nameStr);
    return parsed.vi || parsed.en || nameStr || "";
  } catch {
    return nameStr || "";
  }
};

interface Hotel {
  id: string;
  name: string;
}

interface HotelSelectProps {
  value?: string | null;
  onChange?: (hotelId: string | null) => void;
  hotelsData: Hotel[];
}

export default function HotelSelect({
  value = null,
  onChange,
  hotelsData,
}: HotelSelectProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading,setLoading] = useState(false)
  const [selectedHotel,setSelectedHotel] = useState({})
  useEffect(() => {
    setLoading(true);
  
    const timer = setTimeout(() => {
      const foundHotel = hotelsData.find((h) => h.id === value);
      setSelectedHotel(foundHotel || {});
      setLoading(false); // Chỉ tắt loading sau khi "xử lý xong"
    }, 500);
  
    return () => clearTimeout(timer); // Cleanup nếu component unmount
  }, [hotelsData, value]);
  



  const open = Boolean(anchorEl);

  return (
    <>
      {/* TEXT + ICON */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {loading?<CircularProgress size={16} sx={{color:"#98b720"}} />:
        <Typography >
          
           {  parseHotelName(selectedHotel?.name)}
           
        </Typography>}

        <KeyboardArrowDownIcon fontSize="small" />
      </Box>

      {/* POPOVER */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List sx={{ minWidth: 220, maxHeight: 300, overflow: "auto" }}>
          {hotelsData.map((hotel) => (
            <ListItemButton
              key={hotel.id}
              selected={hotel.id === value}
              onClick={() => {
                localStorage.setItem("hotel_id",hotel.id)
                onChange?.(hotel.id);
                setAnchorEl(null);
              }}
            >
              {parseHotelName(hotel.name)}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
