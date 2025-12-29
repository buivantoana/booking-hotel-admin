import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
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
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Close,
  CheckCircle,
  HighlightOff,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import { useNavigate } from "react-router-dom";
import { updateAccounts, updatePartner } from "../../service/account";

function ActionMenu({ account, onToggleStatus, onViewDetail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "#98b720",
          color: "#98b720",
          fontWeight: 500,
          minWidth: 110,
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
          },
        }}>
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            onViewDetail(account);
          }}>
          <DescriptionIcon fontSize='small' sx={{ mr: 1.5 }} />
          Chi tiết
        </MenuItem>

        {account.active ? (
          <MenuItem
            sx={{color:"red"}}
            onClick={(e) => {
              handleClose(e);
              onToggleStatus(account, false);
            }}>
            <HighlightOff fontSize='small' sx={{ mr: 1.5 }} />
            Ngừng hợp tác
          </MenuItem>
        ) : (
          <MenuItem
          sx={{color:"#98b720"}}
            onClick={(e) => {
              handleClose(e);
              onToggleStatus(account, true);
            }}>
            <CheckCircle fontSize='small' sx={{ mr: 1.5 }} />
            Tiếp tục hợp tác
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default function ManagerAccountView({
  accounts = [],
  pagination = { page: 1, total_pages: 1 },
  loading = false,
  onPageChange,
  filters,
  onFilterChange,
  onResetFilter,
  fetchAccounts,
}) {
  const [localFilters, setLocalFilters] = useState({ email: "" });
  const [currentTab, setCurrentTab] = useState("all"); // all | active | inactive
  const [action, setAction] = useState("manager");
  // State cho modal chi tiết và xác nhận trạng thái
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null); // true: active, false: inactive
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (filters) {
      setLocalFilters({ email: filters.email || "" });
    }
  }, [filters]);

  // Lọc theo tab
  const filteredAccounts = accounts.filter((acc) => {
    if (currentTab === "active") return acc.active === 1;
    if (currentTab === "inactive") return acc.active === 0;
    return true; // all
  });

  // Lọc theo tìm kiếm email
  const displayedAccounts = filteredAccounts.filter((acc) =>
    acc.email.toLowerCase().includes(localFilters.email.toLowerCase())
  );

  const paginatedAccounts = displayedAccounts.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const handleSearch = () => {
    onFilterChange({ email: localFilters.email });
  };

  const handleReset = () => {
    setLocalFilters({ email: "" });
    onResetFilter();
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    // Nếu cần gọi API với filter active, bạn có thể thêm param ở đây
  };

  const handleViewDetail = (account) => {
    setSelectedAccount(account);
    setDetailOpen(true);
  };

  const handleToggleStatus = (account, newStatus) => {
    setSelectedAccount(account);
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const confirmToggleStatus = async () => {
    // TODO: Gọi API thật ở đây (ví dụ: updateAccountStatus(account.id, pendingStatus))
    toast.success(
      pendingStatus
        ? "Đã kích hoạt lại tài khoản thành công!"
        : "Đã ngừng hợp tác với tài khoản này!"
    );

    // Cập nhật local (giả lập)
    fetchAccounts(); // reload data

    setConfirmOpen(false);
    setPendingStatus(null);
  };

  const tabs = [
    { label: "Tất cả", value: "all" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Ngừng hợp tác", value: "inactive" },
  ];
  const handlePause = async () => {
    try {
      let result = await updatePartner(selectedAccount.id, {
        active: selectedAccount.active == 1 ? false : true,
      });
      if (result?.message && !result?.code) {
        setConfirmOpen(false);
        fetchAccounts();
        toast.success(result?.message);
      } else {
        toast.success(result?.message);
      }
      console.log("AAA result", result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant='h5' fontWeight='bold' mb={4}>
        Quản lý tài khoản
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' fontWeight='bold' mb={3}>
          Danh sách tài khoản
        </Typography>

        {/* Bộ lọc */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems='end'
          mb={4}>
          <Box>
            <Typography sx={{ mb: 1 }}>Tìm kiếm</Typography>
            <TextField
              placeholder='Nhập email'
              value={localFilters.email}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, email: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: "#999" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "24px",
                  bgcolor: "#fff",
                  "& fieldset": { borderColor: "#cddc39" },
                },
              }}
            />
          </Box>

          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              onClick={handleSearch}
              sx={{
                bgcolor: "#98b720",
                borderRadius: "24px",
                minWidth: 120,
                height: 40,
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
                border: "1px solid #d0d3d9",
                bgcolor: "#f0f1f3",
                color: "black",
              }}>
              Xóa tìm kiếm
            </Button>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Stack direction='row' gap={1.5} mb={4} flexWrap='wrap'>
          {tabs.map((tab) => (
            <Chip
              key={tab.value}
              label={`${tab.label} ${
                tab.value === "all"
                  ? accounts.length
                  : tab.value === "active"
                  ? accounts.filter((a) => a.active).length
                  : accounts.filter((a) => !a.active).length
              }`}
              onClick={() => handleTabChange(tab.value)}
              sx={{
                cursor: "pointer",
                bgcolor: currentTab === tab.value ? "#98b720" : "transparent",
                color: currentTab === tab.value ? "white" : "#666",
                fontWeight: currentTab === tab.value ? "bold" : "normal",
              }}
            />
          ))}
        </Stack>

        {/* Bảng */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng thái</strong>
                </TableCell>
                <TableCell>
                  <strong>Số lượng khách sạn</strong>
                </TableCell>
                <TableCell>
                  <strong>Số điện thoại</strong>
                </TableCell>
                <TableCell align='center'>
                  <strong></strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : displayedAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAccounts.map((account, index) => (
                  <TableRow
                    key={account.id}
                    hover
                    onClick={() => handleViewDetail(account)}
                    sx={{ cursor: "pointer" }}>
                    <TableCell>
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {account.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          account.active ? "Đang hoạt động" : "Ngừng hợp tác"
                        }
                        sx={{
                          bgcolor: account.active ? "#e8f5e9" : "#ffebee",
                          color: account.active ? "#4caf50" : "#f44336",
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                    <TableCell>{account.hotel_count || 0}</TableCell>
                    <TableCell>{account.phone || "-"}</TableCell>
                    <TableCell
                      align='center'
                      onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        account={account}
                        onViewDetail={() => {
                          navigate(`/manager-hotel?email=${account.email}`);
                        }}
                        onToggleStatus={handleToggleStatus}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={pagination.total_pages || 1}
            page={pagination.page || 1}
            onChange={onPageChange}
            siblingCount={1}
            boundaryCount={1}
            size={isMobile ? "medium" : "large"}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#98b720 !important",
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(139,195,74,0.4)",
              },
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                margin: "0 4px",
              },
            }}
          />
        </Stack>
      </Paper>

      {/* Modal chi tiết (có thể mở rộng sau) */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth='sm'
        fullWidth>
        <DialogContent>
          <IconButton
            onClick={() => setDetailOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' gutterBottom>
            Chi tiết tài khoản
          </Typography>
          {selectedAccount && (
            <Box mt={2} display={"flex"} flexDirection={"column"} gap={"10px"}>
              <Typography>
                <strong>Email:</strong> {selectedAccount.email}
              </Typography>
              <Typography>
                <strong>Tên:</strong> {selectedAccount.name}
              </Typography>
              <Typography>
                <strong>Vai trò:</strong> {selectedAccount.role}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong>{" "}
                {selectedAccount.active ? "Đang hoạt động" : "Ngừng hợp tác"}
              </Typography>
              <Typography>
                <strong>Số khách sạn:</strong>{" "}
                {selectedAccount.hotel_count || 0}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog ngừng/kích hoạt */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "center", p: 1 }}>
          <Box sx={{ position: "relative" }}>
            <img src={selectedAccount?.active == 0 ? success : remove} alt='' />
            <Typography fontWeight={600} fontSize='20px' mb={1}>
              Bạn Chắc chứ?
            </Typography>
            <IconButton
              onClick={() => setConfirmOpen(false)}
              sx={{ position: "absolute", top: -5, right: 0 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, padding: 1 }}>
          <Typography fontSize='14px' textAlign={"center"} color='#666'>
            {selectedAccount?.active == 0
              ? `Sau khi tiếp tục hợp tác, khách sẽ nhìn thấy lại toàn bộ khách sạn của tài khoản này.
Chủ khách sạn có thể ngừng hợp tác lại trong tương lai.`
              : ` Khách sẽ không nhìn thấy toàn bộ khách sạn của tài khoản này sau khi bạn ngừng hợp tác khách sạn. Chủ khách sạn có thể hợp tác lại trong tương lai.`}
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
              handlePause();
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            {selectedAccount?.active == 0
              ? "Xác nhận tiếp tục hợp tác"
              : "Xác nhận ngừng hợp tác"}
          </Button>
          <Button
            onClick={() => setConfirmOpen(false)}
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
    </Box>
  );
}
