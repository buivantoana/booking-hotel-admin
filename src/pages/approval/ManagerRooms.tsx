import {
  CheckCircle,
  Close,
  ContentCopy,
  Description,
  Edit,
  HighlightOff,
  MoreVert,
  PauseCircle,
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
  getHotelDetail,
  room,
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  // Parse room_types từ props
  const roomTypes = React.useMemo(() => {
    if (!detailHotel || !Array.isArray(detailHotel.room_types)) {
      return [];
    }

    return detailHotel.room_types
      .filter((item) => item.status == "pending")
      .map((room: any) => ({
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
        sx: { bgcolor: "#FEF7F2", color: "#EA6A00" },
      },
      terminated: {
        label: "Đã kết thúc",
        sx: { bgcolor: "#D32F2F", color: "white" },
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
  const handleStatusHotel = async (status) => {
    try {
      let result;
      if (status == "reject") {
        result = await updateRoomStatus(room.id, {
          action: "reject",
          reason,
        });

        setCancelDialogOpen(false);
      }
      if (status == "approve") {
        result = await updateRoomStatus(room.id, {
          action: "approve",
        });

        setDeleteDialogOpen(false);
      }
      if (result?.message && !result?.code) {
        setReason("");
        toast.success(status == "approve"?"Phê duyệt loại phòng thành công":"Từ chối loại phòng thành công");
        getHotelDetail();
      } else {
        toast.error(result?.message);
      }
      console.log("AAA result", result);
    } catch (error) {
      console.log(error);
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop: Bảng gốc (giữ nguyên)
  const renderDesktop = () => (
    <TableContainer sx={{ overflowX: "auto", mt: 4 }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8f9fa" }}>
            {[
              "Tên loại phòng",
              "Trạng thái",
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
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
                <TableCell>{renderStatusChip(room.status)}</TableCell>

                {/* Giá theo giờ */}
                <TableCell>{room.price_hourly_formatted}</TableCell>

                {/* Giá qua đêm */}
                <TableCell>{room.price_overnight_formatted}</TableCell>

                {/* Giá qua ngày */}
                <TableCell>{room.price_daily_formatted}</TableCell>

                {/* Thao tác */}
                <TableCell align="right">
                  <ActionMenu
                    hotel={room}
                    handleRoomClick={handleRoomClick}
                    setIdHotel={setRoom}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    setCancelDialogOpen={setCancelDialogOpen}
                  />
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
        roomTypes.map((room: any) => (
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
              onClick={() => handleRoomClick(room)}
            >
              <Typography variant="subtitle1" fontWeight="600">
                {room.parsedName}
              </Typography>

              {renderStatusChip(room.status)}
            </Box>

            <Divider />

            {/* Nội dung chính - Các mức giá */}
            <Box sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Giá theo giờ
                    </Typography>
                    <Typography fontWeight="500">
                      {room.price_hourly_formatted}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Giá qua đêm
                    </Typography>
                    <Typography fontWeight="500">
                      {room.price_overnight_formatted}
                    </Typography>
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
              <ActionMenu
                hotel={room}
                setIdHotel={setRoom}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setCancelDialogOpen={setCancelDialogOpen}
              />
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#ffebee",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}>
              <img src={success} alt='' />
            </Box>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Xác nhận phê duyệt loại phòng
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Hãy đảm bảo đầy đủ thông tin, giá và tình trạng sẵn sàng trước khi
            duyệt phòng để tránh sai sót trong quá trình đặt phòng.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 4,
            gap: 2,
            flexDirection: "column",
          }}>
          <Button
            onClick={async () => {
              handleStatusHotel("approve");
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Phê duyệt
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant='outlined'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              borderColor: "#ddd",
              color: "#666",
              width: "100%",
            }}>
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "left", p: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Typography fontWeight={600} fontSize='20px' mb={1}>
              Từ chối phòng
            </Typography>
            <IconButton
              onClick={() => setCancelDialogOpen(false)}
              sx={{ position: "absolute", top: -5, right: 0 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, padding: 1 }}>
          <Typography fontSize='14px' color='#666'>
            Từ chối kinh doanh khách sạn. Bạn có thể mở kinh doanh lại trong
            tương lai.
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder='Nhập nội dung từ chối loại phòng...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant='outlined'
            fullWidth
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,

                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#cddc39", // Border mặc định
                  borderWidth: "1px", // Tăng độ dày nếu muốn nổi bật hơn
                },
                "&:hover fieldset": {
                  borderColor: "#c0ca33", // Hover: đậm hơn một chút (tùy chọn)
                  borderWidth: "1px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#cddc39 !important", // QUAN TRỌNG: Khi focus vẫn giữ màu này
                  borderWidth: "1px",
                  boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)", // Hiệu ứng glow nhẹ (tùy chọn)
                },
                // Tắt màu legend primary khi focus (nếu có label)
                "&.Mui-focused .MuiInputLabel-root": {
                  color: "#666",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 4,
            gap: 2,
            flexDirection: "column",
          }}>
          <Button
            disabled={!reason}
            onClick={async () => {
              handleStatusHotel("reject");
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Xác nhận từ chối kinh doanh
          </Button>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            variant='outlined'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              borderColor: "#ddd",
              color: "#666",
              width: "100%",
            }}>
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManagerRooms;

function ActionMenu({
  setDeleteDialogOpen,
  setIdHotel,
  hotel,
  setCancelDialogOpen,
  setAction,
  handleRoomClick
}) {
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
            padding: 0,
          },
        }}>
        {/* Chi tiết */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel);

            handleRoomClick(hotel);
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }} // Màu xám đậm nhẹ
        >
          <Description fontSize='small' />
          Chi tiết
        </MenuItem>

        {/* Phê duyệt khách sạn */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel);
            setDeleteDialogOpen(true);
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }} // Màu xanh lá đậm (success)
        >
          <CheckCircle fontSize='small' />
          Phê duyệt phòng
        </MenuItem>

        {/* Từ chối khách sạn */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel);
            setCancelDialogOpen(true);
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }} // Màu đỏ (error)
        >
          <HighlightOff fontSize='small' />
          Từ chối phòng
        </MenuItem>

        {/* Hủy đặt phòng - giữ nguyên như code cũ của bạn */}
      </Menu>
    </>
  );
}
