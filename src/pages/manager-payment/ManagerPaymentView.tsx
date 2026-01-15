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




export default function ManagerPaymentView({

  Payment,
  pagination,
  loading,
  onPageChange,
  dateRange,
  setDateRange,
  filters,
  onFilterChange,
  onResetFilter,
}: {
  hotels: any[];
  idHotel: string | null;
  setIdHotel: (id: string) => void;
  Payment: any[];
  pagination: { page: number; total_pages: number; total: number };
  loading: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  fetchPayment: (hotelId: string, page: number, filters?: any) => void;
  dateRange: any;
  setDateRange: (dateRange: any) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onResetFilter: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    booking_code: "",
    method: "all",
    status: "all",
  });
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        booking_code: filters.booking_code || "",
        method: filters.method || "all",
        status: filters.status || "all",
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
    const selectedTab = tabs.find(tab => tab.label === tabLabel);
    if (!selectedTab) return;

    const status = selectedTab.value;

    const updatedLocalFilters = {
      ...localFilters,
      status: status,
    };

    setLocalFilters(updatedLocalFilters);

    // Cập nhật filter cho controller (giữ nguyên date range hiện tại)
    const updatedFilters = {
      ...updatedLocalFilters,
      check_in_from: dateRange?.checkIn ? formatDateForAPI(dateRange.checkIn) : "",
      check_in_to: dateRange?.checkOut ? formatDateForAPI(dateRange.checkOut) : "",
    };

    onFilterChange(updatedFilters);
  };
  const formatDateForAPI = (date: dayjs.Dayjs | null) => {
    if (!date) return "";
    return date.format("YYYY-MM-DDTHH:mm:ss+07:00"); // giữ nguyên định dạng như Controller
  };

  // Reset filter
  const handleReset = () => {
    setLocalFilters({
      booking_code: "",
      method: "all",
      status: "all",
    });

    const resetDateRange = {
      checkIn: dayjs("2025-01-01T00:00:00"),
      checkOut: dayjs(),
    };

    setDateRange(resetDateRange);
    onResetFilter();
  };

  const formatPrice = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "").trim();

  const tabs = [
    { label: "Tất cả", value: "all" },
    { label: "Thành công", value: "paid" },
    { label: "Thất bại", value: "failed" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Hoàn trả", value: "refunded" },
  ];
 

  // Desktop: Bảng gốc (giữ nguyên 100%)
  const renderDesktop = () => (
    <TableContainer sx={{ mt: 5, width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell><strong>#</strong></TableCell>
            <TableCell><strong>Mã đặt phòng</strong></TableCell>
            <TableCell><strong>Mã thanh toán</strong></TableCell>
            <TableCell><strong>Phương thức thanh toán</strong></TableCell>
            <TableCell><strong>Giá tiền</strong></TableCell>
            <TableCell><strong>Thời gian</strong></TableCell>
            <TableCell><strong>Tình trạng thanh toán</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>Đang tải...</Typography>
              </TableCell>
            </TableRow>
          ) : Payment.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>Không có dữ liệu</Typography>
              </TableCell>
            </TableRow>
          ) : (
            Payment.map((payment, index) => {
              const formattedAmount = formatPrice(payment.amount);
              const formattedTime = dayjs(payment.created_at).format("HH:mm:ss DD/MM/YYYY");

              const methodLabel = {
                momo: "MoMo",
                vnpay: "VN Pay",
                cash: "Thanh toán trực tiếp",
              }[payment.method?.toLowerCase()] || payment.method;

              const statusConfig = {
                paid: { label: "Thành công", color: "#98b720", textColor: "white" },
                failed: { label: "Thất bại", color: "#d32f2f", textColor: "white" },
                pending: { label: "Chờ xử lý", color: "#ffb020", textColor: "white" },
                refunded: { label: "Hoàn trả", color: "#1976d2", textColor: "white" },
              };

              const status = statusConfig[payment.status] || {
                label: "Không xác định",
                color: "#9e9e9e",
                textColor: "white",
              };

              return (
                <TableRow
                  key={payment.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(payment)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight={500}>{payment.booking_code}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Khách sạn 123 {/* thay bằng dữ liệu thật nếu có */}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{payment.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{methodLabel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color="#333">
                      {formattedAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{formattedTime}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.color,
                        color: status.textColor,
                        fontWeight: 500,
                        borderRadius: "12px",
                        minWidth: 100,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile: Card dọc
  const renderMobile = () => (
    <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 3 }}>
      {loading ? (
        <Typography align="center">Đang tải...</Typography>
      ) : Payment.length === 0 ? (
        <Typography align="center" color="#999" py={6}>
          Không có dữ liệu
        </Typography>
      ) : (
        Payment.map((payment, index) => {
          const formattedAmount = formatPrice(payment.amount);
          const formattedTime = dayjs(payment.created_at).format("HH:mm:ss DD/MM/YYYY");

          const methodLabel = {
            momo: "MoMo",
            vnpay: "VN Pay",
            cash: "Thanh toán trực tiếp",
          }[payment.method?.toLowerCase()] || payment.method;

          const statusConfig = {
            paid: { label: "Thành công", color: "#98b720", textColor: "white" },
            failed: { label: "Thất bại", color: "#d32f2f", textColor: "white" },
            pending: { label: "Chờ xử lý", color: "#ffb020", textColor: "white" },
            refunded: { label: "Hoàn trả", color: "#1976d2", textColor: "white" },
          };

          const status = statusConfig[payment.status] || {
            label: "Không xác định",
            color: "#9e9e9e",
            textColor: "white",
          };

          return (
            <Paper
              key={payment.id}
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
              onClick={() => handleRowClick(payment)}
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
                    {payment.booking_code}
                  </Typography>
                </Stack>

                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    bgcolor: status.color,
                    color: status.textColor,
                    fontWeight: 500,
                    borderRadius: "12px",
                    minWidth: 100,
                  }}
                />
              </Box>

              <Divider />

              {/* Nội dung chính */}
              <Box sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phương thức
                    </Typography>
                    <Typography fontWeight="500">{methodLabel}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Giá tiền
                    </Typography>
                    <Typography fontWeight="600" color="#333">
                      {formattedAmount}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography color="#616161">{formattedTime}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mã thanh toán
                    </Typography>
                    <Typography fontWeight="500">{payment.id}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          );
        })
      )}
    </Box>
  );
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
            Quản lý thanh toán
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' mb={3} fontWeight='600'>
            Danh sách thanh toán
          </Typography>
          <Stack spacing={4}>
            {/* Label căn chuẩn */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              mb={4}
              spacing={2}
              alignItems={{xs:"start",md:'end'}}>
              {/* Tìm kiếm */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Tìm kiếm</Typography>
                <TextField
                  placeholder='Tìm mã đặt phòng'
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
                    width: {xs:"100%",md:280},
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
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Phương thức thanh toán</Typography>
                <Select
                  displayEmpty

                  value={localFilters.method}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      method: e.target.value,
                    })
                  }
                  sx={{
                    width: {xs:"100%",md:200},
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
                  <MenuItem value='vnpay'>VNPay</MenuItem>
                  <MenuItem value='momo'>Momo</MenuItem>
                  <MenuItem value='cash'>Thanh toán trực tiếp</MenuItem>

                </Select>
              </Box>

              {/* 2 ô DatePicker – ĐÃ FIX LỖI 100% */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Thời gian</Typography>
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
                    label={tab.label}  // Chỉ hiển thị label, không có count
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
          {isMobile ? renderMobile() : renderDesktop()}
          {Payment.length !== 0  &&<Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
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
          </Stack>}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
