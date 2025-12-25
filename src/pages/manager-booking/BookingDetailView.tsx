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
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CalendarToday,
  CalendarTodayOutlined,
  ContentCopy,
  PauseCircle,
  Close,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import edit from "../../images/brush-square.png";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";
const getRentTypeLabel = (rent_type: string) => {
  switch (rent_type) {
    case "hourly":
      return "Theo giờ";
    case "daily":
      return "Qua ngày";
    case "overnight":
      return "Qua đêm";
    default:
      return "Không xác định";
  }
};

const statusStyles: Record<string, any> = {
  "Chờ khách xác nhận": {
    color: "#F97316", // cam (giữ nguyên như cũ cho "Chờ khách xác nhận" / "Chờ xử lý")
    backgroundColor: "#FFEDD5",
  },
  "Chờ nhận phòng": {
    color: "#2979FF", // xanh dương (giữ nguyên như cũ cho "Chờ nhận phòng")
    backgroundColor: "#EAF2FF",
  },
  "Đã nhận phòng": {
    color: "#8B5CF6", // tím (giữ nguyên như cũ)
    backgroundColor: "#F3E8FF",
  },
  "Đã trả phòng": {
    color: "#22C55E", // xanh lá (giữ nguyên như cũ cho "Hoàn thành")
    backgroundColor: "#DCFCE7",
  },
  "Đã huỷ": {
    color: "#EF4444", // đỏ (giữ nguyên như cũ cho "Hủy phòng")
    backgroundColor: "#FEE2E2",
  },
  "Không nhận phòng": {
    color: "#EF4444", // đỏ (giữ nguyên như cũ cho "Không nhận phòng")
    backgroundColor: "#FEE2E2",
  },
};
const paymentStatusStyles: Record<string, any> = {
  "Thanh toán tại khách sạn": {
    color: "#F97316", // cam
  },
  "Đã thanh toán": {
    color: "#22C55E", // xanh lá
  },
  "Đã hoàn tiền": {
    color: "#EF4444", // đỏ
  },
  "Thanh toán không thành công": {
    color: "#EF4444", // đỏ
  },
  "Đã huỷ": {
    color: "#666666", // xám
  },
};

const getPaymentLabel = (booking: any): string => {
  const payment = booking?.payment;
  if (!payment) return "Chưa có thông tin";

  const method = (payment.method || "").toString().trim().toLowerCase();

  if (method === "cash") {
    return "Thanh toán tại khách sạn";
  }

  // method !== cash → dựa vào status
  const status = (payment.status || "").toString().trim().toLowerCase();
  switch (status) {
    case "paid":
      return "Đã thanh toán";
    case "refunded":
      return "Đã hoàn tiền";
    case "failed":
      return "Thanh toán không thành công";
    case "cancelled":
      return "Đã huỷ";
    default:
      return "Chưa xác định";
  }
};
const STATUS_API_TO_LABEL: Record<string, string> = {
  pending: "Chờ khách xác nhận",
  confirmed: "Chờ nhận phòng",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  cancelled: "Đã huỷ",
  no_show: "Không nhận phòng",
};

// Mapping nhãn hiển thị → giá trị API (dùng cho filter/tab)
const STATUS_LABEL_TO_API: Record<string, string> = {
  "Tất cả": "all",
  "Chờ khách xác nhận": "pending",
  "Chờ nhận phòng": "confirmed",
  "Đã nhận phòng": "checked_in",
  "Đã trả phòng": "checked_out",
  "Đã huỷ": "cancelled",
  "Không nhận phòng": "no_show",
};

export default function BookingDetailView({
  hotels,
  bookings,
  pagination,
  loading,
  onPageChange,
  fetchBookings,
  dateRange,
  setDateRange,
  filters,
  onFilterChange,
  onResetFilter,
}: {
  hotels: any[];
  
  bookings: any[];
  pagination: { page: number; total_pages: number; total: number };
  loading: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  fetchBookings: (hotelId: string, page: number, filters?: any) => void;
  dateRange: any;
  setDateRange: (dateRange: any) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onResetFilter: () => void;
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
  const [localFilters, setLocalFilters] = useState({
    booking_code: "",
    hotel_name:"",
    rent_type: "all",
    status: "all",
  });
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        booking_code: filters.booking_code || "",
        rent_type: filters.rent_type || "all",
        status: filters.status || "all",
        hotel_name:filters.hotel_name||"",
      });
    }
  }, [filters]);
  // Handler click row
  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };
  const handleSearch = () => {
    // Format dateRange thành chuỗi cho API

    const formatDateForAPI = (date: dayjs.Dayjs) => {
      if (!date) {
        return;
      }
      return date.format("YYYY-MM-DDTHH:mm:ssZ");
    };

    const updatedFilters = {
      ...localFilters,
      check_in_from: formatDateForAPI(dateRange?.checkIn),
      check_in_to: formatDateForAPI(dateRange?.checkOut),
    };

    onFilterChange(updatedFilters);
  };

  // Xử lý thay đổi tab (status)
  const handleTabChange = (tabLabel: string) => {
    const status = STATUS_LABEL_TO_API[tabLabel] || "all";

    const updatedLocalFilters = {
      ...localFilters,
      status: status,
    };

    setLocalFilters(updatedLocalFilters);

    // Format dateRange thành chuỗi cho API
    const formatDateForAPI = (date: dayjs.Dayjs) => {
      if (!date) {
        return;
      }
      return date.format("YYYY-MM-DDTHH:mm:ssZ");
    };

    const updatedFilters = {
      ...updatedLocalFilters,
      check_in_from: formatDateForAPI(dateRange.checkIn),
      check_in_to: formatDateForAPI(dateRange.checkOut),
    };

    onFilterChange(updatedFilters);
  };

  // Reset filter
  const handleReset = () => {
    setLocalFilters({
      booking_code: "",
      rent_type: "all",
      status: "all",
      hotel_name:""
    });

    const resetDateRange = {
      checkIn: dayjs(),
      checkOut: dayjs().add(1, "day"),
    };

    setDateRange(resetDateRange);
    onResetFilter();
  };

  // Đếm số lượng booking theo status
  const countByStatus = () => {
    const counts: Record<string, number> = {
      "Tất cả": bookings.length,
      "Chờ nhận phòng": 0,
      "Đã nhận phòng": 0,
      "Chờ khách xác nhận": 0,
      "Đã hủy": 0,
      "Không nhận phòng": 0,
      "Hoàn thành": 0,
      "Chờ Hotel Booking xử lý": 0,
    };

    bookings.forEach((booking) => {
      const statusLabel = STATUS_API_TO_LABEL[booking.status] || "Chờ xử lý";

      switch (statusLabel) {
        case "Chờ nhận phòng":
          counts["Chờ nhận phòng"]++;
          break;
        case "Đã nhận phòng":
          counts["Đã nhận phòng"]++;
          break;
        case "Chờ khách xác nhận":
          counts["Chờ khách xác nhận"]++;
          break;
        case "Hủy phòng":
          counts["Đã hủy"]++;
          break;
        case "Không nhận phòng":
          counts["Không nhận phòng"]++;
          break;
        case "Hoàn thành":
          counts["Hoàn thành"]++;
          break;
      }
    });

    return counts;
  };

  const statusCounts = countByStatus();

  // Danh sách tab với số lượng
  const tabs = [
    { label: "Tất cả", count: statusCounts["Tất cả"], value: "all" },
    {
      label: "Chờ nhận phòng",
      count: statusCounts["Chờ nhận phòng"],
      value: "pending",
    },
    {
      label: "Đã nhận phòng",
      count: statusCounts["Đã nhận phòng"],
      value: "checked_in",
    },
    {
      label: "Chờ khách xác nhận",
      count: statusCounts["Chờ khách xác nhận"],
      value: "confirmed",
    },
    { label: "Đã hủy", count: statusCounts["Đã hủy"], value: "cancelled" },
    {
      label: "Không nhận phòng",
      count: statusCounts["Không nhận phòng"],
      value: "no_show",
    },
    {
      label: "Hoàn thành",
      count: statusCounts["Hoàn thành"],
      value: "checked_out",
    },
    {
      label: "Chờ Hotel Booking xử lý",
      count: statusCounts["Chờ Hotel Booking xử lý"],
      value: "pending",
    },
  ];
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
       <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}>
          <Typography variant='h5' fontWeight='bold'>
          Quản lý đặt phòng
          </Typography>
        </Box>
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
                <Typography sx={{ mb: 1.5 }}>Mã đặt phòng</Typography>
                <TextField
                  placeholder='Tìm kiếm'
                  value={localFilters.booking_code}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      booking_code: e.target.value,
                    })
                  }
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
              </Box>
              <Box>
                <Typography sx={{ mb: 1.5 }}>Tên khách sạn</Typography>
                <TextField
                  placeholder='Tìm kiếm'
                  value={localFilters.hotel_name}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      hotel_name: e.target.value,
                    })
                  }
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
              </Box>
              <Box>
                <Typography sx={{ mb: 1.5 }}>Loại đặt phòng</Typography>
                <Select
                  displayEmpty
                  value={localFilters.rent_type}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      rent_type: e.target.value,
                    })
                  }
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
                  }}>
                  <MenuItem value='all'>Tất cả</MenuItem>
                  <MenuItem value='hourly'>Theo giờ</MenuItem>
                  <MenuItem value='daily'>Qua ngày</MenuItem>
                  <MenuItem value='overnight'>Qua đêm</MenuItem>
                </Select>
              </Box>

              {/* 2 ô DatePicker – ĐÃ FIX LỖI 100% */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Thời gian nhận phòng</Typography>
                <SimpleDateSearchBar
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Box>

              {/* Nút */}
              <Stack direction='row' alignItems={"end"} spacing={1}>
                <Button
                  variant='contained'
                  onClick={handleSearch}
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
                  onClick={handleReset}
                  sx={{
                    borderRadius: "24px",
                    height: 40,
                    minWidth: 120,
                    border: "1px solid rgba(208, 211, 217, 1)",
                    background: "rgba(240, 241, 243, 1)",
                    color: "black",
                  }}>
                  Xóa tìm kiếm
                </Button>
              </Stack>
            </Stack>

            {/* Chip */}
            <Stack direction='row' flexWrap='wrap' gap={1.5} mt={3}>
              {tabs.map((tab) => {
                const isActive = localFilters.status === tab.value;
                return (
                  <Chip
                    key={tab.label}
                    label={`${tab.label} ${tab.count}`}
                    onClick={() => handleTabChange(tab.label)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "18px",
                      height: 36,
                      bgcolor: isActive ? "#98b720" : "transparent",
                      color: isActive ? "white" : "#666",
                      border: isActive ? "none" : "1px solid #e0e0e0",
                      fontWeight: isActive ? "bold" : "normal",
                      "&:hover": {
                        bgcolor: isActive ? "#7cb342" : "#f5f5f5",
                      },
                    }}
                  />
                );
              })}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
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

                    const statusLabel =
                      STATUS_API_TO_LABEL[row.status] || "Chờ xử lý";

                    const roomName = row.room_types?.[0]?.name || "N/A";

                    return (
                      <TableRow
                        onClick={() => handleRowClick(row)}
                        sx={{ cursor: "pointer" }}
                        key={row.id}
                        hover>
                        <TableCell
                          sx={{
                            fontWeight: row.code.includes("(G)")
                              ? "bold"
                              : "normal",
                            color: row.code.includes("(G)")
                              ? "#1976d2"
                              : "#98B720",
                          }}>
                          {row.code}
                        </TableCell>
                        <TableCell>
                          <div>{row.total_price.toLocaleString()}đ</div>
                          <div style={{ marginTop: 8 }}>
                            <Box
                              sx={{
                                minWidth: 140,
                                height: 28,
                                fontSize: "0.825rem",
                                fontWeight: "medium",
                                ...paymentStatusStyles[getPaymentLabel(row)],
                              }}>
                              {getPaymentLabel(row)}
                            </Box>
                          </div>
                        </TableCell>
                        <TableCell>
                          {rentTypeLabel}
                          <br />
                          <span
                            style={{ color: "#98B720", fontSize: "0.875rem" }}>
                            {roomName}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDateTime(row.created_at)}
                          <br />
                          {formatDateTime(row.check_in)}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={statusLabel}
                            size='small'
                            sx={{ minWidth: 110, ...statusStyles[statusLabel] }}
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
              color='primary'
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
  const statusLabel = STATUS_API_TO_LABEL[booking.status] || "Chờ xử lý";
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
      }}>
      <DialogTitle sx={{ pb: 2 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h6' fontWeight='bold'>
            Chi tiết mã đặt phòng
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Thông tin đặt phòng */}
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant='subtitle1' fontWeight='bold'>
                Thông tin đặt phòng
              </Typography>
              <Chip
                label={statusLabel}
                size='small'
                sx={{ minWidth: 110, ...statusStyles[statusLabel] }}
              />
            </Box>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>
                Thời gian đặt phòng:
              </Typography>
              <Typography fontWeight='medium'>
                {formatDateTime(booking.created_at)}
              </Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>Tên người đặt:</Typography>
              <Typography fontWeight='medium'>
                {booking.customer_name || "Nguyễn Văn A"}
              </Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>Số điện thoại:</Typography>
              <Typography fontWeight='medium'>
                {booking.customer_phone || "0123456789"}
              </Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>Loại đặt phòng:</Typography>
              <Typography fontWeight='medium'>{rentTypeLabel}</Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>Loại phòng:</Typography>
              <Typography fontWeight='medium'>
                {booking.room_types?.[0]?.name || "Vip123"}
              </Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <Typography color='text.secondary'>Thời gian lưu trú:</Typography>
              <Typography fontWeight='medium'>
                {formatDateTime(booking.check_in)} -{" "}
                {formatDateTime(booking.check_out)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
