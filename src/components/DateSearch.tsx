"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Button,
  Typography,
  Popper,
  ClickAwayListener,
  Container,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "dayjs/locale/vi";
/* ================== TYPES ================== */

export interface DateRangeValue {
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
}

interface SimpleDateSearchBarProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  type: "hourly" | "overnight" | "daily"; // Loại booking
}

/* ================== DATE RANGE PICKER ================== */

interface DateRangePickerProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  value: DateRangeValue;
  onClose: () => void;
  onApply: (value: DateRangeValue) => void;
  type: "hourly" | "overnight" | "daily";
}

const DateRangePicker = ({
  open,
  anchorEl,
  value,
  onClose,
  onApply,
  type,
  restrictToFuture = false,
}: DateRangePickerProps) => {
  const [checkIn, setCheckIn] = useState<Dayjs | null>(value.checkIn || dayjs());
  const [checkOut, setCheckOut] = useState<Dayjs | null>(value.checkOut || null);
  const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
  const today = dayjs().startOf("day");
  useEffect(() => {
    setCheckIn(value.checkIn || dayjs());
    setCheckOut(value.checkOut || null);
    setSelecting("checkIn");
  }, [value, open]);

  // 1. THEO GIỜ: Chỉ chọn 1 ngày
  const handleDateClickHourly = (date: Dayjs) => {
    setCheckIn(date);
    setCheckOut(date); // Theo giờ: checkOut = checkIn (cùng ngày)
  };

  // 2. QUA ĐÊM: Chọn 1 ngày, tự động set checkOut = checkIn + 1
  const handleDateClickOvernight = (date: Dayjs) => {
    setCheckIn(date);
    setCheckOut(date.add(1, "day"));
  };

  // 3. THEO NGÀY: Airbnb style - chọn range
  const handleDateClickDaily = (date: Dayjs) => {
    if (selecting === "checkIn") {
      // Chọn checkIn
      setCheckIn(date);
      // Nếu checkOut tồn tại và nhỏ hơn hoặc bằng checkIn mới, reset checkOut
      if (checkOut && (checkOut.isSame(date, "day") || checkOut.isBefore(date, "day"))) {
        setCheckOut(null);
      }
      setSelecting("checkOut");
    } else {
      // Chọn checkOut - phải sau checkIn
      if (date.isAfter(checkIn, "day")) {
        setCheckOut(date);
        setSelecting("checkIn"); // Chuẩn bị cho lần chọn tiếp theo
      } else {
        // Nếu chọn ngày trước checkIn, coi như reset và chọn checkIn mới
        setCheckIn(date);
        setCheckOut(null);
        setSelecting("checkOut");
      }
    }
  };

  const handleDateClick = (date: Dayjs) => {
    switch (type) {
      case "hourly":
        handleDateClickHourly(date);
        break;
      case "overnight":
        handleDateClickOvernight(date);
        break;
      case "daily":
        handleDateClickDaily(date);
        break;
    }
  };

  const handleApply = () => {
    onApply({ checkIn, checkOut });
    onClose();
  };

  const handleReset = () => {
    const today = dayjs();
    if (type === "hourly") {
      onApply({ checkIn: today, checkOut: today });
    } else if (type === "overnight") {
      onApply({ checkIn: today, checkOut: today.add(1, "day") });
    } else {
      onApply({ checkIn: today, checkOut: today.add(1, "day") });
    }
    onClose();
  };

  // Render day cho từng loại booking
  const renderDayHourly = (props: any) => {
    const day = props.day as Dayjs;
    const today = dayjs().startOf("day");
    const isPast = day.isBefore(today, "day");
    const isSelected = checkIn?.isSame(day, "day");
    const isDisabled = restrictToFuture && day.isAfter(today, "day");
    return (
      <Button
        {...props}
        // disabled={isPast}
        disabled={isDisabled}
        onClick={() => handleDateClick(day)}
        sx={{
          minWidth: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: isSelected ? "#98b720" : "transparent",
          color: isSelected ? "#fff" : "inherit",
          cursor: isDisabled ? "default" : "pointer",
          "&:hover": {
            bgcolor: isDisabled ? "transparent" : "#e8f5e8",
          },
        }}>
        {day.format("D")}
      </Button>
    );
  };

  const renderDayOvernight = (props: any) => {
    const day = props.day as Dayjs;
    const today = dayjs().startOf("day");
    const isDisabled = restrictToFuture && day.isAfter(today, "day");
    const isSelected = checkIn?.isSame(day, "day");

    return (
      <Button
        {...props}
        disabled={isDisabled}
        onClick={() => handleDateClick(day)}
        sx={{
          minWidth: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: isSelected ? "#98b720" : "transparent",
          color: isSelected ? "#fff" : "inherit",
          cursor: isDisabled ? "default" : "pointer",
          "&:hover": {
            bgcolor: isDisabled ? "transparent" : "#e8f5e8",
          },
        }}>
        {day.format("D")}
      </Button>
    );
  };

  const renderDayDaily = (props: any) => {
    const day = props.day as Dayjs;
    const today = dayjs().startOf("day");
    const isPast = day.isBefore(today, "day");
    const isStart = checkIn?.isSame(day, "day");
    const isEnd = checkOut?.isSame(day, "day");
    const isInRange = checkIn && checkOut && day.isAfter(checkIn, "day") && day.isBefore(checkOut, "day");
    const isDisabled = restrictToFuture && day.isAfter(today, "day");
    return (
      <Button
        {...props}
        disabled={isDisabled}
        onClick={() => handleDateClick(day)}
        sx={{
          minWidth: 36,
          height: 36,
          borderRadius: "8px",
          bgcolor: isStart || isEnd
            ? "#98b720"
            : isInRange
              ? "#f0f8f0"
              : "transparent",
          color: isStart || isEnd ? "#fff" : "inherit",
          cursor: isDisabled ? "default" : "pointer",
          fontWeight: isStart || isEnd ? 600 : 400,
          position: "relative",
          "&:hover": {
            bgcolor: isDisabled ? "transparent" : isStart || isEnd ? "#7a8f1a" : "#e8f5e8",
          },
          // Hiệu ứng range Airbnb style
          ...(isInRange && {
            borderRadius: 0,
          }),
          ...(isStart && checkOut && {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }),
          ...(isEnd && checkIn && {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }),
        }}>
        {day.format("D")}
      </Button>
    );
  };

  const getRenderDayFunction = () => {
    switch (type) {
      case "hourly":
        return renderDayHourly;
      case "overnight":
        return renderDayOvernight;
      case "daily":
        return renderDayDaily;
      default:
        return renderDayHourly;
    }
  };

  const getHeaderText = () => {
    switch (type) {
      case "hourly":
        return "Chọn ngày sử dụng";
      case "overnight":
        return "Chọn ngày nhận phòng (tự động trả phòng ngày hôm sau)";
      case "daily":
        return "Chọn khoảng thời gian ";
      default:
        return "Chọn ngày";
    }
  };

  if (!open || !anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement='bottom'
      sx={{ zIndex: 100000 }}>
      <Paper sx={{ 
        mt: 1, 
        borderRadius: 3, 
        width: { xs: "90%", md: type === "daily" ? 680 : 340 }, 
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <LocalizationProvider adapterLocale={"vi"} dateAdapter={AdapterDayjs}>
          <Stack>
            {/* Header với tháng hiện tại */}
            <Box p={2} bgcolor='#f9f9f9' borderBottom='1px solid #eee'>
            
              <Typography fontSize="0.9rem" color="#666" mt={0.5}>
                {getHeaderText()}
              </Typography>
            </Box>

            {/* Calendar(s) */}
            <Stack direction={{ xs: "column", md: type === "daily" ? "row" : "column" }}>
              {/* THEO NGÀY: 2 calendar */}
              {type === "daily" ? (
                <>
                  {/* Calendar bên trái - Tháng hiện tại */}
                  <Box sx={{ flex: 1, p: 1, borderRight: "1px solid #eee" }}>
                    <DateCalendar
                      value={checkIn}
                      slots={{ day: getRenderDayFunction() }}
                      dayOfWeekFormatter={(date) => {
                        const shortDay = date.format('dd');
                        return shortDay;
                      }}
                      sx={{
                        "& .MuiPickersDay-today": {
                          border: "1px solid #98b720 !important",
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Calendar bên phải - Tháng kế tiếp */}
                  <Box sx={{ flex: 1, p: 1 }}>
                    <DateCalendar
                      value={checkIn ? checkIn.add(1, "month") : dayjs().add(1, "month")}
                      referenceDate={checkIn ? checkIn.add(1, "month") : dayjs().add(1, "month")}
                      slots={{ day: getRenderDayFunction() }}
                      dayOfWeekFormatter={(date) => {
                        const shortDay = date.format('dd');
                        return shortDay;
                      }}
                      sx={{
                        "& .MuiPickersDay-today": {
                          border: "1px solid #98b720 !important",
                        },
                      }}
                    />
                  </Box>
                </>
              ) : (
                /* THEO GIỄ & QUA ĐÊM: 1 calendar */
                <Box sx={{ flex: 1, p: 2 }}>
                  <DateCalendar
                    value={checkIn}
                    dayOfWeekFormatter={(date) => {
                      const shortDay = date.format('dd');
                      return shortDay;
                    }}
                    slots={{ day: getRenderDayFunction() }}
                    sx={{
                      "& .MuiPickersDay-today": {
                        border: "1px solid #98b720 !important",
                      },
                    }}
                  />
                </Box>
              )}
            </Stack>

            {/* Footer */}
            <Stack
              direction='row'
              justifyContent='space-between'
              p={2}
              bgcolor='#f9f9f9'
              borderTop='1px solid #eee'>
              <Button
                variant='outlined'
                onClick={handleReset}
                sx={{ 
                  borderRadius: 5,
                  color: "#666",
                  borderColor: "#ddd",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderColor: "#98b720",
                    color: "#98b720",
                  }
                }}>
                {type === "hourly" ? "Bất kỳ ngày nào" : "Bất kỳ ngày"}
              </Button>

              <Button
                variant='contained'
                onClick={handleApply}
                disabled={type === "daily" && (!checkIn || !checkOut)}
                sx={{ 
                  bgcolor: "#98b720", 
                  borderRadius: 5, 
                  px: 4,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": { 
                    bgcolor: "#7a8f1a" 
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#e0e0e0",
                    color: "#999",
                  }
                }}>
                Áp dụng
              </Button>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Paper>
    </Popper>
  );
};

/* ================== MAIN COMPONENT ================== */

export default function DateSearch({
  value,
  onChange,
  type,
  restrictToFuture
}: SimpleDateSearchBarProps) {
  const dateRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const formatDate = (date: Dayjs | null) =>
    date ? date.format("DD/MM/YYYY") : "Chọn ngày";

  const getDisplayText = () => {
    if (!value.checkIn) return "Chọn ngày";
    
    if (type === "hourly") {
      return formatDate(value.checkIn);
    } else if (type === "overnight") {
      return `${formatDate(value.checkIn)} - ${formatDate(value.checkOut)}`;
    } else if (type === "daily") {
      if (!value.checkOut) return formatDate(value.checkIn);
      return `${formatDate(value.checkIn)} - ${formatDate(value.checkOut)}`;
    }
    return "Chọn ngày";
  };

  const getPlaceholderText = () => {
    switch (type) {
      case "hourly":
        return "Chọn ngày sử dụng";
      case "overnight":
        return "Chọn ngày nhận phòng";
      case "daily":
        return "Chọn khoảng thời gian";
      default:
        return "Chọn ngày";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          <Box maxWidth='lg'>
            <Box
              ref={dateRef}
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                border: open ? "1px solid #98b720" : "1px solid #ddd",
                borderRadius: "50px",
                px: 2,
                py: 1.2,
                bgcolor: open ? "#f8fff8" : "#fff",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#98b720",
                  boxShadow: "0 0 0 1px #98b720",
                },
              }}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography 
                  fontWeight={500} 
                  color={value.checkIn ? "#333" : "#999"}
                  fontSize="0.95rem"
                >
                  {value.checkIn ? getDisplayText() : getPlaceholderText()}
                </Typography>
              </Stack>
            </Box>

            <DateRangePicker
              open={open}
              anchorEl={dateRef.current}
              value={value}
              onClose={() => setOpen(false)}
              onApply={onChange}
              type={type}
              restrictToFuture={restrictToFuture}
            />
          </Box>
        </Box>
      </ClickAwayListener>
    </LocalizationProvider>
  );
}