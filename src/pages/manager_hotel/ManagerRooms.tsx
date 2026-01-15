import {
  CheckCircle,
  Close,
  ContentCopy,
  Description,
  Edit,
  HighlightOff,
  MoreVert,
  PauseCircle,
  PlayCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { parseRoomName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateRoomStatus } from "../../service/hotel";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
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
const ManagerRooms = ({
  onNext,
  detailHotel,
  setRoom,
  room,
  getHotelDetail,
  handleStatusHotel,
  setCancelDialogOpenRoom,
  setApproveDialogOpenRoom,
}: Props) => {
  const [reason, setReason] = useState("");
 
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

  const renderStatusChip = (status) => {
    const map = {
      active: {
        label: "Đang hoạt động",
        sx: { bgcolor: "#98B720", color: "white" },
      },
      paused: {
        label: "Tạm dừng",
        sx: { bgcolor: "#FFB020", color: "white" },
      },
      pending: {
        label: "Chờ duyệt",
        sx: { bgcolor: "#1976D2", color: "white" },
      },
      terminated: {
        label: "Đã chấm dứt",
        sx: { bgcolor: "#D32F2F", color: "white" },
      },
      rejected: {
        label: "Bị từ chối ",
        sx: { bgcolor: "#a5a5a5", color: "white" },
      },
    };

    const config = map[status];

    return (
      <Chip
        label={config?.label || "Không xác định"}
        size='small'
        sx={config?.sx || { bgcolor: "#9E9E9E", color: "white" }}
      />
    );
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop: Bảng gốc (giữ nguyên 100%)
  const renderDesktop = () => (
    <TableContainer sx={{ overflowX: "auto", mt: 4 }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8f9fa" }}>
            {[
              "Tên loại phòng",
              "Trạng thái",
              "SL phòng bán",
              "Giá theo giờ",
              "Giá qua đêm",
              "Giá qua ngày",
              "",
            ].map((head) => (
              <TableCell
                key={head}
                sx={{
                  fontWeight: 600,
                  color: "#555",
                  fontSize: 14,
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {roomTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography color="#999">Chưa có loại phòng nào</Typography>
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
                  }}
                >
                  {room.parsedName}
                </TableCell>

                {/* Trạng thái */}
                <TableCell>{renderStatusChip(room?.status)}</TableCell>

                {/* SL phòng bán */}
                <TableCell>{room?.number}</TableCell>

                {/* Giá theo giờ */}
                <TableCell>{room.price_hourly_formatted}</TableCell>

                {/* Giá qua đêm */}
                <TableCell>{room.price_overnight_formatted}</TableCell>

                {/* Giá qua ngày */}
                <TableCell>{room.price_daily_formatted}</TableCell>

                {/* Thao tác */}
                <TableCell align="right">
                  {["pending", "active", "terminated"].includes(room.status) && (
                    <ActionMenu
                      hotel={room}
                      setIdHotel={setRoom}
                      setApproveDialogOpen={setApproveDialogOpenRoom}
                      setCancelDialogOpen={setCancelDialogOpenRoom}
                      setAction={onNext}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile: Card dọc
  const renderMobile = () => (
    <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      {roomTypes.length === 0 ? (
        <Typography align="center" color="#999" py={6}>
          Chưa có loại phòng nào
        </Typography>
      ) : (
        roomTypes.map((room: any, index) => (
          <Paper
            key={room.id}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #eee",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => handleRoomClick(room)}
          >
            {/* Header card */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#f8f9fa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  #{index + 1}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {room.parsedName}
                </Typography>
              </Stack>

              {renderStatusChip(room?.status)}
            </Box>

            <Divider />

            {/* Nội dung chính */}
            <Box sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      SL phòng bán
                    </Typography>
                    <Typography fontWeight="600">{room?.number}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Giá theo giờ
                    </Typography>
                    <Typography>{room.price_hourly_formatted}</Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Giá qua đêm
                    </Typography>
                    <Typography>{room.price_overnight_formatted}</Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Giá qua ngày
                  </Typography>
                  <Typography fontWeight="500">
                    {room.price_daily_formatted}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Thao tác */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#fafafa",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {["pending", "active", "terminated"].includes(room.status) && (
                <ActionMenu
                  hotel={room}
                  setIdHotel={setRoom}
                  setApproveDialogOpen={setApproveDialogOpenRoom}
                  setCancelDialogOpen={setCancelDialogOpenRoom}
                  setAction={onNext}
                />
              )}
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
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
        <Typography variant='h6' fontWeight={500} my={2}>
          Danh sách loại phòng
        </Typography>

        {isMobile ? renderMobile() : renderDesktop()}
      </Paper>
    
    </>
  );
};

export default ManagerRooms;

function ActionMenu({
  setApproveDialogOpen,
  setIdHotel,
  hotel,
  setCancelDialogOpen,
  setAction,
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { status } = hotel;
  const handleTogglePause = () => {
    setIdHotel(hotel);
    if(hotel?.status != "pending"){
      if (hotel?.status == "terminated") {
        setApproveDialogOpen(true);
      } else {
        setCancelDialogOpen(true);
      }
    }else{
      if (hotel?.status == "pending") {
        setApproveDialogOpen(true);
      } 
    }
    handleClose();
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
            padding: 0,
          },
        }}>
        {/* Chi tiết */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel);

            setAction("detail");
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }} // Màu xám đậm nhẹ
        >
          <Description fontSize='small' />
          Chi tiết
        </MenuItem>

        {status !== "pending"&&status!="rejected"  ? (
          <>
            {status === "active" || status === "paused" ? (
              <MenuItem
                onClick={handleTogglePause}
                sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
                <PauseCircle fontSize='small' />
                Ngừng kinh doanh
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleTogglePause}
                sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }}>
                <PlayCircle fontSize='small' />
                Mở lại kinh doanh
              </MenuItem>
            )}
          </>
        ):<>{status!="rejected"&&<>
         <MenuItem
        onClick={() => {
          handleTogglePause()
        }}
        sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }} // Màu xanh lá đậm (success)
      >
        <CheckCircle fontSize='small' />
        Phê duyệt phòng
      </MenuItem>

      {/* Từ chối khách sạn */}
      <MenuItem
        onClick={() => {
          setCancelDialogOpen(true)
        }}
        sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }} // Màu đỏ (error)
      >
        <HighlightOff fontSize='small' />
        Từ chối phòng
      </MenuItem>
        </>}</>}
        {/* Hủy đặt phòng - giữ nguyên như code cũ của bạn */}
      </Menu>
    </>
  );
}
