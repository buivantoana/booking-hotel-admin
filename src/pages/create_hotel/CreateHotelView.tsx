import {
  Button,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
type Props = {};

const CreateHotelView = ({ submitCreateHotel }) => {
  const [step, setStep] = useState(1);
  const [typeHotel, setTypeHotel] = useState("Khách sạn Listing");
  const context = useBookingContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleStepClick = (id) => {
    console.log("Bạn vừa chọn step:", id);
    setStep(id);
  };
  const handleSelectType = (name) => {
    console.log("Bạn đã chọn loại khách sạn", name);
    setTypeHotel(name);
  };
  const persistedData = context?.state?.create_hotel || {};

  // Dữ liệu tạm của step hiện tại (luôn mới nhất)
  const [tempData, setTempData] = useState(persistedData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Đồng bộ khi chuyển step
  useEffect(() => {
    setTempData(persistedData);
    // Optional: reset touched khi chuyển step
    setTouched({});
  }, [step, persistedData]);

  // Hàm helper để đánh dấu field đã được touch
  const markAsTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const [canNext, setCanNext] = useState(true);
  const [stepErrors, setStepErrors] = useState({});

  useEffect(() => {
    let isValid = true;
    let errors: any = {};
    if (step === 2) {
      const result = validateBasicInfo(tempData);
      errors = result.errors;
      isValid = result.isValid;
    } else if (step === 3) {
      const result = validateImageUpload(tempData);
      errors = result.errors;
      isValid = result.isValid;
    } else if (step === 4) {
      const result = validateLocation(tempData);
      errors = result.errors;
      isValid = result.isValid;
    } else if (step === 5) {
      const result = validateRoomTypes(tempData);
      errors = result.errors;
      isValid = result.isValid;
    } else {
      setCanNext(true);
    }
    setStepErrors(errors);
    setCanNext(isValid);
  }, [tempData, step]);

  const handleNext = async () => {
    if (step === 2) {
      setTouched({
        hotelName: true,
        phone: true,
        businessHours: true,
      });
    }
    if (step === 3) {
      setTouched((prev) => ({
        ...prev,
        outsideImages: true,
        hotelImages: true,
        submitAttempt: true,
      }));
    }
    if (step === 4) {
      setTouched((prev) => ({
        ...prev,
        selectedProvince: true,
        selectedDistrict: true,
        address: true,
        map: true,
        submitAttempt: true,
      }));
    }
    if (step === 5) {
      const allTouched: Record<string, boolean> = { submitAttempt: true };
      tempData.roomTypes?.forEach((_: any, index: number) => {
        allTouched[`room_${index}_name`] = true;
        allTouched[`room_${index}_quantity`] = true;
        allTouched[`room_${index}_area`] = true;
        allTouched[`room_${index}_bedType`] = true;
        allTouched[`room_${index}_direction`] = true;
        allTouched[`room_${index}_description`] = true;
        allTouched[`room_${index}_images`] = true;
        allTouched[`room_${index}_pricing`] = true;
      });
      setTouched((prev) => ({ ...prev, ...allTouched }));
      setStep(step + 1);
      try {
        setLoading(true);
        let result = await submitCreateHotel(context?.state?.create_hotel);
        if (result.success) {
          toast.success("Tạo khách sạn thành công!");
        } else {
          setStep(step - 1);
        }

        // Xóa context nếu muốn
      } catch (err) {
        console.error(err);
        toast.error(err?.message);
      } finally {
        setLoading(false);
      }
    }
    if (canNext) {
      // Khi nhấn Kế tiếp → ép lưu ngay vào context (đảm bảo dữ liệu mới nhất)
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: tempData,
      });
      if (step !== 5) {
        setStep(step + 1);
      }
    }
  };
  console.log("AAAA context", context?.state?.create_hotel);
  return (
    <Box sx={{ background: "#f7f7f7" }}>
      <Container maxWidth='lg' sx={{ py: 4, minHeight: "100vh" }}>
        {step < 6 && (
          <>
            <Typography fontSize={"32px"} fontWeight={"600"}>
              Tạo khách sạn
            </Typography>
            <Typography fontSize={"16px"} mt={1} color='#989FAD'>
              Để bắt đầu, vui lòng nhập các thông tin bên dưới về khách sạn của
              bạn.
            </Typography>
          </>
        )}

        {step < 6 && (
          <StepIndicator activeStep={step} onStepChange={handleStepClick} />
        )}
        <Box sx={{ my: 2 }}>
          {step == 1 && (
            <HotelTypeSelect
              typeHotel={typeHotel}
              onSelect={handleSelectType}
            />
          )}
          {step == 2 && (
            <HotelBasicInfo
              dataCreateHotel={persistedData}
              setDataCreateHotel={() => {}}
              onTempChange={setTempData} //
              errors={stepErrors}
              touched={touched}
              onFieldBlur={markAsTouched}
            />
          )}
          {step == 3 && (
            <HotelImageUpload
              onTempChange={setTempData}
              errors={stepErrors}
              touched={touched}
              onFieldTouch={(field) =>
                setTouched((prev) => ({ ...prev, [field]: true }))
              }
            />
          )}
          {step == 4 && (
            <HotelLocationInput
              onTempChange={setTempData}
              errors={stepErrors}
              touched={touched}
              onFieldTouch={(field) =>
                setTouched((prev) => ({ ...prev, [field]: true }))
              }
            />
          )}
          {step == 5 && (
            <RoomTypeTabsModern
              onTempChange={setTempData}
              errors={stepErrors}
              touched={touched}
              onFieldTouch={(field) =>
                setTouched((prev) => ({ ...prev, [field]: true }))
              }
            />
          )}
          {step == 6 && <CreateSuccess />}
        </Box>
        {step < 6 && (
          <Box my={5} display={"flex"} justifyContent={"space-between"}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              color='#FF3030'
              onClick={() => {
                navigate("/");
              }}>
              <LoginIcon color='#FF3030' /> Trở về
            </Typography>
            <Button
              fullWidth
              variant='contained'
              disabled={!canNext || loading}
              onClick={handleNext}
              sx={{
                background: "#8BC34A",
                color: "white",
                py: 1.4,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 3,
                width: "150px",
                textTransform: "none",
                "&:hover": {
                  background: "#7CB342",
                },
              }}>
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                  Đang tạo...
                </>
              ) : (
                "Kế tiếp"
              )}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CreateHotelView;

import { Box, useMediaQuery } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import HotelTypeSelect from "./HotelTypeSelect";
import HotelBasicInfo from "./HotelBasicInfo";
import HotelImageUpload from "./HotelImageUpload";
import HotelLocationInput from "./HotelLocationInput";
import RoomTypeTabsModern from "./RoomTypeManager";

const steps = [
  { id: 1, label: "Hình thức hợp tác" },
  { id: 2, label: "Thông tin cơ bản" },
  { id: 3, label: "Hình ảnh khách sạn" },
  { id: 4, label: "Vị trí khách sạn" },
  { id: 5, label: "Thêm loại phòng" },
];

function StepIndicator({ activeStep = 1, onStepChange }) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleClick = (stepId) => {
    if (onStepChange) onStepChange(stepId);
  };

  return (
    <Box
      display='flex'
      flexDirection={isMobile ? "column" : "row"}
      alignItems='center'
      justifyContent='start'
      gap={isMobile ? 2 : 4}
      width='100%'
      py={3}>
      {steps.map((step, index) => {
        const isCompleted = step.id < activeStep;
        const isActive = step.id === activeStep;

        return (
          <Box
            key={step.id}
            display='flex'
            alignItems='center'
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => handleClick(step.id)}>
            {/* Icon số hoặc check */}
            <Box
              width={32}
              height={32}
              borderRadius='50%'
              display='flex'
              alignItems='center'
              justifyContent='center'
              sx={{
                backgroundColor: isActive
                  ? "#9AC33C"
                  : isCompleted
                  ? "#9AC33C"
                  : "transparent",
                color: isActive ? "white" : "#666",
                fontWeight: 600,
                fontSize: 14,
                border: isActive
                  ? "1px solid transparent"
                  : isCompleted
                  ? "1px solid transparent"
                  : "1px solid #888",
              }}>
              {isCompleted ? (
                <CheckIcon sx={{ fontSize: 20, color: "white" }} />
              ) : (
                step.id
              )}
            </Box>

            {/* Text label */}
            <Typography
              fontSize={14}
              fontWeight={isActive ? 600 : 400}
              color={isActive ? "#9AC33C" : "#888"}>
              {step.label}
            </Typography>

            {/* Dấu gạch nối (desktop only) */}
            {index < steps.length - 1 && !isMobile && (
              <Box
                sx={{
                  width: 40,
                  height: 1,
                  mt: 0.5,
                  borderBottom: "2px dashed #ccc",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

import { Stack, Paper } from "@mui/material";

import success from "../../images/Frame 1321317962.png";
import { useBookingContext } from "../../App";
import {
  validateBasicInfo,
  validateImageUpload,
  validateLocation,
  validateRoomTypes,
} from "../../utils/utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateSuccess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}>
      <Container maxWidth='sm'>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            bgcolor: "white",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}>
          <Stack spacing={3} alignItems='center'>
            {/* ICON CHECK XANH */}
            <Box>
              <img src={success} alt='' />
            </Box>

            {/* TIÊU ĐỀ */}
            <Typography
              fontWeight={700}
              fontSize={{ xs: "1.25rem", sm: "1.5rem" }}
              color='rgba(152, 183, 32, 1)'>
              Đăng ký thành công
            </Typography>

            {/* MÔ TẢ */}
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
              Chúc mừng, bạn đã hoàn thành tạo khách sạn trên Hotel Booking.
              Tiếp theo, chúng tôi sẽ xử lý thông tin khách sạn của bạn trong
              thời gian sớm nhất.
            </Typography>
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
              <strong>Nếu duyệt thành công</strong>: Khách sạn của bạn tự động
              được hiển thị trên app và website chính thức của Hotel Booking.
            </Typography>
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
              <strong>Nếu duyệt không thành công</strong>: Hotel Booking sẽ liên
              hệ với khách sạn để xác thực thông tin
            </Typography>
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
              Hotline bộ phận CSKH:{" "}
              <Typography
                variant='span'
                fontWeight={600}
                color='rgba(234, 106, 0, 1)'>
                1900 638 838
              </Typography>
            </Typography>

            {/* THÔNG TIN CHI TIẾT */}

            {/* NÚT HÀNH ĐỘNG */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              width='100%'
              mt={2}>
              <Button
                onClick={() => {
                  navigate("/");
                }}
                fullWidth
                variant='contained'
                sx={{
                  bgcolor: "#98b720",
                  color: "white",
                  borderRadius: "50px",
                  fontWeight: 600,
                  textTransform: "none",
                  py: 1.5,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 12px rgba(152, 183, 32, 0.3)",
                  "&:hover": {
                    bgcolor: "#7a9a1a",
                  },
                }}>
                Đồng ý
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
