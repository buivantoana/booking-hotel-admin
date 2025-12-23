import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Pagination,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CalendarToday,
  CalendarTodayOutlined,
  ContentCopy,
  PauseCircle,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import edit from "../../images/brush-square.png"

const statusStyles: Record<string, any> = {
  "Chờ nhận phòng": {
    color: "#2979FF",          // xanh dương
    backgroundColor: "#EAF2FF",
  },
  "Đã nhận phòng": {
    color: "#8B5CF6",          // tím
    backgroundColor: "#F3E8FF",
  },
  "Hủy phòng": {
    color: "#EF4444",          // đỏ
    backgroundColor: "#FEE2E2",
  },
  "Không nhận phòng": {
    color: "#EF4444",          // đỏ
    backgroundColor: "#FEE2E2",
  },
  "Chờ khách xác nhận": {
    color: "#F97316",          // cam
    backgroundColor: "#FFEDD5",
  },
  "Chờ xử lý": {
    color: "#F97316",          // cam
    backgroundColor: "#FFEDD5",
  },
  "Hoàn thành": {
    color: "#22C55E",          // xanh lá
    backgroundColor: "#DCFCE7",
  },
};



export default function ManagerBookingView({
  hotels,
  idHotel,
  setIdHotel,
  bookings,           // ← Thêm
  pagination,         // ← Thêm
  loading,            // ← Thêm
  onPageChange,       // ← Thêm
  fetchBookings,
  dateRange,
  setDateRange
}: {
  hotels: any[];
  idHotel: string | null;
  setIdHotel: (id: string) => void;
  bookings: any[];
  pagination: { page: number; total_pages: number; total: number };
  loading: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [openNote, setOpenNote] = useState(false);
  const [idBooking, setIdBooking] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [openAccepp, setOpenAccepp] = useState(false);

  const [openCheckin, setOpenCheckin] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Handler click row
  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{  p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Typography variant='h5' fontWeight='bold' mb={1}>
          Quản lý đặt phòng
        </Typography>

        {/* Hotel Selector */}
        <FormControl fullWidth sx={{ mb: 3, ml: .2, maxWidth: 300 }}>

          <HotelSelect
            value={idHotel}
            hotelsData={hotels}
            onChange={(id) => {
              setIdHotel(id);
              console.log("ID khách sạn được chọn:", id);
            }}
          />
        </FormControl>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={4}>
            {/* Label căn chuẩn */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              mb={4}
              spacing={2}
              alignItems='end'>
              {/* Tìm kiếm */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Tìm kiếm</Typography>
                <TextField
                  placeholder="Tìm mã đặt phòng"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 280,
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",

                      backgroundColor: "#fff",
                      "& fieldset": {
                        borderColor: "#cddc39", // Border mặc định
                        borderWidth: "1px",     // Tăng độ dày nếu muốn nổi bật hơn
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
              </Box>
              <Box>
                <Typography sx={{ mb: 1.5 }}>Loại đặt phòng</Typography>
                <Select
                  displayEmpty
                  defaultValue=""
                 
                  sx={{
                    width: 200,
                    height: 40,
                    borderRadius: "24px",
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Màu đỏ mặc định (có thể dùng #f44336, #d32f2f...)
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Hover: đỏ đậm hơn
                      borderWidth: "1px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39 !important", // QUAN TRỌNG: Focus vẫn màu đỏ rực
                      borderWidth: "1px !important",
                     
                    },
                    // Tùy chọn: đổi màu mũi tên dropdown cho đồng bộ
                    "& .MuiSelect-icon": {
                      color: "#cddc39",
                    },
                    // Nếu có label, giữ màu khi focus
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#cddc39",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Chọn loại đặt phòng
                  </MenuItem>
                  <MenuItem value="theogio">Theo giờ</MenuItem>
                  <MenuItem value="quadem">Qua đêm</MenuItem>
                  <MenuItem value="quangay">Qua ngày</MenuItem> {/* Nếu cần thêm */}
                </Select>
              </Box>

              {/* 2 ô DatePicker – ĐÃ FIX LỖI 100% */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Thời gian nhận phòng</Typography>
               <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
              </Box>

              {/* Nút */}
              <Stack direction='row' alignItems={"end"} spacing={1}>
                <Button
                  variant='contained'
                  sx={{
                    borderRadius: "24px",
                    bgcolor: "#98b720",
                    height: 40,
                    minWidth: 120,
                  }}>
                  Tìm kiếm
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: "24px",
                    height: 40,
                    minWidth: 120,
                    border: "1px solid rgba(208, 211, 217, 1)",
                    background: "rgba(240, 241, 243, 1)",
                    color: "rgba(208, 211, 217, 1)",
                  }}>
                  Xóa tìm kiếm
                </Button>
              </Stack>
            </Stack>

            {/* Chip */}
            <Stack direction='row' flexWrap='wrap' gap={1.5} mt={3}>
              {[
                { label: "Tất cả", count: 5, active: true },
                { label: "Chờ nhận phòng", count: 2 },
                { label: "Đã nhận phòng", count: 2 },
                { label: "Chờ Hotel Booking xử lý", count: 1 },
                { label: "Đã hủy", count: 1 },
                { label: "Không nhận phòng", count: 1 },
                { label: "Hoàn thành", count: 1 },
                { label: "Chờ khách xác nhận", count: 1 },
              ].map((item) => (
                <Chip
                  key={item.label}
                  label={`${item.label} ${item.count}`}
                  sx={{
                    borderRadius: "18px",
                    height: 36,
                    bgcolor: item.active ? "#98b720" : "transparent",
                    color: item.active ? "white" : "#666",
                    border: item.active ? "none" : "1px solid #e0e0e0",
                    fontWeight: item.active ? "bold" : "normal",
                  }}
                />
              ))}
            </Stack>
          </Stack>
          <TableContainer sx={{ mt: 5, width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Mã đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tổng số tiền thanh toán</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Loại đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thời gian</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tình trạng đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ghi chú</strong>
                  </TableCell>
                  <TableCell align='center'>
                    <strong>Thao tác</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography>Không có dữ liệu đặt phòng</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((row) => {
                    // Format ngày giờ
                    const formatDateTime = (dateString: string) => {
                      return dayjs(dateString).format("DD/MM/YYYY, HH:mm");
                    };

                    const rentTypeLabel =
                      row.rent_type === "hourly"
                        ? "Theo giờ"
                        : row.rent_type === "daily"
                          ? "Qua ngày"
                          : row.rent_type === "overnight"
                            ? "Qua đêm"
                            : "Không xác định";

                    const statusLabel = {
                      pending: "Chờ nhận phòng",
                      confirmed: "Chờ khách xác nhận",
                      checked_in: "Đã nhận phòng",
                      checked_out: "Hoàn thành",
                      cancelled: "Hủy phòng",
                      no_show: "Không nhận phòng",
                    }[row.status] || "Chờ xử lý";

                    const roomName = row.room_types?.[0]?.name || "N/A";

                    return (
                      <TableRow 
                      onClick={() => handleRowClick(row)} key={row.id} hover>
                        <TableCell
                          sx={{
                            fontWeight: row.code.includes("(G)") ? "bold" : "normal",
                            color: row.code.includes("(G)") ? "#1976d2" : "#98B720",
                          }}>
                          {row.code}
                        </TableCell>
                        <TableCell>
                          <div>{row.total_price.toLocaleString()}đ</div>
                          <div style={{ fontSize: "0.875rem", color:row.status !== "cancelled"? "#20B720":"#666" }}>
                            {row.status === "cancelled" ? "Đã hoàn tiền" : "Đã thanh toán"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rentTypeLabel}
                          <br />
                          <span style={{ color: "#98B720", fontSize: "0.875rem" }}>
                            {roomName}
                          </span>
                        </TableCell>
                        <TableCell>{formatDateTime(row.created_at)}<br/>{formatDateTime(row.check_in)}</TableCell>
                       
                        <TableCell>
                          <Chip
                            label={statusLabel}
                           
                            size="small"
                            sx={{ minWidth: 110,...statusStyles[statusLabel] }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.note || "Không có ghi chú"}>
                            <IconButton size="small">
                              <img src={edit} onClick={(e) => {
                                e.stopPropagation();
                                setIdBooking(row)
                                setOpenNote(true)
                              }} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <ActionMenu
                            booking={row}
                            setIdBooking={setIdBooking}
                            setOpenCheckOut={setOpenAccepp}
                            setOpenCancel={setOpenCancel}
                            setOpenCheckIn={setOpenCheckin}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              key={pagination.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
              count={pagination.total_pages}
              page={pagination.page}
              onChange={onPageChange}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              size={isMobile ? "medium" : "large"}
              sx={{
                // Tùy chỉnh trang active
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#98b720 !important", // Màu xanh lá bạn đang dùng trong app
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(139,195,74,0.4)",
                  "&:hover": {
                    backgroundColor: "#7cb342 !important",
                  },
                },
                // Tùy chỉnh các trang thường (nếu muốn)
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                  margin: "0 4px",
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                  },
                },
                // Tùy chỉnh nút ellipsis (...) nếu cần
                "& .MuiPaginationItem-ellipsis": {
                  color: "#666",
                },
              }}

            />

          </Stack>
        </Paper>

        {/* Table */}

        {/* Pagination */}

      </Box>
      <NoteModal openNote={openNote} fetchBookings={fetchBookings} idHotel={idHotel} booking={idBooking} onClose={() => setOpenNote(false)} />
      <CancelBookingModal
        openCancel={openCancel}
        onClose={() => setOpenCancel(false)}
        booking={idBooking}
        fetchBookings={fetchBookings} idHotel={idHotel}
      />
      <CheckoutConfirmModal
        openAccepp={openAccepp}
        onClose={() => setOpenAccepp(false)}
        booking={idBooking}
        fetchBookings={fetchBookings} idHotel={idHotel}
      />
      <CheckinConfirmModal
        openCheckin={openCheckin}
        onClose={() => setOpenCheckin(false)}
        booking={idBooking}
        fetchBookings={fetchBookings} idHotel={idHotel}
      />
      <BookingDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        booking={selectedBooking}
      />
    </LocalizationProvider>
  );
}

function BookingDetailModal({ open, onClose, booking }) {
  if (!booking) return null;

  const formatDateTime = (dateString) => {
    return dayjs(dateString).format("HH:mm, DD/MM/YYYY");
  };

  const rentTypeLabel = getRentTypeLabel(booking.rent_type); // dùng hàm đã có
  const statusLabel = {
    pending: "Chờ nhận phòng",
    confirmed: "Chờ khách xác nhận",
    checked_in: "Đã nhận phòng",
    checked_out: "Hoàn thành",
    cancelled: "Hủy phòng",
    no_show: "Không nhận phòng",
  }[booking.status] || "Chờ xử lý";
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Chi tiết mã đặt phòng
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent >
        <Stack spacing={3}>
          {/* Thông tin đặt phòng */}
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Thông tin đặt phòng
            </Typography>
            <Chip
                            label={statusLabel}
                           
                            size="small"
                            sx={{ minWidth: 110,...statusStyles[statusLabel] }}
                          />
            </Box>

            

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Thời gian đặt phòng:</Typography>
              <Typography fontWeight="medium">
                {formatDateTime(booking.created_at)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Tên người đặt:</Typography>
              <Typography fontWeight="medium">{booking.customer_name || "Nguyễn Văn A"}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Số điện thoại:</Typography>
              <Typography fontWeight="medium">{booking.customer_phone || "0123456789"}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Loại đặt phòng:</Typography>
              <Typography fontWeight="medium">{rentTypeLabel}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Loại phòng:</Typography>
              <Typography fontWeight="medium">
                {booking.room_types?.[0]?.name || "Vip123"}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Thời gian lưu trú:</Typography>
              <Typography fontWeight="medium">
                {formatDateTime(booking.check_in)} - {formatDateTime(booking.check_out)}
              </Typography>
            </Stack>
          </Stack>

        
          
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function NoteModal({ openNote, onClose, booking, fetchBookings, idHotel }) {
  const [note, setNote] = useState("");

  // Khi modal mở và có booking, điền sẵn ghi chú hiện tại (nếu có)
  useEffect(() => {
    if (openNote && booking?.note) {
      setNote(booking.note || "");
    } else if (openNote) {
      setNote(""); // Reset nếu không có note
    }
  }, [openNote, booking]);

  if (!booking) {
    return null; // Tránh render khi chưa có booking
  }

  // Format thời gian
  const formatDateTime = (dateString) => {
    return dayjs(dateString).format("HH:mm, DD/MM/YYYY");
  };

  // Map loại đặt phòng
  const rentTypeLabel =
    booking.rent_type === "hourly"
      ? "Theo giờ"
      : booking.rent_type === "daily"
        ? "Qua ngày"
        : booking.rent_type === "overnight"
          ? "Qua đêm"
          : "Không xác định";

  // Map trạng thái để hiển thị chip
  const statusLabel = {
    pending: "Chờ nhận phòng",
    confirmed: "Chờ khách xác nhận",
    checked_in: "Đã nhận phòng",
    checked_out: "Hoàn thành",
    cancelled: "Hủy phòng",
    no_show: "Không nhận phòng",
  }[booking.status] || "Chờ xử lý";

  const statusColor = {
    pending: { bg: "#e3f2fd", color: "#1976d2" },
    confirmed: { bg: "#fff3e0", color: "#ef6c00" },
    checked_in: { bg: "#e8f5e9", color: "#388e3c" },
    checked_out: { bg: "#e8f5e9", color: "#388e3c" },
    cancelled: { bg: "#ffebee", color: "#d32f2f" },
    no_show: { bg: "#ffebee", color: "#d32f2f" },
  }[booking.status] || { bg: "#f5f5f5", color: "#666" };

  const roomName = booking.room_types?.[0]?.name || "N/A";

  const handleNoteBooking = async () => {
    try {
      let result = await updateBooking(booking.id, { note: note })
      if (result?.booking_id) {
        toast.success(result?.message)
        fetchBookings(idHotel)
      } else {
        toast.success(result?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog
      open={openNote}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1, pt: 3, px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Ghi chú
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 4 }}>
        {/* Mã đặt phòng */}
        <Stack spacing={0.5} mb={3}>
          <Typography color="text.secondary" fontSize="0.875rem">
            Mã đặt phòng:
          </Typography>
          <Typography fontWeight="bold" fontSize="1.1rem">
            {booking.code}
          </Typography>
        </Stack>

        {/* Ô nhập ghi chú */}
        <Stack spacing={1} mb={3}>
          <Typography fontSize="0.875rem" color="text.secondary">
            Nhập nội dung (không bắt buộc)
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder="Nhập ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 1, mr: 1 }}>
                  <Typography variant="caption" color="text.disabled">
                    {note.length}/300
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "#f9f9f9",
                "& textarea": { resize: "none" },
              },
            }}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Thông tin đặt phòng */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight="bold" color="primary">
            Thông tin đặt phòng
          </Typography>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              bgcolor: statusColor.bg,
              color: statusColor.color,
              fontWeight: "medium",
              borderRadius: 2,
            }}
          />
        </Box>

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Loại đặt phòng:</Typography>
            <Typography fontWeight="medium">{rentTypeLabel}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Loại phòng:</Typography>
            <Typography fontWeight="medium">{roomName}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Thời gian:</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" sx={{ color: "#999" }} />
              <Typography fontWeight="medium">
                {formatDateTime(booking.check_in)} - {formatDateTime(booking.check_out)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Nút hành động */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={5}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: 8,
              px: 4,
              textTransform: "none",
              color: "#666",
              borderColor: "#ddd",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Gọi API lưu ghi chú ở đây
              handleNoteBooking()
              onClose();
            }}
            sx={{
              borderRadius: 8,
              px: 5,
              bgcolor: "#98b720",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}
          >
            Lưu ghi chú
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}


import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogoutIcon from "@mui/icons-material/Logout"; // Icon cho trả phòng

function ActionMenu({
  booking,
  setOpenCheckIn,     // Mở modal nhận phòng
  setOpenCheckOut,    // Mở modal trả phòng
  setOpenCancel,
  setIdBooking    // Mở modal hủy
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  if (!booking) return null;

  const status = booking.status;

  // Quyết định hiển thị những action nào
  const showCheckIn = status === "pending";                    // Chờ nhận phòng → cho nhận phòng
  const showCheckOut = status === "checked_in";                // Đã nhận phòng → cho trả phòng
  const showCancel = ["pending", "confirmed"].includes(status); // Chờ xử lý hoặc chờ xác nhận → cho hủy

  // Nếu không có action nào thì không hiển thị nút
  if (!showCheckIn && !showCheckOut && !showCancel) {
    return null; // hoặc return một Typography nhỏ "Không có thao tác"
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": { borderColor: "#bbb" },
        }}
      >
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
        {/* Khách nhận phòng - chỉ hiện khi pending */}
        {showCheckIn && (
          <MenuItem
            onClick={() => {
              setIdBooking(booking)
              setOpenCheckIn(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14 }}
          >
            <CheckCircleOutlineIcon fontSize="small" sx={{ color: "#388e3c" }} />
            Khách nhận phòng
          </MenuItem>
        )}

        {/* Khách trả phòng - chỉ hiện khi checked_in */}
        {showCheckOut && (
          <MenuItem
            onClick={() => {
              setIdBooking(booking)
              setOpenCheckOut(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14 }}
          >
            <LogoutIcon fontSize="small" sx={{ color: "#1976d2" }} />
            Khách trả phòng
          </MenuItem>
        )}

        {/* Hủy đặt phòng - chỉ hiện khi pending hoặc confirmed */}
        {showCancel && (
          <MenuItem
            onClick={() => {
              setIdBooking(booking)
              setOpenCancel(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}
          >
            <HighlightOffIcon fontSize="small" />
            Hủy đặt phòng
          </MenuItem>
        )}
      </Menu>
    </>
  );
}



import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import HotelSelect from "../../components/HotelSelect";
import { updateBooking } from "../../service/booking";
import { toast } from "react-toastify";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";

const formatTime = (dateString: string) => {
  return dayjs(dateString).format("HH:mm");
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format("DD/MM/YYYY");
};

// Map loại đặt phòng
const getRentTypeLabel = (rent_type: string) => {
  switch (rent_type) {
    case "hourly": return "Theo giờ";
    case "daily": return "Qua ngày";
    case "overnight": return "Qua đêm";
    default: return "Không xác định";
  }
};

// ===================================================================
// 1. Modal HỦY ĐẶT PHÒNG
// ===================================================================
function CancelBookingModal({ openCancel, onClose, booking, fetchBookings, idHotel }) {
  const [reason, setReason] = useState("");

  const reasons = [
    "Khách sạn hết phòng",
    "Khách sạn sửa chữa/ tạm thời đóng cửa",
    "Khách sạn muốn dừng hợp tác",
    "Lý do bất khả kháng: Thiên tai/ mất điện / mất nước",
    "Hư hỏng thiết bị, Cơ sở vật chất",
    "Khách sạn đặt sai giá phòng",
    "Khách có dấu hiệu vi phạm pháp luật",
  ];

  if (!booking) return null;

  const roomName = booking.room_types?.[0]?.name || "N/A";
  const rentType = getRentTypeLabel(booking.rent_type);

  const handleCancelBooking = async () => {
    try {
      let result = await updateBooking(booking.id, { reason: reason, status: "cancelled" })
      if (result?.booking_id) {
        toast.success(result?.message)
        fetchBookings(idHotel)
      } else {
        toast.success(result?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={openCancel} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Hủy đặt phòng
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Thông tin đặt phòng */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f9ffe6",
            border: "1px solid #d0e8a0",
            borderRadius: 3,
            p: 2,
            mb: 3,
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize="0.95rem">Loại phòng:</Typography>
              <Typography fontWeight="bold" color="#7cb342">
                {roomName}
              </Typography>
            </Stack>
            <Divider sx={{ bgcolor: "#d0e8a0" }} />
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "#999" }} />
                <Typography fontSize="0.95rem">{rentType}</Typography>
              </Stack>
              <Typography fontWeight="medium">
                {formatTime(booking.check_in)} - {formatTime(booking.check_out)} ngày {formatDate(booking.check_in)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Chọn lý do hủy */}
        <Typography fontWeight="medium" mb={2}>
          Chọn lý do hủy phòng{" "}
          <span style={{ color: "#ef6c00" }}>(bắt buộc)</span>
        </Typography>

        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          <Stack spacing={1.5}>
            {reasons.map((item) => (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio size="small" sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }} />}
                label={<Typography fontSize="0.95rem" sx={{ ml: 0.5 }}>{item}</Typography>}
                sx={{
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.8,
                  border: "1px solid #eee",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              />
            ))}
          </Stack>
        </RadioGroup>

        {/* Nút */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={5}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 8, px: 4, textTransform: "none", color: "#666", borderColor: "#ddd" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            disabled={!reason}
            onClick={() => {
              // TODO: Gọi API hủy booking với reason
              handleCancelBooking()
              onClose();
            }}
            sx={{
              borderRadius: 8,
              px: 5,
              minWidth: 140,
              bgcolor: "#98b720",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              "&:disabled": { bgcolor: "#c8e6c9" },
              textTransform: "none",
            }}
          >
            Hủy đặt phòng
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ===================================================================
// 2. Modal XÁC NHẬN KHÁCH TRẢ PHÒNG
// ===================================================================
function CheckoutConfirmModal({ openAccepp, onClose, booking, fetchBookings, idHotel }) {
  if (!booking) return null;

  const roomName = booking.room_types?.[0]?.name || "N/A";
  const rentType = getRentTypeLabel(booking.rent_type);
  const handleCheckoutBooking = async () => {
    try {
      let result = await updateBooking(booking.id, { status: "checked_out" })
      if (result?.booking_id) {
        toast.success(result?.message)
        fetchBookings(idHotel)
      } else {
        toast.success(result?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog open={openAccepp} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Xác nhận Khách trả phòng
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 4 }}>
        <Stack spacing={2} mb={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" fontSize="0.95rem">Khách sạn:</Typography>
            <Typography fontWeight="bold">{booking.hotel_name || "Khách sạn XYZ"}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" fontSize="0.95rem">Mã đặt phòng:</Typography>
            <Typography fontWeight="bold" fontSize="1.1rem">{booking.code}</Typography>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f9ffe6",
            border: "1px solid #d0e8a0",
            borderRadius: 3,
            p: 2.5,
            mb: 4,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize="0.95rem">Loại phòng:</Typography>
              <Typography fontWeight="bold" color="#7cb342">{roomName}</Typography>
            </Stack>
            <Divider sx={{ bgcolor: "#d0e8a0" }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CheckCircleOutlineIcon sx={{ color: "#98b720", fontSize: 20 }} />
                <Typography fontWeight="medium">{rentType}</Typography>
              </Stack>
              <Typography fontWeight="medium" textAlign="right">
                {formatTime(booking.check_in)} - {formatTime(booking.check_out)} ngày {formatDate(booking.check_in)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 8, px: 4, minWidth: 120, textTransform: "none", color: "#666", borderColor: "#ddd" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => {
              // TODO: Gọi API xác nhận trả phòng
              console.log("Xác nhận trả phòng cho booking:", booking.id);
              handleCheckoutBooking()
              onClose();
            }}
            sx={{
              borderRadius: 8,
              px: 5,
              minWidth: 180,
              bgcolor: "#98b720",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}
          >
            Khách trả phòng
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ===================================================================
// 3. Modal XÁC NHẬN KHÁCH NHẬN PHÒNG
// ===================================================================
function CheckinConfirmModal({ openCheckin, onClose, booking, fetchBookings, idHotel }) {
  if (!booking) return null;

  const roomName = booking.room_types?.[0]?.name || "N/A";
  const rentType = getRentTypeLabel(booking.rent_type);
  const handleCheckinBooking = async () => {
    try {
      let result = await updateBooking(booking.id, { status: "checked_in" })
      if (result?.booking_id) {
        toast.success(result?.message)
        fetchBookings(idHotel)
      } else {
        toast.success(result?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog open={openCheckin} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Xác nhận khách đến nhận phòng
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 4 }}>
        <Stack spacing={2} mb={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" fontSize="0.95rem">Khách sạn:</Typography>
            <Typography fontWeight="bold">{booking.hotel_name || "Khách sạn XYZ"}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" fontSize="0.95rem">Mã đặt phòng:</Typography>
            <Typography fontWeight="bold" fontSize="1.1rem">{booking.code}</Typography>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f9ffe6",
            border: "1px solid #d0e8a0",
            borderRadius: 3,
            p: 2.5,
            mb: 4,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize="0.95rem">Loại phòng:</Typography>
              <Typography fontWeight="bold" color="#7cb342">{roomName}</Typography>
            </Stack>
            <Divider sx={{ bgcolor: "#d0e8a0" }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CheckCircleOutlineIcon sx={{ color: "#98b720", fontSize: 20 }} />
                <Typography fontWeight="medium">{rentType}</Typography>
              </Stack>
              <Typography fontWeight="medium" textAlign="right">
                {formatTime(booking.check_in)} - {formatTime(booking.check_out)} ngày {formatDate(booking.check_in)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 8, px: 4, minWidth: 120, textTransform: "none", color: "#666", borderColor: "#ddd" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => {
              // TODO: Gọi API xác nhận nhận phòng
              console.log("Xác nhận nhận phòng cho booking:", booking.id);
              handleCheckinBooking()
              onClose();
            }}
            sx={{
              borderRadius: 8,
              px: 5,
              minWidth: 180,
              bgcolor: "#98b720",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}
          >
            Nhận phòng
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}