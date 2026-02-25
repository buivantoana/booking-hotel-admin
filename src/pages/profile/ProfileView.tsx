// ProfileForm.jsx
import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useBookingContext } from "../../App";
import { userUpdate } from "../../service/admin";
import { updateAccounts } from "../../service/account";

const ProfileView = () => {
  // State cho các field
  const context = useBookingContext();
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  // Load dữ liệu từ context
  useEffect(() => {
    if (context?.state?.user) {
      const rawPhone = context.state.user.phone || "";
      // Giả sử phone trong DB là +84931966966 → cắt bỏ +84 → hiển thị 931966966
      const displayPhone = rawPhone.startsWith("+84")
        ? rawPhone.slice(3)
        : rawPhone;

      setFormData({
        fullName: context.state.user.name || "",
        phone: "0" + displayPhone,
        email: context.state.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [context]);

  // Hàm validate số điện thoại Việt Nam
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    const regex = /^(0[3|5|7|8|9][0-9]{8}|0[1-9][0-9]{8})$/; // 09x hoặc 0(3|5|7|8|9)x
    return regex.test(cleaned);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Chỉ cho phép nhập số ở field phone
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation số điện thoại
    const phoneInput = formData.phone.trim();
    if (!phoneInput) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng nhập số điện thoại!");
      setOpenSnackbar(true);
      return;
    }

    const cleanedPhone = phoneInput.replace(/\D/g, "");
    if (!validatePhone(cleanedPhone)) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Số điện thoại không hợp lệ! (Phải là 10 số, bắt đầu bằng 09x hoặc 03x,05x,07x,08x)"
      );
      setOpenSnackbar(true);
      return;
    }

    // Validation mật khẩu
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Mật khẩu mới và xác nhận không khớp!");
        setOpenSnackbar(true);
        return;
      }
      if (formData.newPassword.length < 6) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Mật khẩu mới phải ít nhất 6 ký tự!");
        setOpenSnackbar(true);
        return;
      }
      if (!formData.currentPassword) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Vui lòng nhập mật khẩu hiện tại!");
        setOpenSnackbar(true);
        return;
      }
    }

    // Chuẩn hóa số điện thoại gửi API: luôn thêm +84
    let apiPhone = cleanedPhone;
    if (apiPhone.startsWith("0")) {
      apiPhone = "+84" + apiPhone.slice(1); // 0931966966 → +84931966966
    } else {
      apiPhone = "+84" + apiPhone; // 931966966 → +84931966966
    }

    const payload = {
      name: formData.fullName,
      phone: apiPhone,
      password: formData.currentPassword || undefined,
    };

    try {
      const result = await updateAccounts(context.state.user.id, payload);
      if (!result?.code && result?.message) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Cập nhật hồ sơ thành công!");
        setOpenSnackbar(true);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("user")),
            name: formData.fullName,
            phone: apiPhone,
          })
        );
        context.dispatch({
          type: "LOGIN",
          payload: {
            ...context.state,
            user: {
              ...context.state.user,
              name: formData.fullName,
              phone: apiPhone,
            },
          },
        });
        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        throw new Error("API trả về lỗi");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Cập nhật thất bại! Vui lòng thử lại.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant='h5' mb={3} fontWeight='bold'>
        Hồ sơ cá nhân
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          p: { xs: 3, sm: 5 },
          mx: "auto",
        }}>
        <Grid container spacing={3}>
          {/* User ID - disabled */}
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              User ID
            </Typography>
            <TextField
              fullWidth
              value={context?.state?.user?.id}
              disabled
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

          {/* Tên của bạn */}
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Tên của bạn
            </Typography>
            <TextField
              fullWidth
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
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
              required
            />
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              variant='outlined'
              placeholder='931966966 hoặc 0931966966'
              error={formData.phone && !validatePhone(formData.phone)}
              helperText={
                formData.phone && !validatePhone(formData.phone)
                  ? "Số không hợp lệ (09x hoặc 03x,05x,07x,08x)"
                  : ""
              }
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Box display='flex' alignItems='center' gap={0.5}>
                      <Box
                        component='img'
                        src='https://flagcdn.com/w20/vn.png'
                        alt='VN'
                        sx={{ width: 20 }}
                      />
                      +84
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Email
            </Typography>
            <TextField
              fullWidth
              name='email'
              value={formData.email}
              disabled
              onChange={handleChange}
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
              type='email'
            />
          </Grid>

          {/* Mật khẩu hiện hành */}
          <Grid item xs={12}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Mật khẩu hiện hành
            </Typography>
            <TextField
              fullWidth
              name='currentPassword'
              type={showPassword.current ? "text" : "password"}
              placeholder='Mật khẩu hiện hành'
              value={formData.currentPassword}
              onChange={handleChange}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleClickShowPassword("current")}
                      edge='end'>
                      {showPassword.current ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Mật khẩu mới */}
          <Grid item xs={12}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              name='newPassword'
              type={showPassword.new ? "text" : "password"}
              placeholder='Mật khẩu mới'
              value={formData.newPassword}
              onChange={handleChange}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleClickShowPassword("new")}
                      edge='end'>
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Xác nhận mật khẩu mới */}
          <Grid item xs={12}>
            <Typography variant='subtitle2' color='text.secondary' mb={0.5}>
              Xác nhận mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              name='confirmPassword'
              type={showPassword.confirm ? "text" : "password"}
              placeholder='Xác nhận mật khẩu mới'
              value={formData.confirmPassword}
              onChange={handleChange}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                      edge='end'>
                      {showPassword.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Nút Cập nhật */}
          <Grid item xs={12} display={"flex"} justifyContent={"end"}>
            <Button
              variant='contained'
              onClick={handleSubmit}
              sx={{
                bgcolor: "#98b720",
                mt: 2,
                py: 1,
                width: {xs:"45%",md:"15%"},
                borderRadius: "40px",
                textTransform: "none",

                "&:hover": { bgcolor: "#43A047" },
              }}>
              Cập nhật
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileView;
