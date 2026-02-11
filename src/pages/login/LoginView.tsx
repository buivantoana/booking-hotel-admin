import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Link,
  useTheme,
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagIcon from "@mui/icons-material/Flag";
import image_left from "../../images/Frame 1321317999.png";
import google from "../../images/Social media logo.png";
import apple from "../../images/Group.png";
import vn from "../../images/VN - Vietnam.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Login, LoginGoogle, checkUser } from "../../service/admin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../App";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getErrorMessage } from "../../utils/utils";

const GOOGLE_CLIENT_ID =
  "285312507829-8puo8pp5kikc3ahdivtr9ehq1fm3kkks.apps.googleusercontent.com";
const LoginView = () => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState("register"); // 'register' or 'pin'
  const [phoneNumber, setPhoneNumber] = useState("");

  return <>{currentStep === "register" && <RegistrationForm />}</>;
};

export default LoginView;
const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const context = useBookingContext();
  const navigate = useNavigate();
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const isValidEmail = (value: string): boolean => {
    if (!value) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  const getEmailError = () => {
    if (!touchedEmail) return false;
    if (!email) return "Email không được để trống";
    if (!isValidEmail(email)) return "Email không đúng định dạng";
    return false;
  };

  const getPasswordError = () => {
    if (!touchedPassword) return false;
    if (!password) return "Mật khẩu không được để trống";
    return false;
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      let result = await Login({
        email: email,
        password: password,
      });
      if (result?.access_token) {
        localStorage.setItem("access_token", result.access_token);

        localStorage.setItem("user", JSON.stringify(result.account));
        context.dispatch({
          type: "LOGIN",
          payload: {
            ...context.state,
            user: { ...result.account },
          },
        });
        toast.success("Đăng nhập thành công");
      } else {
        toast.error(getErrorMessage(result?.code) || result?.message );
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Container
      maxWidth='lg'
      sx={{ display: "flex", alignItems: "center", py: 5, minHeight: "100vh" }}>
      <Grid
        container
        sx={{
          alignItems: "center",
          minHeight: "60vh",
        }}>
        {/* LEFT ILLUSTRATION */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "start",
          }}>
          <Box
            component='img'
            src={image_left}
            alt='Hotel illustration'
            sx={{
              width: "592px",
              height: "557px",
              maxWidth: "100%",
            }}
          />
        </Grid>

        {/* RIGHT FORM */}
        <Grid
          item
          sx={{ display: "flex", justifyContent: "end" }}
          xs={12}
          md={6}>
          <Box
            sx={{
              px: { xs: 3, sm: 4, md: 0 },
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", sm: "400px", md: "486px" },
            }}>
            <Typography
              sx={{ fontSize: { xs: "28px", md: "32px" } }}
              fontWeight={700}
              mb={1}>
              Đăng nhập
            </Typography>

            <Box>
              {/* SỐ ĐIỆN THOẠI */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder='Nhập email của khách sạn'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouchedEmail(true)}
                error={!!getEmailError()}
                helperText={getEmailError() || " "}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    height: "60px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />

              {/* Birth date */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder='Nhập mật khẩu'
                type={showPassword ? "text" : "password"} // ← Toggle type
                onBlur={() => setTouchedPassword(true)}
                error={!!getPasswordError()}
                helperText={getPasswordError() || " "}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    height: "60px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()} // ngăn focus mất
                        edge="end"
                        sx={{ color: "#666" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label='Duy trì đăng nhập'
                />
              </FormGroup>

              <Button
                onClick={handleRegister}
                variant='contained'
                fullWidth
                disabled={!email || !password}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: "16px",
                  backgroundColor: !email ? "#e0e0e0" : "#98b720",
                  color: !email ? "#888" : "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "18px",
                  height: "56px",
                  "&:hover": {
                    backgroundColor: !email ? "#e0e0e0" : "#98b720",
                  },
                  boxShadow: "none",
                }}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                    Đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              {/* <Typography sx={{ fontSize: "14px" }} color='text.secondary'>
                <Link
                  href='/register'
                  sx={{
                    color: "#ff7a00",
                    fontWeight: 500,
                    textDecoration: "underline",
                    "&:hover": { textDecoration: "underline" },
                  }}>
                  Đăng Ký trở thành đối tác Hotel Booking
                </Link>
              </Typography> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

// GoogleCustomButton.tsx
