"use client";

import {
  Close,
  KeyboardArrowLeft,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getbankPartner, listBookingSettlement } from "../../service/booking";
import { sendPay, sendPubllish } from "../../service/hotel";
import success from "../../images/Frame.png";
import dayjs from "dayjs";
import empty from "../../images/Frame 1321317883.png";
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

const STATUS_LABEL = {
  draft: "Chưa đối soát",
  pending: "Chờ xác nhận",
  confirmed: "Chờ thanh toán",
  paid: "Thanh toán",
  completed: "Hoàn thành", // Giả sử
};
const formatCurrency = (amount: number) => {
  const abs = Math.abs(amount).toLocaleString("vi-VN");
  return amount < 0 ? `- ${abs}đ` : `${abs}đ`;
};

export default function ReconciliationView({
  dataSettlement = [],
  pagination = { page: 1, total_pages: 1 },
  loading = false,
  settlement,
  setSettlement,
  onPageChange,
  fetchSettlements,
  filters,
  onFilterChange,
  onResetFilter,
}) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [action, setAction] = useState("manager");
  const [sendAll, setSendAll] = useState(false)
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const [localFilters, setLocalFilters] = useState({
    hotel_name: "",
    period_month: "",
    status: "all",
  });
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
      setCurrentTab(filters.status || "");
    }
  }, [filters]);

  const tableData = dataSettlement.map((item, index) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    name: parseLang(item.hotel_name, "vi"),
    address: parseLang(item.hotel_address, "en"),
    month: item.period_month,
    status: STATUS_LABEL[item.status] ?? item.status,
    status_key: item.status,

    rooms: "-", // Placeholder
    total: item.closing_balance,
    hotel_id: item.hotel_id,
    _id: item.id,
    dueDate: item.confirm_deadline
      ? new Date(item.confirm_deadline).toLocaleDateString("vi-VN")
      : "",
  }));

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({ hotel_name: "", period_month: "", status: "all" });
    onResetFilter();
  };

  const handleTabChange = (statusValue: string) => {
    const newStatus = statusValue;
    setCurrentTab(newStatus);
    setLocalFilters((prev) => ({ ...prev, status: newStatus }));
    onFilterChange({ ...localFilters, status: newStatus });
  };

  const tabs = [
    { label: "Tất cả", value: "all" },
    { label: "Chưa đối soát", value: "draft" },
    { label: "Chờ xác nhận", value: "pending" }, // ← THÊM DÒNG NÀY
    { label: "Chờ thanh toán", value: "confirmed" }, // ← GIỮ NGUYÊN
    { label: "Thanh toán", value: "paid" }, // ← Đổi tên cho rõ hơn
    { label: "Hoàn thành", value: "completed" },
  ];
  function formatMonthYear(value) {
    if (!value) return "";

    const [year, month] = value.split("-");
    return `Tháng ${parseInt(month, 10)}, ${year}`;
  }
  const handlePublish = async (id) => {
    try {
      if (sendAll) {
        for (let i = 0; i < dataSettlement.length; i++) {
          const element = dataSettlement[i];
          if (element?.status == "draft") {
            await sendPubllish(element?.id);
          }
        }
        setSendAll(false)
        toast.success("Gửi tất cả thành công")
        fetchSettlements();
        setApproveDialogOpen(false);
      } else {
        let result = await sendPubllish(id || settlement?.id);
        console.log("AA result ", result);
        if (result?.confirm_deadline_days) {
          fetchSettlements();
          // setSettlement(null);
          setApproveDialogOpen(false);
          toast.success("Gửi thành công");
        } else {
          toast.error("Gửi thất bại");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const months = Array.from({ length: 12 }).map((_, index) => {
    const date = dayjs().subtract(index, "month");
    return {
      value: date.format("YYYY-MM"), // dữ liệu trả về (giữ nguyên như hiện tại)
      label: `Tháng ${date.format("MM.YYYY")}`, // label hiển thị
    };
  });


  // Desktop: Bảng gốc (giữ nguyên 100%)
  const renderDesktop = () => (
    <TableContainer
      sx={{
        maxHeight: "calc(100vh - 380px)",
        mt: 4,
        overflowX: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600, color: "#424242" }}>#</TableCell>
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
              align="right"
              sx={{ fontWeight: 600, color: "#424242" }}
            >
              Tổng công nợ
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 600, color: "#424242" }}
            >
              Hạn đối soát
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 600, color: "#424242" }}
            >
              {tableData.some((item) => item.status == "Chưa đối soát") ?
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => {
                    setSendAll(true)
                    setApproveDialogOpen(true);
                  }}
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    color: "white",
                    bgcolor: "#98b720",
                    "&:hover": { bgcolor: "#7cb342" },
                  }}
                >
                  Gửi tất cả
                </Button>
                : "Thao tác"}

            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography><CircularProgress sx={{ color: "#98B720" }} /></Typography>
              </TableCell>
            </TableRow>
          ) : tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <img src={empty} alt="" />
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row, i) => {
              const statusStyle = getStatusColor(row.status);

              return (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => {
                    setAction("detail");
                    setSettlement(dataSettlement[i]);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Typography sx={{
                      cursor: "pointer", transition: "transform 0.2s ease, background-color 0.2s ease", // mượt mà
                      "&:hover": {
                        transform: "scale(1.05)",
                        // hoặc dùng màu bạn thích, ví dụ: "rgba(0,0,0,0.04)"
                        // nếu muốn nổi bật hơn có thể thêm:
                        // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        // zIndex: 1,
                      },
                    }} color="#98B720" fontWeight="500">
                      {row.name}
                    </Typography>
                    {isMobile && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {row.address}
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.address}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>{formatMonthYear(row.month)}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 500,
                        height: 26,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.total < 0 ? "#e53935" : "#33AE3F",
                      fontWeight: 500,
                    }}
                  >
                    {formatCurrency(row.total)}
                  </TableCell>
                  <TableCell align="center">{row.dueDate}</TableCell>
                  <TableCell align="center">
                    {row.status_key === "draft" ? (
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettlement(dataSettlement[i]);
                          setApproveDialogOpen(true);
                        }}
                        size="small"
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          color: "white",
                          bgcolor: "#98b720",
                          "&:hover": { bgcolor: "#7cb342" },
                        }}
                      >
                        Gửi
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSettlement(dataSettlement[i])}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          color: "#98b720",
                          borderColor: "#98b720",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        Chi tiết
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile: Card dọc (UI đẹp, chuyên nghiệp)
  const renderMobile = () => (
    <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      {loading ? (
        <Typography align="center">Đang tải...</Typography>
      ) : tableData.length === 0 ? (
        <Typography align="center" color="#999" py={6}>
          Không có dữ liệu
        </Typography>
      ) : (
        tableData.map((row, i) => {
          const statusStyle = getStatusColor(row.status);

          return (
            <Paper
              onClick={row.status_key !== "draft" ? () => {
                setAction("detail");
                setSettlement(dataSettlement[i]);
              } : () => { }}
              key={row.id}
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
                onClick={() => {
                  setAction("detail");
                  setSettlement(dataSettlement[i]);
                }}
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
                <Stack>
                  <Typography variant="subtitle1" fontWeight="600">
                    {row.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.address}
                  </Typography>
                </Stack>

                <Chip
                  label={row.status}
                  size="small"
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    fontWeight: 500,
                    height: 26,
                  }}
                />
              </Box>

              <Divider />

              {/* Nội dung chính */}
              <Box sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Kỳ đối soát
                      </Typography>
                      <Typography fontWeight="500">{row.month}</Typography>
                    </Box>

                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Hạn đối soát
                      </Typography>
                      <Typography fontWeight="500">{row.dueDate}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Tổng công nợ
                    </Typography>
                    <Typography
                      fontWeight="600"
                      sx={{
                        color: row.total < 0 ? "#e53935" : "#333",
                      }}
                    >
                      {formatCurrency(row.total)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Thao tác */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#fafafa",
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                {row.status_key === "draft" ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {

                      setSettlement(dataSettlement[i]);
                      setApproveDialogOpen(true);
                    }}
                    size="small"
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      color: "white",
                      bgcolor: "#98b720",
                      "&:hover": { bgcolor: "#7cb342" },
                    }}
                  >
                    Gửi
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => {

                      setSettlement(dataSettlement[i])
                    }}
                    size="small"
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      color: "#98b720",
                      borderColor: "#98b720",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    Chi tiết
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })
      )}
    </Box>
  );
  return (
    <>
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
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
              onClick={() => setApproveDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Xác nhận gửi
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Hãy đảm bảo đầy đủ thông tin, trước khi gửi đối soát để tránh sai
            sót.
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
              handlePublish();
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Gửi
          </Button>
          <Button
            onClick={() => setApproveDialogOpen(false)}
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
      {action == "detail" && (
        <HotelDetailFinal
          settlement={settlement}
          setSettlement={setSettlement}
          isMobile={isMobile}
          fetchSettlements={fetchSettlements}
          handlePublish={handlePublish}
          setApproveDialogOpen={setApproveDialogOpen}
          setAction={setAction}
        />
      )}
      {action == "manager" && (
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
            <Typography variant={isMobile ? "h6" : 'h5'} fontWeight='600' color='#1a1a1a'>
              Quản lý đối soát
            </Typography>
            <Typography
              variant='body2'
              color='#e53935'
              sx={{ fontSize: isMobile ? "0.675rem" : "0.875rem" }}>
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
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "end" }}
              mb={3}>
              <Box>
                <Typography fontWeight={"bold"} mb={1}>Tìm kiếm</Typography>
                <TextField
                  placeholder='Tên khách sạn'
                  size='small'
                  value={localFilters.hotel_name}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      hotel_name: e.target.value,
                    })
                  }
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      height: 40,

                      borderRadius: 2,
                      fontWeight: 500,
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
              </Box>
              <Box >
                <Typography fontWeight={"bold"} mb={1}>Kì đối soát</Typography>

                <FormControl
                  size='small'
                  sx={{
                    height: 40,
                    width: { xs: "100%", md: "unset" },
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
                  <Select
                    sx={{ width: "100%" }}
                    value={localFilters.period_month || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        period_month: e.target.value,
                      })
                    }
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: "#999" }}> Chọn kỳ đối soát</span>;
                      }
                      return months.find(m => m.value === selected)?.label;
                    }}
                  >
                    <MenuItem value="">
                      <em> Chọn kỳ đối soát</em>
                    </MenuItem>

                    {months.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>

                </FormControl>
              </Box>

              <Box
                sx={{ display: "flex", gap: 1, ml: { md: "auto" }, pb: "5px" }}>
                <Button
                  variant='contained'
                  onClick={handleSearch}
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
                  onClick={handleReset}
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
              {tabs.map((tab) => {
                const isActive = currentTab === tab.value;
                return (
                  <Chip
                    key={tab.label}
                    label={tab.label}  // Chỉ hiển thị label, không có count
                    onClick={() => handleTabChange(tab.value)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      height: 36,
                      bgcolor: isActive ? "#F0F1F3" : "transparent",
                      color: "#555",
                      // border: isActive ? "none" : "1px solid #e0e0e0",
                      fontWeight: isActive ? "bold" : "normal",
                      "&:hover": {
                        bgcolor: isActive ? "transparent" : "#F0F1F3",
                      },
                    }}
                  />
                );
              })}
              {/* {tabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={
                    currentTab === tab.value ||
                    (tab.value === "all" && currentTab === "")
                      ? "contained"
                      : "outlined"
                  }
                  size='small'
                  onClick={() => handleTabChange(tab.value)}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    color:
                      currentTab === tab.value ||
                      (tab.value === "all" && currentTab === "")
                        ? "white"
                        : "#98b720",
                    borderColor: "#98b720",
                    bgcolor:
                      currentTab === tab.value ||
                      (tab.value === "all" && currentTab === "")
                        ? "#98b720"
                        : "transparent",
                    "&:hover": {
                      bgcolor:
                        currentTab === tab.value ||
                        (tab.value === "all" && currentTab === "")
                          ? "#1565c0"
                          : "#f5f5f5",
                    },
                  }}>
                  {tab.label}
                </Button>
              ))} */}
            </Stack>
            {isMobile ? renderMobile() : renderDesktop()}

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

function HotelDetailFinal({
  isMobile,
  setSettlement,
  settlement,
  fetchSettlements,
  handlePublish,
  setApproveDialogOpen,
  setAction,
}) {
  const [dataSettlementBooking, setDataSettlementBooking] = useState([]);
  const [openModalPay, setOpenModalPay] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  let [bankPrimary, setBankPrimary] = useState(null);
  const statusStyle = getStatusColor(STATUS_LABEL[settlement.status] ?? settlement.status);
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

  console.log("AAAAA settlement", settlement);


  // Desktop: Bảng gốc (giữ nguyên 100%)
  const renderDesktop = () => (
    <TableContainer sx={{ mt: 5, width: "100%", }}>
      <Table>
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
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSettlementBooking.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <Typography color="#999">Không có dữ liệu</Typography>
              </TableCell>
            </TableRow>
          ) : (
            dataSettlementBooking.map((row, index) => {
              const debt = row.partner_amount;
              const isNegative = debt < 0;

              return (
                <TableRow key={row.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.booking_code}</TableCell>
                  <TableCell>
                    {row.room_type_name} - {rentTypeLabel(row.rent_type)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#616161",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {formatDateTime(row.check_in)}
                    <br />
                    {formatDateTime(row.check_out)}
                  </TableCell>
                  <TableCell>{formatCurrency(row.booking_amount)}</TableCell>
                  <TableCell>{formatCurrency(row.booking_amount)}
                  <Typography color="#989FAD" fontSize={"13px"}>{row?.payment_method == "Cash" ? "Trả tại KS" : "Trả online"}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "#616161" }}>
                    {formatCurrency(row.commission_amount)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      color: isNegative ? "#E53935" : "#33AE3F",
                    }}
                  >
                    {isNegative
                      ? `-${formatCurrency(Math.abs(debt))}`
                      : formatCurrency(debt)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile: Card dọc (UI đẹp, gọn gàng)
  const renderMobile = () => (
    <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 3 }}>
      {dataSettlementBooking.length === 0 ? (
        <Typography align="center" color="#999" py={6}>
          Không có dữ liệu
        </Typography>
      ) : (
        dataSettlementBooking.map((row, index) => {
          const debt = row.partner_amount;
          const isNegative = debt < 0;

          return (
            <Paper
              key={row.id}
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #eee",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
              >
                <Stack>
                  <Typography variant="subtitle1" fontWeight="600">
                    {row.booking_code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.room_type_name} - {rentTypeLabel(row.rent_type)}
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              {/* Nội dung chính */}
              <Box sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography color="#616161" fontSize="0.875rem">
                      {formatDateTime(row.check_in)}
                      <br />
                      {formatDateTime(row.check_out)}
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tiền phòng
                      </Typography>
                      <Typography>{formatCurrency(row.booking_amount)}</Typography>
                    </Box>

                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Tổng thanh toán
                      </Typography>
                      <Typography>{formatCurrency(row.booking_amount)}</Typography>
                    </Box>
                  </Stack>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phí hoa hồng
                    </Typography>
                    <Typography color="#616161">
                      {formatCurrency(row.commission_amount)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Công nợ - nổi bật cuối card */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Công nợ
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: isNegative ? "#E53935" : "#98B720" }}
                >
                  {isNegative
                    ? `-${formatCurrency(Math.abs(debt))}`
                    : formatCurrency(debt)}
                </Typography>
              </Box>
            </Paper>
          );
        })
      )}
    </Box>
  );
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
                setAction("manager");
                setSettlement(null);
              }}
              sx={{ fontSize: 32, mr: 1, cursor: "pointer" }}
            />
            <Box>
              <Typography variant={isMobile ? "h6" : 'h5'} mr={1} fontWeight='bold'>
                {parseLang(settlement?.hotel_name)}
              </Typography>
              <Typography color="#5D6679">Tháng {settlement?.period_month?.split("-")?.[1]}</Typography>
            </Box>
            <Chip
              label={STATUS_LABEL[settlement.status] ?? settlement.status}
              size="small"
              sx={{
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                fontWeight: 500,
                height: 26,
              }}
            />
         
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
                <Typography variant='h6' fontWeight={500} color='#33AE3F'>
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
                <Typography variant='h6' fontWeight={700} color='#33AE3F'>
                  Tổng công nợ
                </Typography>
                <Typography variant='h5' fontWeight={700} color='#33AE3F'>
                  {formatCurrency(totalDebt)}
                </Typography>
              </Stack>

              <Typography
                variant='caption'
                color='#E53935'
                sx={{ lineHeight: 1.5 }}>
                <span style={{ color: "#33AE3F" }}>
                  {" "}
                  (+) Hotel Booking cần thanh toán cho KS
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
                    setApproveDialogOpen(true);
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
                    mt:{xs:0,md:7}
                  }}>
                  Gửi đối soát
                </Button>
              ) : (
                <>
                  {settlement?.status == "confirmed" ? (
                    <Button
                      variant='contained'
                      onClick={() => {
                        setOpenModalPay(true);
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
                        mt:{xs:0,md:10}
                      }}>
                      Thanh toán
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

        {isMobile ? renderMobile() : renderDesktop()}
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
      <ConfirmCompleteModal
        fetchSettlements={fetchSettlements}
        settlement={settlement}
        open={openModalPay}
        onClose={() => setOpenModalPay(false)}
        setSettlement={setSettlement}
      />
    </Box>
    </Box >
  );
}

import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Alert } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast } from "react-toastify";
function ConfirmCompleteModal({
  open = false,
  onClose = () => { },
  fetchSettlements,
  settlement,
  setSettlement,
}) {
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

  const handleConfirm = async () => {
    try {
      let result = await sendPay(settlement?.id);
      if (result?.message && !result?.code) {
        fetchSettlements(1);
        setSettlement(null);
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
            Xác nhận thanh toán
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ px: 4, pb: 3 }}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant='h6' fontWeight={600} color='#111' mb={4}>
            Thông tin tài khoản thanh toán
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

      {/* Nút hành động */}
      <DialogActions
        sx={{ px: 4, pb: 4, pt: 2, justifyContent: "end", gap: 2 }}>
        <Button
          variant='outlined'
          onClick={() => {
            onClose();
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
          Hủy
        </Button>

        <Button
          variant='contained'
          onClick={() => {
            handleConfirm();
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
          Hoàn thành
        </Button>
      </DialogActions>
    </Dialog>
  );
}
