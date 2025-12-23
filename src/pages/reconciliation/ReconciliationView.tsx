"use client";

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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Stack,
  useMediaQuery,
  Theme,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  CheckCircle,
  KeyboardArrowLeft,
  Search as SearchIcon,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react"; // npm install qrcode.react
import HotelSelect from "../../components/HotelSelect";
import { getbankPartner, listBookingSettlement } from "../../service/booking";
import { list_banks } from "../../utils/utils";
import {
  addBankHotels,
  confirmHotelsSettlement,
  updateBankHotels,
} from "../../service/hotel";
import { toast } from "react-toastify";
interface HotelRow {
  id: number;
  name: string;
  address: string;
  month: string;
  status: "Chưa đối soát" | "Hoàn thành" | "Chờ thanh toán";
  rooms: number;
  total: number;
  dueDate: string;
}

const data: HotelRow[] = [
  {
    id: 1,
    name: "Khách sạn 123",
    address: "110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    month: "Tháng 11.2025",
    status: "Chưa đối soát",
    rooms: 3,
    total: 5000000,
    dueDate: "31/12/2025",
  },
  {
    id: 2,
    name: "Khách sạn 123",
    address: "110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    month: "Tháng 11.2025",
    status: "Hoàn thành",
    rooms: 3,
    total: 5000000,
    dueDate: "31/12/2025",
  },
  {
    id: 3,
    name: "Khách sạn 123",
    address: "110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    month: "Tháng 11.2025",
    status: "Chưa đối soát",
    rooms: 3,
    total: -3600000,
    dueDate: "31/12/2025",
  },
  {
    id: 4,
    name: "Khách sạn 123",
    address: "110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    month: "Tháng 11.2025",
    status: "Chờ thanh toán",
    rooms: 3,
    total: 5000000,
    dueDate: "31/12/2025",
  },
  {
    id: 5,
    name: "Khách sạn 123",
    address: "110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    month: "Tháng 11.2025",
    status: "Hoàn thành",
    rooms: 3,
    total: 5000000,
    dueDate: "31/12/2025",
  },
];
const parseLang = (value: string, lang = "vi") => {
  try {
    const obj = JSON.parse(value);
    return obj[lang] || Object.values(obj)[0] || "";
  } catch {
    return value;
  }
};
const getStatusColor = (status: string) => {
  switch (status) {
    case "Chưa đối soát":
      return { bg: "#FFF0F0", color: "#E53935" };
    case "Hoàn thành":
      return { bg: "#E8F5E9", color: "#98B720" };
    case "Chờ thanh toán":
      return { bg: "#FFF3E0", color: "#EF6C00" };
    default:
      return { bg: "#F5F5F5", color: "#424242" };
  }
};

const formatCurrency = (amount: number) => {
  const abs = Math.abs(amount).toLocaleString("vi-VN");
  return amount < 0 ? `- ${abs}đ` : `${abs}đ`;
};

export default function ReconciliationView({
  hotels,
  pagination,
  setSettlement,
  settlement,
  onPageChange,
  idHotel,
  setIdHotel,
  dataSettlement,
  fetchSettlements,
}) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  );

  const STATUS_LABEL: Record<string, string> = {
    confirmed: "Chờ thanh toán",
    paid: "Đã thanh toán",
    carried: "Chuyển kỳ sau",
  };
  const tableData = dataSettlement.map((item, index) => ({
    id: index + 1, // hoặc item.id nếu muốn
    name: parseLang(item.hotel_name, "vi"),
    address: parseLang(item.hotel_address, "en"),
    month: item.period_month, // 2025-11
    status: STATUS_LABEL[item.status] ?? item.status, // confirmed
    rooms: "-", // API chưa có → placeholder
    total: item.closing_balance, // Tổng công nợ
    hotel_id: item.hotel_id, // Tổng công nợ
    _id: item.id,
    dueDate: new Date(item.confirm_deadline).toLocaleDateString("vi-VN"),
  }));
  return (
    <>
      {settlement && (
        <HotelDetailFinal
          settlement={settlement}
          setSettlement={setSettlement}
          hotels={hotels}
          isMobile={isMobile}
          idHotel={idHotel}
          setIdHotel={setIdHotel}
          fetchSettlements={fetchSettlements}
        />
      )}
      {!settlement && (
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
          }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}>
            <Typography variant='h5' fontWeight='600' color='#1a1a1a'>
              Quản lý đối soát
            </Typography>
            <Typography
              variant='body2'
              color='#e53935'
              sx={{ fontSize: "0.875rem" }}>
              <span style={{ color: "#33AE3F" }}>
                {" "}
                (+) Hotel Booking sẽ thanh toán cho KS
              </span>{" "}
              <br />
              (-) KS cần thanh toán cho Hotel Booking
            </Typography>
          </Box>

          {/* Search & Filter */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}>
            <Typography variant='h6' fontWeight='600' mb={2}>
              Danh sách khách sạn
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "center" }}
              mb={3}>
              <TextField
                placeholder='Tên khách sạn'
                size='small'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 40,

                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    "& fieldset": {
                      borderColor: "#cddc39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#cddc39",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl
                size='small'
                sx={{
                  height: 40,

                  fontWeight: 500,
                  fontSize: "1rem",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cddc39",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cddc39",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cddc39",
                  },
                  "& .MuiSelect-icon": { color: "#666", fontSize: "28px" },
                }}>
                <Select defaultValue='' displayEmpty>
                  <MenuItem value='' disabled>
                    Chọn kỳ đối soát
                  </MenuItem>
                  <MenuItem value='11-2025'>Tháng 11.2025</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, ml: { md: "auto" } }}>
                <Button
                  variant='contained'
                  color='success'
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    background: "#98B720",
                    color: "white",
                  }}>
                  Tìm kiếm
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    color: "#48505E",
                    background: "#F0F1F3",
                    border: "none",
                  }}>
                  Xóa tìm kiếm
                </Button>
              </Box>
            </Stack>

            {/* Tabs */}
            <Stack direction='row' spacing={1} flexWrap='wrap' gap={1}>
              {["Tất cả", "Chưa đối soát", "Chờ thanh toán", "Hoàn thành"].map(
                (tab) => (
                  <Button
                    key={tab}
                    variant={tab === "Tất cả" ? "contained" : "outlined"}
                    size='small'
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      color: tab === "Tất cả" ? "white" : "#98b720",
                      borderColor: "#98b720",
                      bgcolor: tab === "Tất cả" ? "#98b720" : "transparent",
                      "&:hover": {
                        bgcolor: tab === "Tất cả" ? "#1565c0" : "#f5f5f5",
                      },
                    }}>
                    {tab}
                  </Button>
                )
              )}
            </Stack>
            <TableContainer sx={{ maxHeight: "calc(100vh - 380px)", mt: 4 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                      Tên khách sạn
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                        Địa điểm
                      </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                      Kỳ đối soát
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                      Trạng thái
                    </TableCell>
                  
                    <TableCell
                      align='right'
                      sx={{ fontWeight: 600, color: "#424242" }}>
                      Tổng công nợ
                    </TableCell>
                    <TableCell
                      align='center'
                      sx={{ fontWeight: 600, color: "#424242" }}>
                      Hạn đối soát
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.map((row, index) => {
                    const statusStyle = getStatusColor(row.status);

                    return (
                      <TableRow key={index} hover>
                        <TableCell>{row.id}</TableCell>

                        <TableCell>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setSettlement(dataSettlement[index]);
                            }}
                            fontWeight='500'>
                            {row.name}
                          </Typography>
                          {isMobile && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              display='block'>
                              {row.address}
                            </Typography>
                          )}
                        </TableCell>

                        {!isMobile && (
                          <TableCell>
                            <Typography variant='body2' color='text.secondary'>
                              {row.address}
                            </Typography>
                          </TableCell>
                        )}

                        <TableCell>{row.month}</TableCell>

                        <TableCell>
                          <Chip
                            label={row.status}
                            size='small'
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 500,
                              height: 26,
                            }}
                          />
                        </TableCell>

                       

                        <TableCell
                          align='right'
                          sx={{
                            color: row.total < 0 ? "#e53935" : "inherit",
                            fontWeight: 500,
                          }}>
                          {formatCurrency(row.total)}
                        </TableCell>

                        <TableCell align='center'>{row.dueDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "center",
              }}>
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
            </Box>
          </Paper>

          {/* Table */}
        </Box>
      )}
    </>
  );
}

import { IconButton } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

function HotelDetailFinal({
  hotels,
  isMobile,
  setSettlement,
  settlement,
  idHotel,
  setIdHotel,
  fetchSettlements,
}) {
  const [dataSettlementBooking, setDataSettlementBooking] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  let [bankPrimary, setBankPrimary] = useState(null);
  useEffect(() => {
    getListBankPartner();
  }, []);

  const getListBankPartner = async () => {
    try {
      let result = await getbankPartner(settlement?.hotel_id);
      console.log(result);
      if (result?.banks?.length > 0) {
        setBankPrimary(result?.banks.find((item) => item.is_default == 1));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (settlement) {
      fetchBooking(1);
    }
  }, [settlement]);

  const fetchBooking = async (page: number = 1) => {
    try {
      const query = new URLSearchParams({ ...pagination, page }).toString();
      const result = await listBookingSettlement(settlement?.id, query);
      // Giả sử API trả về cấu trúc như mẫu bạn cung cấp
      setDataSettlementBooking(result.bookings || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setDataSettlementBooking([]);
    } finally {
    }
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchBooking(newPage);
  };

  const formatCurrency = (value: number) =>
    value?.toLocaleString("vi-VN") + "đ";

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const rentTypeLabel = (type: string) => {
    if (type === "hourly") return "Theo giờ";
    if (type === "daily") return "Theo ngày";
    return type;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const debtInMonth = settlement?.total_booking_amount; // Công nợ phát sinh
  const deductedDebt = settlement?.commission_amount; // Công nợ khấu trừ
  const totalDebt = settlement?.closing_balance; // Tổng công nợ

  const periodText = `${formatDate(settlement?.start_time)} - ${formatDate(
    settlement?.end_time
  )}`;

  const deadlineText = `${formatTime(
    settlement?.confirm_deadline
  )}, ${formatDate(settlement?.confirm_deadline)}`;
  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {/* Header – giống 100% */}

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          {/* Left section */}
          <Box
            display='flex'
            flexDirection='row'
            alignItems={"center"}
            gap={0.5}>
            <KeyboardArrowLeft
              onClick={() => {
                setSettlement(null);
              }}
              sx={{ fontSize: 32, mr: 1, cursor: "pointer" }}
            />
            <Typography variant='h5' fontWeight='bold'>
              {parseLang(settlement?.hotel_name)}
            </Typography>
          </Box>
        </Box>

        {/* Bảng chi tiết */}
        <Paper
          sx={{
            mt: 3,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}>
          <Box
            sx={{
              bgcolor: "#98B7200D",
              border: "1px solid #98B720",
              borderRadius: 4,
              p: { xs: 2.5, sm: 3 },
              mx: "auto",
              fontFamily: "Roboto, sans-serif",
              mb: 2,
            }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 4 }}
              alignItems={{ md: "flex-start" }}
              justifyContent='space-between'>
              {/* Cột trái */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Công nợ phát sinh */}
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={1.5}>
                  <Typography variant='body1' color='#424242'>
                    Công nợ phát sinh trong tháng
                  </Typography>
                  <Typography variant='h6' fontWeight={600} color='#98B720'>
                    {formatCurrency(debtInMonth)}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Công nợ khấu trừ */}
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={1.5}>
                  <Typography variant='body1' color='#424242'>
                    Công nợ khấu trừ
                  </Typography>
                  <Typography variant='h6' fontWeight={600} color='#E53935'>
                    -{formatCurrency(deductedDebt)}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ height: 1, bgcolor: "#E0E0E0", my: 2 }} />

                {/* Tổng công nợ */}
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={1.5}>
                  <Typography variant='h6' fontWeight={700} color='#98B720'>
                    Tổng công nợ
                  </Typography>
                  <Typography variant='h5' fontWeight={700} color='#98B720'>
                    {formatCurrency(totalDebt)}
                  </Typography>
                </Stack>

                <Typography
                  variant='caption'
                  color='#E53935'
                  sx={{ lineHeight: 1.5 }}>
                  <span style={{ color: "#33AE3F" }}>
                    {" "}
                    (+) Hotel Booking sẽ thanh toán cho KS
                  </span>{" "}
                  <br />
                  (-) KS cần thanh toán cho Hotel Booking
                </Typography>
              </Box>

              {/* Cột giữa */}
              <Box sx={{ textAlign: "left", flexShrink: 0 }}>
                <Typography variant='body2' color='#616161' gutterBottom>
                  Thời gian ghi nhận đặt phòng
                </Typography>
                <Typography variant='body1' fontWeight={500}>
                  {periodText}
                </Typography>

                <Typography variant='body2' color='#616161' mt={2} gutterBottom>
                  Số lượng đặt phòng
                </Typography>
                <Typography variant='h6' fontWeight={600} color='#1976D2'>
                  {/* API chưa có → placeholder */}
                  --
                </Typography>
              </Box>

              {/* Cột phải */}
              <Box
                sx={{ textAlign: { xs: "left", md: "right" }, flexShrink: 0 }}>
                {settlement?.status == "draft" ? (
                  <Button
                    variant='contained'
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    sx={{
                      bgcolor: "#98B720",
                      borderRadius: 10,
                      px: 5,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "none",
                      mb: 2,
                    }}>
                    Hoàn tất đối soát
                  </Button>
                ) : (
                  <>
                    <Typography
                      variant='body2'
                      color='#616161'
                      sx={{ maxWidth: 340 }}>
                      Hotel Booking sẽ thanh toán công nợ cho khách vào{" "}
                      <strong>{deadlineText}</strong> qua tài khoản:
                    </Typography>

                    <Stack spacing={1.5} mt={2}>
                      {" "}
                      {/* Số tài khoản */}
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Typography color='#424242' mb={1}>
                          Số tài khoản
                        </Typography>
                        <Typography fontWeight={"700"}>
                          {bankPrimary?.account_number}
                        </Typography>
                      </Box>
                      <Divider sx={{ mt: 1, borderColor: "#EEEEEE" }} />
                      {/* Người thụ hưởng */}
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Typography color='#424242' mb={1}>
                          Người thụ hưởng
                        </Typography>
                        <Typography fontWeight={"700"}>
                          {bankPrimary?.account_name}
                        </Typography>
                      </Box>
                      <Divider sx={{ mt: 1, borderColor: "#EEEEEE" }} />
                      {/* Tên ngân hàng - SELECT thật 100% giống ảnh */}
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Typography color='#424242' mb={1}>
                          Tên ngân hàng
                        </Typography>
                        <FormControl>
                          <Typography fontWeight={"700"}>
                            {bankPrimary?.bank_name}
                          </Typography>
                        </FormControl>
                      </Box>
                    </Stack>
                  </>
                )}

                {settlement?.status == "draft" && (
                  <Typography
                    variant='body2'
                    color='#616161'
                    sx={{ maxWidth: 340 }}>
                    Vui lòng hoàn tất đối soát trước{" "}
                    <strong>{deadlineText}</strong> để nhận thanh toán đúng hạn
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <TextField
              placeholder='Tìm theo mã đặt phòng'
              size='small'
              sx={{
                width: { xs: "100%", sm: 340 },
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: "#9e9e9e" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                  {[
                    "#",
                    "Mã đặt phòng",
                    "Loại phòng",
                    "Thời gian",
                    "Tiền phòng",
                    "Tổng thanh toán",
                    "Phí hoa hồng",
                    "Công nợ",
                  ].map((h, i, arr) => (
                    <TableCell
                      key={h}
                      align={i === arr.length - 1 ? "right" : "left"}
                      sx={{
                        fontWeight: 600,
                        color: "#424242",
                        fontSize: "0.875rem",
                      }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataSettlementBooking.map((row, index) => {
                  const debt = row.partner_amount; // Công nợ
                  const isNegative = debt < 0;

                  return (
                    <TableRow key={row.id} hover>
                      {/* # */}
                      <TableCell>{index + 1}</TableCell>

                      {/* Mã đặt phòng */}
                      <TableCell sx={{ fontWeight: 500 }}>
                        {row.booking_code}
                      </TableCell>

                      {/* Loại phòng */}
                      <TableCell>
                        {row.room_type_name} - {rentTypeLabel(row.rent_type)}
                      </TableCell>

                      {/* Thời gian */}
                      <TableCell
                        sx={{
                          color: "#616161",
                          fontSize: "0.875rem",
                          lineHeight: 1.4,
                        }}>
                        {formatDateTime(row.check_in)}
                        <br />
                        {formatDateTime(row.check_out)}
                      </TableCell>

                      {/* Tiền phòng */}
                      <TableCell>
                        {formatCurrency(row.booking_amount)}
                      </TableCell>

                      {/* Tổng thanh toán */}
                      <TableCell>
                        {formatCurrency(row.booking_amount)}
                      </TableCell>

                      {/* Phí hoa hồng */}
                      <TableCell sx={{ color: "#616161" }}>
                        {formatCurrency(row.commission_amount)}
                      </TableCell>

                      {/* Công nợ */}
                      <TableCell
                        align='right'
                        sx={{
                          fontWeight: 600,
                          color: isNegative ? "#E53935" : "#98B720",
                        }}>
                        {isNegative
                          ? `-${formatCurrency(Math.abs(debt))}`
                          : formatCurrency(debt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "center",
            }}>
            <Pagination
              key={pagination.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
              count={pagination.total_pages}
              page={pagination.page}
              onChange={handlePageChange}
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
          </Box>
        </Paper>
      </Box>
      <ConfirmCompleteModal
        fetchSettlements={fetchSettlements}
        open={openModal}
        settlement={settlement}
        onClose={() => setOpenModal(false)}
      />
    </Box>
  );
}

import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Alert } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
function ConfirmCompleteModal({
  open = false,
  onClose = () => {},
  fetchSettlements,
  settlement,
}) {
  let [action, setAction] = useState(1);
  let [banks, setBanks] = useState([]);
  let [bankPrimary, setBankPrimary] = useState(null);
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [beneficiary, setBeneficiary] = useState("NGUYEN VAN A"); // Giá trị mẫu
  const [bankCode, setBankCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked1(event.target.checked);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked2(event.target.checked);
  };
  useEffect(() => {
    getListBankPartner();
  }, []);

  const getListBankPartner = async () => {
    try {
      let result = await getbankPartner(settlement?.hotel_id);
      console.log(result);
      if (result?.banks?.length > 0) {
        setBankPrimary(result?.banks.find((item) => item.is_default == 1));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchAndValidate = async () => {
    setErrors({}); // Reset errors

    // Validate frontend
    const newErrors = {};
    if (!accountNumber.trim())
      newErrors.accountNumber = "Số tài khoản không được để trống";
    else if (!/^\d{8,15}$/.test(accountNumber))
      newErrors.accountNumber = "Số tài khoản phải là số từ 8-15 chữ số";

    if (!beneficiary.trim())
      newErrors.beneficiary = "Người thụ hưởng không được để trống";
    else if (beneficiary.length < 3)
      newErrors.beneficiary = "Tên người thụ hưởng quá ngắn";

    if (!bankCode) newErrors.bankCode = "Vui lòng chọn ngân hàng";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Lấy dữ liệu từ API (ví dụ: fetch thông tin tài khoản từ server)
    try {
      if (isEdit) {
        const response = await updateBankHotels(bankPrimary.id, {
          bank_code: bankCode, //Bank code và bank name lấy theo link này: https://developers.momo.vn/v3/docs/payment/api/result-handling/bankcode/#bank-name-and-bank-code-mapping-list
          bank_name: list_banks.find((item) => item.code == bankCode)?.name,
          account_number: accountNumber,
          account_name: beneficiary,
        });
        if (response?.bank_id) {
          setAction(2);
          toast.success(response?.msg);
          getListBankPartner();
        } else {
          toast.error(response?.message);
        }
      } else {
        const response = await addBankHotels({
          hotel_id: settlement?.hotel_id,
          bank_code: bankCode, //Bank code và bank name lấy theo link này: https://developers.momo.vn/v3/docs/payment/api/result-handling/bankcode/#bank-name-and-bank-code-mapping-list
          bank_name: list_banks.find((item) => item.code == bankCode)?.name,
          account_number: accountNumber,
          account_name: beneficiary,
        });
        if (response?.bank_id) {
          setAction(4);
          toast.success(response?.msg);
          getListBankPartner();
        } else {
          toast.error(response?.message);
        }
      }

      console.log("Dữ liệu hợp lệ:", data);
      // Ví dụ: onSuccess(data);
    } catch (error) {
      setErrors({ general: "Lỗi khi lấy dữ liệu: " + error.message });
    }
  };
  console.log("AAA action", action);
  const handleConfirm = async () => {
    try {
      let result = await confirmHotelsSettlement(settlement?.id);
      if (result?.message) {
        fetchSettlements(1);
        setAction(1);
        onClose();
        toast.success(result?.message);
      } else {
        toast.error(result?.message);
      }
      console.log("AAA result handleConfirm", result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          mx: { xs: 2, sm: 0 },
        },
      }}>
      {/* Header */}
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h6' fontWeight={700} color='#111'>
            Xác nhận hoàn tất đối soát
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='center'
        spacing={4}
        mb={5}>
        <Stack direction='row' alignItems='center' spacing={2}>
          <Box
            sx={{
              width: 30,
              height: 30,
              bgcolor: "#98B720",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 700,
            }}>
            1
          </Box>
          <Typography fontWeight={600} fontSize={"12px"} color='#98B720'>
            Xác nhận thông tin tài khoản thanh toán
          </Typography>
        </Stack>

        <Box sx={{ width: 40, height: 1, borderTop: "2px dashed #BDBDBD" }} />

        <Stack direction='row' alignItems='center' spacing={2}>
          <Box
            sx={{
              width: 30,
              height: 30,
              bgcolor: action == 5 ? "#98B720" : "#EEEEEE",
              color: action == 5 ? "white" : "#9E9E9E",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
            }}>
            2
          </Box>
          <Typography
            fontWeight={600}
            fontSize={"12px"}
            color={action == 5 ? "#98B720" : "#9E9E9E"}>
            Xác nhận hoàn tất
          </Typography>
        </Stack>
      </Stack>
      {action == 1 && (
        <DialogContent sx={{ px: 4, pb: 3 }}>
          <Typography variant='body1' color='#424242' lineHeight={1.7} mb={4}>
            Bằng việc <strong>xác nhận đối soát ngay</strong>, Hotel Booking và
            khách sạn thống nhất nội dung đối soát. Sau khi đối soát hoàn tất,
            các bên sẽ thực hiện nghĩa vụ thanh toán như trong hợp đồng được ký
            kết.
          </Typography>

          {/* Tiêu đề yêu cầu */}
          <Typography variant='body1' color='#424242' fontWeight={600} mb={3}>
            Vui lòng đánh dấu xác nhận các mục bên dưới để hoàn tất:
          </Typography>

          {/* 2 mục tick xanh */}
          <Stack spacing={2.5} mb={5}>
            <Stack direction='row' alignItems='flex-start' spacing={2}>
              <CheckCircle
                sx={{ color: "#98B720", fontSize: 28, flexShrink: 0, mt: 0.3 }}
              />
              <Typography variant='body1' color='#424242' lineHeight={1.7}>
                Bảng đối soát hiện tại <strong>đúng và đủ</strong> các đặt phòng
                trong kỳ đối soát.
              </Typography>
            </Stack>

            <Stack direction='row' alignItems='flex-start' spacing={2}>
              <CheckCircle
                sx={{ color: "#98B720", fontSize: 28, flexShrink: 0, mt: 0.3 }}
              />
              <Typography variant='body1' color='#424242' lineHeight={1.7}>
                Số tiền công nợ <strong>là đúng</strong> theo số tiền trong kỳ
                đối soát
              </Typography>
            </Stack>
          </Stack>

          {/* Dòng cảnh báo đỏ – giống hệt ảnh */}
          <Typography
            variant='body2'
            color='#E53935'
            fontWeight={500}
            lineHeight={1.7}
            sx={{
              bgcolor: "#FFEBEE",
              padding: "14px 20px",
              borderRadius: 2,
              borderLeft: "4px solid #E53935",
            }}>
            Lưu ý: Nếu bạn thấy <strong>đối tượng</strong> thông tin tài khoản
            thanh toán, bạn cần chờ Hotel Booking xử lý yêu cầu và cập nhật
            thông tin trên hệ thống.
          </Typography>
        </DialogContent>
      )}
      {action == 4 && (
        <DialogContent sx={{ px: 4, pb: 3 }}>
          <PaymentQRInfo bankPrimary={bankPrimary} />
        </DialogContent>
      )}
      {action == 5 && (
        <DialogContent sx={{ px: 4, pb: 3 }}>
          <Box>
            {/* Tiêu đề chính */}
            <Typography variant='body2' gutterBottom>
              Bằng việc xác nhận đặt chỗ ngay, Hotel Booking và khách sạn thống
              nhất nội dung đối soát. Sau khi đối soát hoàn tất, các bên sẽ thực
              hiện nghĩa vụ thanh toán như trong hợp đồng được ký kết.
            </Typography>

            <Typography variant='body2' gutterBottom sx={{ mt: 2 }}>
              Vui lòng đánh dấu xác nhận các mục bên dưới để hoàn tất:
            </Typography>

            {/* Các checkbox */}
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked1}
                    onChange={handleChange1}
                    icon={<CheckCircleOutlineIcon sx={{ color: "grey.500" }} />}
                    checkedIcon={
                      <CheckCircleOutlineIcon sx={{ color: "#98B720" }} />
                    }
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 25 },
                    }}
                  />
                }
                label={
                  <Typography fontSize={"15px"}>
                    Bảng đối soát hiện tại đúng và đủ các đặt phòng trong kỳ đối
                    soát.
                  </Typography>
                }
                sx={{ alignItems: "center", mt: 1 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked2}
                    onChange={handleChange2}
                    icon={<CheckCircleOutlineIcon sx={{ color: "grey.500" }} />}
                    checkedIcon={
                      <CheckCircleOutlineIcon sx={{ color: "#98B720" }} />
                    }
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 25 },
                    }}
                  />
                }
                label={
                  <Typography fontSize={"15px"}>
                    Số tiền công nợ là đúng theo số tiền trong kỳ đối soát
                  </Typography>
                }
                sx={{ alignItems: "center", mt: 2 }}
              />
            </FormGroup>

            <Divider sx={{ my: 3 }} />

            {/* Thông báo cảnh báo */}

            <Typography variant='body2' color='red' fontWeight='medium'>
              Lưu ý: Nếu bạn thay đổi thông tin tài khoản thanh toán, bạn cần
              cho Hotel Booking xử lý yêu cầu và cập nhật thông tin trên hệ
              thống.
            </Typography>
          </Box>
        </DialogContent>
      )}
      {action == 2 && (
        <DialogContent sx={{ px: 4, pb: 3 }}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant='h6' fontWeight={600} color='#111' mb={4}>
              Thông tin tài khoản thanh toán
            </Typography>
            <Typography
              onClick={() => {
                setIsEdit(true);
                setBankCode(bankPrimary?.bank_code);
                setAccountNumber(bankPrimary?.account_number);
                setBeneficiary(bankPrimary?.account_name);
                setAction(3);
              }}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              color='#4E6AFF'>
              Chỉnh sửa
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {" "}
            <Divider sx={{ mt: 1, borderColor: "#EEEEEE" }} />
            {/* Số tài khoản */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography color='#424242' fontWeight={500} mb={1}>
                Số tài khoản
              </Typography>
              <Typography fontWeight={"700"}>
                {bankPrimary?.account_number}
              </Typography>
            </Box>
            <Divider sx={{ mt: 1, borderColor: "#EEEEEE" }} />
            {/* Người thụ hưởng */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography color='#424242' fontWeight={500} mb={1}>
                Người thụ hưởng
              </Typography>
              <Typography fontWeight={"700"}>
                {bankPrimary?.account_name}
              </Typography>
            </Box>
            <Divider sx={{ mt: 1, borderColor: "#EEEEEE" }} />
            {/* Tên ngân hàng - SELECT thật 100% giống ảnh */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography color='#424242' fontWeight={500} mb={1}>
                Tên ngân hàng
              </Typography>
              <FormControl>
                <Typography fontWeight={"700"}>
                  {bankPrimary?.bank_name}
                </Typography>
              </FormControl>
            </Box>
          </Stack>
        </DialogContent>
      )}
      {action == 3 && (
        <DialogContent sx={{ px: 4, pb: 3 }}>
          {/* Step 1 - 2 */}

          {/* Tiêu đề + nút Chỉnh sửa */}
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={3}>
            <Typography variant='h6' fontWeight={600} color='#111' mb={4}>
              Thông tin tài khoản thanh toán
            </Typography>
          </Stack>

          {/* Card thông tin tài khoản – giống hệt ảnh */}
          <Box
            sx={{
              borderRadius: 3,
              textAlign: "left",
            }}>
            <Stack spacing={2.5}>
              {/* Số tài khoản */}
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography color='#616161' fontWeight={500}>
                  Số tài khoản
                </Typography>
                <TextField
                  fullWidth
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  variant='outlined'
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                  sx={{
                    width: "60%",
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      bgcolor: "#FAFAFA",
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "1rem",
                      "& fieldset": {
                        borderColor: errors.accountNumber
                          ? "#F44336"
                          : "#cddc39",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: errors.accountNumber
                          ? "#F44336"
                          : "#cddc39",
                      },
                    },
                  }}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              {/* Người thụ hưởng */}
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography color='#616161' fontWeight={500}>
                  Người thụ hưởng
                </Typography>
                <TextField
                  fullWidth
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  variant='outlined'
                  error={!!errors.beneficiary}
                  helperText={errors.beneficiary}
                  sx={{
                    width: "60%",
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      bgcolor: "#FAFAFA",
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "1rem",
                      "& fieldset": {
                        borderColor: errors.beneficiary ? "#F44336" : "#cddc39",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: errors.beneficiary ? "#F44336" : "#cddc39",
                      },
                    },
                  }}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              {/* Tên ngân hàng */}
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography color='#616161' fontWeight={500}>
                  Tên ngân hàng
                </Typography>
                <Select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  displayEmpty
                  error={!!errors.bankCode}
                  sx={{
                    width: "60%",
                    height: 40,
                    bgcolor: "#FAFAFA",
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: "1rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.bankCode ? "#F44336" : "#cddc39",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.bankCode ? "#F44336" : "#cddc39",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.bankCode ? "#F44336" : "#cddc39",
                    },
                    "& .MuiSelect-icon": { color: "#666", fontSize: "28px" },
                  }}>
                  <MenuItem value='' disabled>
                    Chọn ngân hàng
                  </MenuItem>
                  {list_banks.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Divider sx={{ my: 2 }} />
            </Stack>
          </Box>
        </DialogContent>
      )}

      {/* Nút hành động */}
      <DialogActions
        sx={{ px: 4, pb: 4, pt: 2, justifyContent: "end", gap: 2 }}>
        <Button
          variant='outlined'
          onClick={() => {
            if (action == 4) {
              setAction(2);
            } else if (isEdit && action == 3) {
              setAction(2);
            } else {
              setAction(1);
              onClose();
            }
          }}
          sx={{
            minWidth: 120,
            borderRadius: 10,
            py: 1.4,
            textTransform: "none",
            borderColor: "#BDBDBD",
            color: "#424242",
            fontWeight: 600,
          }}>
          {action == 3 ? "Quay lại" : "Hủy"}
        </Button>

        <Button
          variant='contained'
          onClick={() => {
            if (!bankPrimary && action != 3) {
              setAction(3);
            } else if (action == 3) {
              console.log("AAAA add");
              handleFetchAndValidate();
            } else if (action == 4) {
              setAction(2);
            } else if (action == 2 && bankPrimary) {
              setAction(5);
            } else if (action == 5) {
              handleConfirm();
            } else {
              setAction(++action);
            }
          }}
          sx={{
            minWidth: 140,
            bgcolor: "#98B720",
            borderRadius: 10,
            py: 1.4,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "none",
            "&:hover": { bgcolor: "#388E3C", boxShadow: "none" },
          }}>
          {action == 3 ? "Lưu" : action == 5 ? "Xác nhận hoàn tất" : "Tiếp tục"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PaymentQRInfo({ bankPrimary }) {
  const qrData = "0123456789|Nguyễn Văn A|Techcombank";

  return (
    <Box
      sx={{
        mx: "auto",

        textAlign: "center",
        fontFamily: "Roboto, sans-serif",
      }}>
      {/* QR Code */}
      <Box>
        <QRCodeCanvas
          value={qrData}
          size={220}
          level='M'
          includeMargin={true}
        />
      </Box>

      {/* Tiêu đề */}
      <Typography
        variant='h6'
        textAlign={"left"}
        fontWeight={600}
        color='#111'
        mb={2}>
        Thông tin tài khoản thanh toán
      </Typography>

      {/* Thông tin chi tiết */}
      <Stack spacing={3}>
        {/* Số tài khoản */}
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography color='#616161' fontWeight={500}>
            Số tài khoản
          </Typography>
          <Typography fontWeight={700} color='#111' fontSize='1.1rem'>
            {bankPrimary?.account_number}
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: "#EEEEEE" }} />

        {/* Người thụ hưởng */}
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography color='#616161' fontWeight={500}>
            Người thụ hưởng
          </Typography>
          <Typography fontWeight={600} color='#111'>
            {bankPrimary?.account_name}
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: "#EEEEEE" }} />

        {/* Tên ngân hàng */}
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'>
          <Typography color='#616161' fontWeight={500}>
            Tên ngân hàng
          </Typography>
          <Typography
            fontWeight={600}
            color='#111'
            textAlign='right'
            sx={{ maxWidth: "60%" }}>
            {bankPrimary?.bank_name}
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: "#EEEEEE" }} />

        {/* Nội dung thanh toán */}
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'>
          <Typography color='#616161' fontWeight={500}>
            Nội dung thanh toán
          </Typography>
          <Typography
            fontWeight={600}
            textAlign='right'
            sx={{ maxWidth: "60%", lineHeight: 1.4 }}>
            Tên khách sạn - Email - Số điện thoại
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
