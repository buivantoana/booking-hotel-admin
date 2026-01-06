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
  Divider,
} from "@mui/material";
import {
  LocalizationProvider,
  DateCalendar,
  MonthCalendar,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

/* ================= TYPES ================= */

type Mode = "week" | "month";

interface DateValue {
  mode: Mode;
  checkIn: Dayjs;
  checkOut: Dayjs;
}

interface Props {
  value: DateValue;
  onChange: (value: DateValue) => void;
}

/* ================= UTILS ================= */

const getLast7DaysRange = (base: Dayjs) => ({
  start: base.subtract(6, "day").startOf("day"),
  end: base.endOf("day"),
});

/* ================= COMPONENT ================= */

export default function SimpleDatePopup({ value, onChange }: Props) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // local draft state
  const [mode, setMode] = useState<Mode>(value.mode);
  const [checkIn, setCheckIn] = useState<Dayjs>(value.checkIn);
  const [checkOut, setCheckOut] = useState<Dayjs>(value.checkOut);

  /* ===== SYNC FROM PARENT ===== */
  useEffect(() => {
    setMode(value.mode);
    setCheckIn(value.checkIn);
    setCheckOut(value.checkOut);
  }, [value]);

  /* ===== DATE CLICK ===== */
  const handleDateClick = (date: Dayjs) => {
    if (mode === "month") {
      setCheckIn(date.startOf("month"));
      setCheckOut(date.endOf("month"));
    } else {
      // Sửa: Dùng date làm end, start = date - 6 days
      setCheckIn(date.subtract(6, "day").startOf("day"));
      setCheckOut(date.endOf("day"));
    }
  };

  /* ===== APPLY ===== */
  const handleApply = () => {
    onChange({
      mode,
      checkIn,
      checkOut,
    });
    setOpen(false);
  };

  /* ===== RENDER DAY (WEEK MODE) ===== */
  const renderWeekDay =
  (start: Dayjs, end: Dayjs) =>
  (props: any) => {
    const day = props.day as Dayjs;
    const inRange = day.isBetween(start, end, "day", "[]");

    return (
      <Button
        {...props}
        sx={{
          minWidth: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: inRange ? "#9DBD00" : "transparent",
          color: inRange ? "#fff" : "inherit",
          "&:hover": { bgcolor: "#8AA900" },
        }}
        onClick={() => handleDateClick(day)}  // Bây giờ handleDateClick dùng day làm end
        // ... (giữ nguyên style)
      >
        {day.date()}
      </Button>
    );
  };
  /* ================= UI ================= */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          {/* ===== TRIGGER ===== */}
          <Box
            ref={anchorRef}
            onClick={() => {
              setMode(value.mode);
              setCheckIn(value.checkIn);
              setCheckOut(value.checkOut);
              setOpen(true);
            }}
            sx={{
              border: "1px solid #d0d5dd",
              borderRadius: 2,
              px: 2,
              py: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
            }}
          >
            <Typography fontWeight={500}>
              {mode === "week" ? "7 ngày gần nhất" : "Tháng này"}
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>

          {/* ===== POPUP ===== */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
          >
            <Paper sx={{ mt: 1, borderRadius: 4 }}>
              <Stack direction="row">
                {/* ===== LEFT MENU ===== */}
                <Stack width={160} p={2} spacing={1}>
                  <Typography
                   onClick={() => {
                    const now = dayjs();
                    setMode("week");
                    setCheckIn(now.subtract(6, "day").startOf("day"));  // Sửa: 7 ngày gần nhất
                    setCheckOut(now.endOf("day"));
                  }}
                    sx={{
                      cursor: "pointer",
                      fontWeight: mode === "week" ? 600 : 400,
                      color: mode === "week" ? "#9DBD00" : "inherit",
                    }}
                  >
                    7 ngày gần nhất
                  </Typography>

                  <Typography
                    onClick={() => {
                      const now = dayjs();
                      setMode("month");
                      setCheckIn(now.startOf("month"));
                      setCheckOut(now.endOf("month"));
                    }}
                    sx={{
                      cursor: "pointer",
                      fontWeight: mode === "month" ? 600 : 400,
                      color: mode === "month" ? "#9DBD00" : "inherit",
                    }}
                  >
                    Tháng này
                  </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />

                {/* ===== RIGHT CONTENT ===== */}
                <Stack flex={1} p={3} spacing={2}>
                  {/* RANGE DISPLAY */}
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                    <Typography fontSize={14}>
                      {checkIn.format("DD/MM/YYYY")} –{" "}
                      {checkOut.format("DD/MM/YYYY")}
                    </Typography>
                  </Box>

                  {/* CALENDAR */}
                  {mode === "month" ? (
                    <DateCalendar
                      views={["year", "month"]}
                      openTo="month"
                      value={checkIn}
                      onChange={(date) => {
                        if (!date) return;
                        setCheckIn(date.startOf("month"));
                        setCheckOut(date.endOf("month"));
                      }}
                      sx={{
                        "& .MuiMonthCalendar-button.Mui-selected": {
                          backgroundColor: "#9DBD00 !important",
                          color: "#fff",
                        },
                        "& .MuiYearCalendar-button.Mui-selected": {
                          backgroundColor: "#9DBD00 !important",
                          color: "#fff",
                        },
                      }}
                    />
                  ) : (
                    <DateCalendar
                    value={checkOut}
                      slots={{
                        day: renderWeekDay(checkIn, checkOut),
                      }}
                    />
                  )}

                  {/* ACTIONS */}
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                      sx={{ bgcolor: "#eee", px: 4, borderRadius: 5 }}
                      onClick={() => setOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#9DBD00", px: 4, borderRadius: 5 }}
                      onClick={handleApply}
                    >
                      Đồng ý
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
    </LocalizationProvider>
  );
}