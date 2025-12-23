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

dayjs.extend(isoWeek);

/* ================= TYPES ================= */

type Mode = "week" | "month";

export interface DateRangeValue {
  mode: Mode;
  checkIn: Dayjs;
  checkOut: Dayjs;
}

interface Props {
  value: DateRangeValue;
  onChange: (val: DateRangeValue) => void;
}

/* ================= COMPONENT ================= */

export default function SimpleDatePopup({ value, onChange }: Props) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // local draft state
  const [mode, setMode] = useState<Mode>(value.mode);
  const [checkIn, setCheckIn] = useState(value.checkIn);
  const [checkOut, setCheckOut] = useState(value.checkOut);

  useEffect(() => {
    setMode(value.mode);
    setCheckIn(value.checkIn);
    setCheckOut(value.checkOut);
  }, [value]);

  /* ===== CLICK DATE ===== */
  const handleDateClick = (date: Dayjs) => {
    if (mode === "month") {
      setCheckIn(date.startOf("month"));
      setCheckOut(date.endOf("month"));
    } else {
      setCheckIn(date.startOf("isoWeek"));
      setCheckOut(date.endOf("isoWeek"));
    }
  };

  /* ===== APPLY ===== */
  const handleApply = () => {
    onChange({ mode, checkIn, checkOut });
    setOpen(false);
  };

  /* ===== RENDER DAY (WEEK) ===== */
  const renderDay = (start: Dayjs, end: Dayjs) => (props: any) => {
    const day = props.day as Dayjs;
    const inRange =
      day.isAfter(start.subtract(1, "day")) && day.isBefore(end.add(1, "day"));

    return (
      <Button
        {...props}
        onClick={() => handleDateClick(day)}
        sx={{
          minWidth: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: inRange ? "#9DBD00" : "transparent",
          color: inRange ? "#fff" : "inherit",
          "&:hover": { bgcolor: "#8AA900" },
        }}>
        {day.date()}
      </Button>
    );
  };

  /* ================= UI ================= */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          {/* ===== BUTTON OPEN ===== */}
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
            }}>
            <Typography fontWeight={500}>
              {value.mode === "week" ? "Tuần này" : "Tháng này"}
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>

          {/* ===== POPUP ===== */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement='bottom-start'>
            <Paper sx={{ mt: 1, borderRadius: 4 }}>
              <Stack direction='row'>
                {/* ===== LEFT MENU ===== */}
                <Stack width={160} p={2} spacing={1}>
                  <Typography
                    onClick={() => {
                      const now = dayjs();
                      setMode("week");
                      setCheckIn(now.startOf("isoWeek"));
                      setCheckOut(now.endOf("isoWeek"));
                    }}
                    sx={{
                      cursor: "pointer",
                      fontWeight: mode === "week" ? 600 : 400,
                      color: mode === "week" ? "#9DBD00" : "inherit",
                    }}>
                    Tuần này
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
                    }}>
                    Tháng này
                  </Typography>
                </Stack>

                <Divider orientation='vertical' flexItem />

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
                    }}>
                    <CalendarTodayIcon fontSize='small' />
                    <Typography fontSize={14}>
                      {checkIn.format("DD/MM/YYYY")} –{" "}
                      {checkOut.format("DD/MM/YYYY")}
                    </Typography>
                  </Box>

                  {/* CALENDAR */}
                  {mode === "month" ? (
                    <DateCalendar
                      views={["year", "month"]}
                      openTo='month'
                      value={checkIn}
                      onChange={(date) => {
                        if (!date) return;
                        setCheckIn(date.startOf("month"));
                        setCheckOut(date.endOf("month"));
                      }}
                      sx={{
                        // Tháng được chọn
                        "& .MuiMonthCalendar-button.Mui-selected": {
                          backgroundColor: "#9DBD00 !important",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#8AA900",
                          },
                        },

                        // Năm được chọn (nếu có)
                        "& .MuiYearCalendar-button.Mui-selected": {
                          backgroundColor: "#9DBD00 !important",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#8AA900",
                          },
                        },
                      }}
                    />
                  ) : (
                    <DateCalendar
                      sx={{ width: "100%" }}
                      value={checkIn}
                      slots={{ day: renderDay(checkIn, checkOut) }}
                    />
                  )}

                  {/* ACTIONS */}
                  <Stack direction='row' justifyContent='flex-end' spacing={2}>
                    <Button
                      sx={{
                        bgcolor: "#eee",
                        px: 4,
                        borderRadius: 5,
                      }}
                      onClick={() => setOpen(false)}>
                      Hủy
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        bgcolor: "#9DBD00",
                        px: 4,
                        borderRadius: 5,
                      }}
                      onClick={handleApply}>
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
