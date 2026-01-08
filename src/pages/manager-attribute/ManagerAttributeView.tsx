import React, { useEffect, useRef, useState } from "react";
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
  Delete,
  CloudUpload,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import { useNavigate } from "react-router-dom";
import { createAccounts, updateAccounts } from "../../service/account";

function ActionMenu({
  attribute,
  setSelectedAttribute,
  setConfirmOpen,
  setModalOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    setSelectedAttribute(null);
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
            setModalOpen(true);
            setSelectedAttribute(attribute);
          }}>
          <Edit fontSize='small' sx={{ mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          sx={{ color: "red" }}
          onClick={(e) => {
            setSelectedAttribute(attribute);
            setConfirmOpen(true);
          }}>
          <Delete fontSize='small' sx={{ mr: 1.5 }} />
          Xóa cơ sở
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ManagerAttributeView({
  attribute,
  loading = false,
  fetchAttribute,
}) {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bed_type");
  const theme = useTheme();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (activeTab == "bed_type") {
      setData(attribute?.bed_type);
    }
    if (activeTab == "direction") {
      setData(attribute?.direction);
    }
    if (activeTab == "amenities") {
      setData(attribute?.amenities);
    }
  }, [activeTab, attribute]);

  const handleDeleteAttribute = async () => {
    try {
      let result = await deleteAttribute(selectedAttribute?.id, activeTab);
      if (result?.message && !result?.code) {
        setConfirmOpen(false);
        toast.success(result?.message);
        setSelectedAttribute(null);
        fetchAttribute();
      } else {
        toast.error(result?.message);
      }
      console.log("AAAA result handleDeleteAttribute", result);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("AAAA data", data);
  console.log("AAAA selectedAttribute", selectedAttribute);
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <AddEntryModal
        open={modalOpen}
        onClose={() => {
          setSelectedAttribute(null);
          setModalOpen(false);
        }}
        attribute={selectedAttribute}
        onSuccess={() => {
          setSelectedAttribute(null);
          fetchAttribute();
        }}
        setSelectedAttribute={setSelectedAttribute}
        activeTab={activeTab}
      />
      <Box
        mb={4}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        <Typography variant='h5' fontWeight='bold'>
          Thiết lập cơ sở
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
          Thêm cơ sở
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' fontWeight='bold' mb={3}>
          Danh sách cơ sở
        </Typography>

        <Box sx={{ display: "flex", gap: 4, my: 3 }}>
          <Typography
            fontSize={16}
            fontWeight={600}
            onClick={() => setActiveTab("bed_type")}
            color={activeTab == "bed_type" ? "#98B720" : "#999"}
            sx={{
              borderBottom:
                activeTab == "bed_type" ? "3px solid #98B720" : "none",
              pb: 0.5,
              cursor: "pointer",
            }}>
            Loại giường
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={600}
            onClick={() => setActiveTab("direction")}
            color={activeTab == "direction" ? "#98B720" : "#999"}
            sx={{
              borderBottom:
                activeTab == "direction" ? "3px solid #98B720" : "none",
              cursor: "pointer",
            }}>
            Hướng phòng
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={600}
            onClick={() => setActiveTab("amenities")}
            color={activeTab == "amenities" ? "#98B720" : "#999"}
            sx={{
              borderBottom:
                activeTab == "amenities" ? "3px solid #98B720" : "none",
              cursor: "pointer",
            }}>
            Tiện ích
          </Typography>
        </Box>

        {/* Bảng */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
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
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item, index) => (
                  <TableRow key={item.id} hover sx={{ cursor: "pointer" }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.id}</TableCell>

                    <TableCell sx={{ fontWeight: 500 }}>
                      {parseRoomName(item.name)}
                    </TableCell>

                    <TableCell
                      align='center'
                      onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        attribute={item}
                        setSelectedAttribute={setSelectedAttribute}
                        setConfirmOpen={setConfirmOpen}
                        setModalOpen={setModalOpen}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
      </Paper>

      {/* Modal chi tiết (có thể mở rộng sau) */}

      {/* Confirmation dialog ngừng/kích hoạt */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "center", p: 1 }}>
          <Box sx={{ position: "relative" }}>
            <img src={remove} alt='' />
            <Typography fontWeight={600} fontSize='20px' mb={1}>
              Bạn muốn xóa cơ sở này?
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
            Bạn có muốn xóa cơ sở này ngay bây giờ không? Bạn không thể hoàn tác
            hành động này.
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
              handleDeleteAttribute();
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
import { parseRoomName } from "../../utils/utils";

import { Grid } from "@mui/material";
import {
  addAttribute,
  deleteAttribute,
  updateAttribute,
} from "../../service/hotel";

function AddEntryModal({
  open,
  onClose,
  attribute,
  activeTab,
  onSuccess,
  setSelectedAttribute,
}) {
  const [formData, setFormData] = useState({
    key: "",
    vietnamese: "",
    korean: "",
    english: "",
    japanese: "",
    icon: null as File | null,
    iconPreview: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = "Key không được để trống";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.key)) {
      newErrors.key = "Key chỉ được chứa chữ, số và dấu _";
    }

    if (!formData.vietnamese.trim()) {
      newErrors.vietnamese = "Vui lòng nhập tên tiếng Việt";
    }

    if (!formData.english.trim()) {
      newErrors.english = "Vui lòng nhập tên tiếng Anh";
    }

    if (!formData.korean.trim()) {
      newErrors.korean = "Vui lòng nhập tên tiếng Hàn";
    }

    if (!formData.japanese.trim()) {
      newErrors.japanese = "Vui lòng nhập tên tiếng Nhật";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (attribute) {
      let name = attribute.name;
      setFormData({
        key: attribute.id || "",
        vietnamese: name.vi || "",
        korean: name.ko || "",
        japanese: name.ja || "",
        english: name.en || "",
        icon: null,
        iconPreview: attribute.icon || "",
      });
    } else {
      setFormData({
        key: "",
        vietnamese: "",
        korean: "",
        english: "",
        japanese: "",
        icon: null,
        iconPreview: "",
      });
    }
    setErrors({});
  }, [attribute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }

      // Kiểm tra kích thước file (ví dụ: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setFormData({
        ...formData,
        icon: file,
        iconPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveIcon = () => {
    setFormData({
      ...formData,
      icon: null,
      iconPreview: "",
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Tạo FormData để gửi file
      const formDataToSend = new FormData();

      // Thêm dữ liệu text
      formDataToSend.append("id", formData.key);
      formDataToSend.append("type", activeTab);
      formDataToSend.append(
        "name",
        JSON.stringify({
          vi: formData.vietnamese,
          ko: formData.korean,
          ja: formData.japanese,
          en: formData.english,
        })
      );

      // Thêm file icon nếu có
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      let result;
      if (attribute?.id) {
        // Nếu có icon mới thì thêm vào, nếu không thì không gửi
        if (formData.icon) {
          formDataToSend.append("id", formData.key);
        }
        result = await updateAttribute(formData.key, activeTab, formDataToSend);
      } else {
        result = await addAttribute(formDataToSend);
      }

      if (result?.message && !result?.code) {
        setSelectedAttribute(null);
        setFormData({
          key: "",
          vietnamese: "",
          korean: "",
          english: "",
          japanese: "",
          icon: null,
          iconPreview: "",
        });
        onSuccess();
        onClose();
        toast.success(result?.message);
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi lưu thông tin");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6' fontWeight='medium'>
            {attribute?.id ? "Chỉnh sửa cơ sở" : "Thêm cơ sở"}
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Key */}
            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Key
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                mb={1}>
                Nhập key cơ sở
              </Typography>
              <TextField
                fullWidth
                name='key'
                disabled={attribute?.id}
                value={formData.key}
                onChange={handleChange}
                error={!!errors.key}
                helperText={errors.key}
                placeholder='Nhập key cơ sở'
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
            </Grid>

            {/* Các ngôn ngữ - 2 cột */}
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Tên Tiếng Việt
              </Typography>
              <TextField
                fullWidth
                name='vietnamese'
                value={formData.vietnamese}
                onChange={handleChange}
                error={!!errors.vietnamese}
                helperText={errors.vietnamese}
                placeholder='Nhập tên cơ sở'
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Tên Tiếng Hàn
              </Typography>
              <TextField
                fullWidth
                name='korean'
                value={formData.korean}
                onChange={handleChange}
                error={!!errors.korean}
                helperText={errors.korean}
                placeholder='Nhập tên cơ sở'
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Tên Tiếng Anh
              </Typography>
              <TextField
                fullWidth
                name='english'
                value={formData.english}
                onChange={handleChange}
                error={!!errors.english}
                helperText={errors.english}
                placeholder='Nhập tên cơ sở'
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Tên Tiếng Nhật
              </Typography>
              <TextField
                fullWidth
                name='japanese'
                value={formData.japanese}
                onChange={handleChange}
                error={!!errors.japanese}
                helperText={errors.japanese}
                placeholder='Nhập tên cơ sở'
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
            </Grid>

            {/* Upload icon */}
            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Upload icon cơ sở
              </Typography>

              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  border: "2px dashed #ccc",
                  borderRadius: "16px",
                  padding: 3,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#98b720",
                    backgroundColor: "#f5f5f5",
                  },
                }}
                onClick={() => fileInputRef.current?.click()}>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='image/*'
                  style={{ display: "none" }}
                />

                {formData.iconPreview ? (
                  <Box>
                    <Box
                      component='img'
                      src={formData.iconPreview}
                      alt='Icon preview'
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                      }}
                    />
                    <Box display='flex' justifyContent='center'>
                      <Button
                        variant='outlined'
                        color='primary'
                        sx={{
                          border: "none",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}>
                        <Edit />
                      </Button>
                      <Button
                        sx={{
                          border: "none",
                        }}
                        variant='outlined'
                        color='error'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveIcon();
                        }}>
                        <Delete />
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <CloudUpload
                      sx={{ fontSize: 48, color: "#98b720", mb: 1 }}
                    />
                  </>
                )}
              </Box>

              {/* Hiển thị tên file nếu có */}
              {formData.icon && (
                <Typography
                  variant='caption'
                  color='text.secondary'
                  display='block'
                  mt={1}>
                  File đã chọn: {formData.icon.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              backgroundColor: "#98b720",
              "&:hover": { backgroundColor: "#98b720" },
              py: 1.5,
              borderRadius: "16px",
            }}>
            {attribute?.id ? "Cập nhật cơ sở" : "Thêm cơ sở"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
