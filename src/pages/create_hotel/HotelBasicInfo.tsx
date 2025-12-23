import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  Radio,
  FormControlLabel,
  RadioGroup,
  Card,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useBookingContext } from "../../App";

const businessTypes = ["Tình yêu", "Du lịch", "Homestay", "Camping"];

export default function HotelBasicInfo({setDataCreateHotel,
  dataCreateHotel,
  onTempChange,   
  errors = {},
  touched = {},
  onFieldBlur}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  /** ===============================
   * STATE TOÀN BỘ FORM
   =================================*/
  const [formData, setFormData] = useState({
    hotelName: "",
    phone: "",
    description: "",
    businessType: "Tình yêu",

    // Theo giờ
    hourlyStart: "",
    hourlyEnd: "",

    // Qua đêm
    overnightStart: "",
    overnightEnd: "",

    // Theo ngày
    dailyStart: "",
    dailyEnd: "",
  });
  const context = useBookingContext()
  useEffect(()=>{
    if(context?.state?.create_hotel?.hotelName){
      setFormData(context?.state?.create_hotel)
    }
  },[context])
  /** Cập nhật field */
  const updateField = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      onTempChange?.(newData); // ← báo ngay cho CreateHotelView
      return newData;
    });
  };

  const latestValue = useRef();

  useEffect(() => {
    latestValue.current = formData;
  }, [formData]);
  
  useEffect(() => {
    return () => {
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: { ...latestValue.current },
        },
      });
      
      console.log("unmount value:", latestValue.current); // ✔ lấy đúng giá trị mới nhất
    };
  }, []);
  console.log("formData",formData);
  /** HOURS OPTIONS */
  const HOURS = [
    "04:00", "05:00", "06:00", "07:00", "08:00",
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00",
  ];

 
  /** ===============================
   * COMPONENT RENDER CARD TIME
   =================================*/
  const renderTimeCard = (title, fields) => (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        width: "100%",
        border: "1px solid #E5E7EB",
      }}
    >
      <Typography
        fontWeight={600}
        color="#555"
        textAlign="center"
        mb={2}
        fontSize={15}
      >
        {title}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((item, i) => (
          <Box key={i}>
            <Typography fontSize={14} color="#444" mb={0.5}>
              {item.label}
            </Typography>

            {/* START TIME */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              alignItems="center"
            >
              <FormControl size="small" fullWidth>
                <Select
                  value={item.startValue}
                  onChange={(e) => item.onStartChange(e.target.value)}
                  displayEmpty
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={{ fontSize: 20, color: "#98b720" }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: 40,
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ddd",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#98b720",
                          borderWidth: 2,
                        },
                      }}
                    />
                  }
                >
                  <MenuItem disabled value="">
                    {item.startPlaceholder}
                  </MenuItem>

                  {HOURS.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography width={"20%"} fontSize={14} color="#555">
                ngày {item.startDay}
              </Typography>
            </Box>

            {/* END TIME */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              mt={1.5}
              alignItems="center"
            >
              <FormControl size="small" fullWidth>
                <Select
                  value={item.endValue}
                  onChange={(e) => item.onEndChange(e.target.value)}
                  displayEmpty
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={{ fontSize: 20, color: "#98b720" }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: 40,
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ddd",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#98b720",
                          borderWidth: 2,
                        },
                      }}
                    />
                  }
                >
                  <MenuItem disabled value="">
                    {item.endPlaceholder}
                  </MenuItem>

                  {HOURS.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography width={"20%"} fontSize={14} color="#555">
                ngày {item.endDay}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );

  /** ===============================
   * RENDER PAGE
   =================================*/
  return (
    <Box p={4} bgcolor={"white"} borderRadius={"15px"} width="100%">
      
      {/* Row: Tên + SĐT */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3} mb={3}>
        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Tên khách sạn
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên khách sạn"
            error={touched.hotelName && !!errors.hotelName}
            helperText={touched.hotelName ? errors.hotelName : " "}
            value={formData.hotelName}
            onBlur={() => onFieldBlur?.("hotelName")}
            onChange={(e) => updateField("hotelName", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                height: "50px",
                "&.Mui-focused fieldset": {
                  borderColor: "#98b720",
                  borderWidth: 1.5,
                },
              },
            }}
          />
        </Box>

        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Số điện thoại
          </Typography>
          <TextField
            fullWidth
            error={touched.phone && !!errors.phone}
            helperText={touched.phone ? errors.phone : " "}
            value={formData.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={() => onFieldBlur?.("phone")}
            placeholder="Nhập số điện thoại"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                height: "50px",
                "&.Mui-focused fieldset": {
                  borderColor: "#98b720",
                  borderWidth: 1.5,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Mô tả */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={0.8}>
          Mô tả (không bắt buộc)
        </Typography>
        <Typography fontSize={12}  mb={0.8}>
        Viết một đoạn giới thiệu ngắn gọn về khách sạn của bạn. Mô tả sẽ được hiển thị tại trang chủ của khách sạn trên Hotel Booking.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Nhập mô tả"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              "&.Mui-focused fieldset": {
                borderColor: "#98b720",
                borderWidth: 1.5,
              },
            },
          }}
        />
      </Box>

      {/* Loại hình kinh doanh */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={1.5}>
          Loại hình kinh doanh
        </Typography>

        <RadioGroup
          row
          value={formData.businessType}
          onChange={(e) => updateField("businessType", e.target.value)}
        >
          {businessTypes.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio sx={{ color: "#8BC34A !important" }} />}
              label={type}
              sx={{ mr: 4 }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Thời gian kinh doanh */}
      <Box mb={2}>
        <Typography fontSize={14} fontWeight={600} mb={2}>
          Thời gian kinh doanh
        </Typography>

        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3}>
          
          {/* Theo giờ */}
          {renderTimeCard("Theo giờ", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T",
              startValue: formData.hourlyStart,
              endValue: formData.hourlyEnd,
              onStartChange: (v) => updateField("hourlyStart", v),
              onEndChange: (v) => updateField("hourlyEnd", v),
            },
          ])}

          {/* Qua đêm */}
          {renderTimeCard("Qua đêm", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T+1",
              startValue: formData.overnightStart,
              endValue: formData.overnightEnd,
              onStartChange: (v) => updateField("overnightStart", v),
              onEndChange: (v) => updateField("overnightEnd", v),
            },
          ])}

          {/* Theo ngày */}
          {renderTimeCard("Theo ngày", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T+1",
              startValue: formData.dailyStart,
              endValue: formData.dailyEnd,
              onStartChange: (v) => updateField("dailyStart", v),
              onEndChange: (v) => updateField("dailyEnd", v),
            },
          ])}
        </Box>
      </Box>

      
    </Box>
  );
}
