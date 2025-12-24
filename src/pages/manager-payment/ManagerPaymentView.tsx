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

export default function ManagerPaymentView({
  hotels,
  idHotel,
  setIdHotel,
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
  idHotel: string | null;
  setIdHotel: (id: string) => void;
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
    rent_type: "all",
    status: "all",
  });
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        booking_code: filters.booking_code || "",
        rent_type: filters.rent_type || "all",
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
      "Tất cả": 0,
      "Chờ nhận phòng": 0,
      "Đã nhận phòng": 0,
      "Chờ khách xác nhận": 0,
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
      label: "Thành công",
      count: statusCounts["Thành công"],
      value: "pending",
    },
    {
      label: "thất bại",
      count: statusCounts["thất bại"],
      value: "checked_in",
    },
    {
      label: "Chờ xử lý",
      count: statusCounts["Chờ xử lý"],
      value: "confirmed",
    },

    {
      label: "Hoàn trả",
      count: statusCounts["Hoàn trả"],
      value: "no_show",
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
              alignItems='end'>
              {/* Tìm kiếm */}
              <Box>
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
                <Typography sx={{ mb: 1.5 }}>Phương thức thanh toán</Typography>
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
                    <strong>Mã thanh toán</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phương thức thanh toán</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Giá tiền</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thời gian</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tình trạng thanh toán</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
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
      </Box>
    </LocalizationProvider>
  );
}
