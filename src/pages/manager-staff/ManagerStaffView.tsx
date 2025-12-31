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
  Select,
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
  Add,
  Edit,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import { useNavigate } from "react-router-dom";
import { createAccounts, updateAccounts } from "../../service/account";

function ActionMenu({
  account,
  onToggleStatus,
  onViewDetail,
  setSelectedAccount,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    setSelectedAccount(null);
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
          <Edit fontSize='small' sx={{ mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>

        {account.active ? (
          <MenuItem
          sx={{color:"red"}}
            onClick={(e) => {
              handleClose(e);
              onToggleStatus(account, false);
            }}>
            <HighlightOff fontSize='small' sx={{ mr: 1.5 }} />
            Khóa tài khoản
          </MenuItem>
        ) : (
          <MenuItem
          sx={{color:"#98b720"}}
            onClick={(e) => {
              handleClose(e);
              onToggleStatus(account, true);
            }}>
            <CheckCircle fontSize='small' sx={{ mr: 1.5 }} />
            Mở tài khoản
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default function ManagerStaffView({
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
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

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
      let result = await updateAccounts(selectedAccount.id, {
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
      <AccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        account={selectedAccount}
        onSuccess={() => {
          fetchAccounts();
          setSelectedAccount(null);
        }}
      />
      <Box
        mb={4}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        <Typography variant='h5' fontWeight='bold'>
          Quản lý nhân viên
        </Typography>

        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={() => {
            setModalOpen(true);
          }}
          sx={{
            backgroundColor: "#98b720", // xanh lá chính xác như hình
            "&:hover": {
              backgroundColor: "#98b720",
            },
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 24px",
            borderRadius: "12px", // bo tròn mạnh
            textTransform: "none", // không in hoa tự động
            boxShadow: "none",
            "& .MuiSvgIcon-root": {
              fontSize: "28px", // icon lớn hơn một chút
            },
          }}>
          Thêm người dùng
        </Button>
      </Box>

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
              label={`${tab.label} ${tab.value === "all"
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
                displayedAccounts.map((account, index) => (
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
                        setSelectedAccount={setSelectedAccount}
                        onViewDetail={() => {
                          setSelectedAccount(account);
                          setModalOpen(true);
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
         {selectedAccount?.active == 1?` Bạn muốn khóa tài khoản này?`:` Bạn muốn mở khoản này?`}  
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
            {selectedAccount?.active == 1
              ? `Bạn có muốn khóa tài khoản này ngay bây giờ không?
              Bạn không thể hoàn tác hành động này.`
              : ` Bạn có muốn mở tài khoản này ngay bây giờ không?
              Bạn không thể hoàn tác hành động này.`}
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
            Xác nhận tiếp tục
             
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

import { FormControl, InputLabel } from "@mui/material";

import axios from "axios"; // hoặc dùng fetch

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  account?: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "accountant";
  } | null; // null = thêm mới, có data = chỉnh sửa
  onSuccess?: () => void; // callback sau khi thành công
}

const AccountModal: React.FC<AccountModalProps> = ({
  open,
  onClose,
  account,
  onSuccess,
}) => {
  const isEdit = !!account;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin" as "admin" | "accountant",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        email: account.email || "",
        phone: account.phone || "",
        role: account.role || "admin",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "admin",
        password: "",
        confirmPassword: "",
      });
    }
  }, [account]);

  const handleChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
      };

  const handleRoleChange = (e: any) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    } else {
      if (formData.password && formData.password == formData.confirmPassword)
        payload.password = formData.password;
    }

    try {
      let result;
      if (isEdit && account?.id) {
        // API chỉnh sửa (PUT)
        result = await updateAccounts(account?.id, payload);
      } else {
        // API thêm mới (POST)
        result = await createAccounts(payload);
      }

      if (result?.message && !result?.code) {
        onSuccess?.();
        onClose();
        toast.success(result?.message);
      } else {
        toast.error(result?.message);
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lưu thông tin tài khoản."
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6' fontWeight='bold'>
            {isEdit ? "Chỉnh sửa thông tin" : "Thêm mới tài khoản"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box display='grid' gridTemplateColumns='1fr 1fr' gap={2} mt={1}>
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Tên người dùng
            </Typography>
            <TextField

              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
              required
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Email
            </Typography>
            <TextField

              type='email'
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
              required
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
            />
          </Box>
          <Box >
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Số điện thoại
            </Typography>
            <TextField

              value={formData.phone}
              onChange={handleChange("phone")}
              fullWidth
              required
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Vai trò
            </Typography>
            <FormControl fullWidth required>

              <Select
                sx={{

                  height: 45,
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  // "& .MuiOutlinedInput-notchedOutline": {
                  //   borderColor: "#cddc39", // Màu đỏ mặc định (có thể dùng #f44336, #d32f2f...)
                  //   borderWidth: "1px",
                  // },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cddc39", // Hover: đỏ đậm hơn
                    borderWidth: "1px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cddc39 !important", // QUAN TRỌNG: Focus vẫn màu đỏ rực
                    borderWidth: "1px !important",
                  },
                  // Tùy chọn: đổi màu mũi tên dropdown cho đồng bộ
                  // "& .MuiSelect-icon": {
                  //   color: "#cddc39",
                  // },
                  // Nếu có label, giữ màu khi focus
                  "&.Mui-focused .MuiInputLabel-root": {
                    color: "#cddc39",
                  },
                }}
                value={formData.role}
                onChange={handleRoleChange}
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='accountant'>Kế toán</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <>
          <Box mt={2}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Mật khẩu mới

            </Typography>
            <TextField

              type='password'
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
              required
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
                
              }}
            />
          </Box>
          <Box mt={2}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Xác nhận mật khẩu

            </Typography>
            <TextField

              type='password'
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              fullWidth
              required
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
                
              }}
            />
          </Box>
        </>

        <Box mt={4}>
          <Button
            variant='contained'
            fullWidth
            size='large'
            sx={{
              backgroundColor: "#98b720",
              "&:hover": { backgroundColor: "#98b720" },
              py: 1.5,
              borderRadius: "16px",
            }}
            onClick={handleSubmit}>
            {isEdit ? "Cập nhật thông tin" : "Thêm mới tài khoản"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
