import { CheckCircle, ContentCopy, Description, Edit, HighlightOff, MoreVert, PauseCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { parseRoomName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

type Props = {
  onNext: (action: string, roomId?: string) => void;
  detailHotel: any; // dữ liệu hotel từ props
};
const formatPrice = (price: number | null | undefined): string => {
  if (!price || price === 0) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};
const ManagerRooms = ({ onNext, detailHotel, setRoom }: Props) => {
 
  // Parse room_types từ props
  const roomTypes = React.useMemo(() => {
    if (!detailHotel || !Array.isArray(detailHotel.room_types)) {
      return [];
    }

    return detailHotel.room_types.map((room: any) => ({
      ...room,
      parsedName: parseRoomName(room.name) || "Không có tên",
      price_hourly_formatted: formatPrice(room.price_hourly),
      price_overnight_formatted: formatPrice(room.price_overnight),
      price_daily_formatted: formatPrice(room.price_daily),
    }));
  }, [detailHotel]);

  const handleRoomClick = (room) => {
    setRoom(room);
    onNext("detail");
  };

  const totalRooms = roomTypes.length;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #eee",
          padding: 3,
        }}>
        {/* Thống kê */}
        <Typography variant="h6" fontWeight={500} my={2}>Danh sách loại phòng</Typography>
       

        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                {[
                  "Tên loại phòng",
                  "Trang thái",
                  "SL phòng bán",
                  "Giá theo giờ",
                  "Giá qua đêm",
                  "Giá qua ngày",
                  "",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roomTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='#999'>Chưa có loại phòng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roomTypes.map((room: any) => (
                  <TableRow key={room.id} hover>
                    {/* Tên loại phòng */}
                    <TableCell
                      onClick={() => handleRoomClick(room)}
                      sx={{
                        fontWeight: 500,
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#98B720",
                        },
                      }}>
                      {room.parsedName}
                    </TableCell>

                    {/* Trang thái */}
                    <TableCell>
                      <Chip
                        label='Đang hoạt động'
                        size='small'
                        color='success'
                        variant='outlined'
                      />
                    </TableCell>

                    {/* SL phòng bán - chưa có dữ liệu thực tế */}
                    <TableCell>-</TableCell>

                    {/* Giá theo giờ */}
                    <TableCell>{room.price_hourly_formatted}</TableCell>

                    {/* Giá qua đêm */}
                    <TableCell>{room.price_overnight_formatted}</TableCell>

                    {/* Giá qua ngày */}
                    <TableCell>{room.price_daily_formatted}</TableCell>

                    {/* Thao tác */}
                    <TableCell align='right'>
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ManagerRooms;

function ActionMenu({ setAction, setDeleteDialogOpen, setIdHotel, hotel }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        endIcon={<MoreVert />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": { borderColor: "#bbb" },
        }}>
        Thao tác
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            mt: 1,
            padding: 0
          },
        }}
      >
        {/* Chi tiết */}
        <MenuItem

          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }} // Màu xám đậm nhẹ
        >
          <Description fontSize="small" />
          Chi tiết
        </MenuItem>

        {/* Phê duyệt khách sạn */}
        <MenuItem

          sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }} // Màu xanh lá đậm (success)
        >
          <CheckCircle fontSize="small" />
          Phê duyệt loại phòng
        </MenuItem>

        {/* Từ chối khách sạn */}
        <MenuItem

          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }} // Màu đỏ (error)
        >
          <HighlightOff fontSize="small" />
          Từ chối loại phòng
        </MenuItem>

        {/* Hủy đặt phòng - giữ nguyên như code cũ của bạn */}

      </Menu>
    </>
  );
}
