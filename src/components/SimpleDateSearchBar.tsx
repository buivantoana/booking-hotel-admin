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
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

/* ================== TYPES ================== */

export interface DateRangeValue {
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
}

interface SimpleDateSearchBarProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

/* ================== DATE RANGE PICKER ================== */

interface DateRangePickerProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  value: DateRangeValue;
  onClose: () => void;
  onApply: (value: DateRangeValue) => void;
}

const DateRangePicker = ({
  open,
  anchorEl,
  value,
  onClose,
  onApply,
}: DateRangePickerProps) => {
  const [checkIn, setCheckIn] = useState<Dayjs | null>(value.checkIn);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(value.checkOut);

  useEffect(() => {
    setCheckIn(value.checkIn);
    setCheckOut(value.checkOut);
  }, [value]);

  const handleDateClick = (date: Dayjs) => {
    if (!checkIn || (checkOut && date.isBefore(checkIn))) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    if (!checkOut && date.isAfter(checkIn)) {
      setCheckOut(date);
      return;
    }

    setCheckIn(date);
    setCheckOut(null);
  };

  const handleApply = () => {
    onApply({ checkIn, checkOut });
    onClose();
  };

  const renderDay =
    (start: Dayjs | null, end: Dayjs | null) => (props: any) => {
      const day = props.day as Dayjs;
      const today = dayjs().startOf("day");

      const isPast = day.isBefore(today, "day");

      const isStart = start?.isSame(day, "day");
      const isEnd = end?.isSame(day, "day");
      const isInRange = start && end && day.isAfter(start) && day.isBefore(end);

      return (
        <Button
          {...props}
          onClick={() => {
            handleDateClick(day);
          }}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor:
              isStart || isEnd
                ? "#98b720"
                : isInRange
                ? "#f0f8f0"
                : "transparent",
            color: isStart || isEnd ? "#fff" : "inherit",
            cursor: "pointer",
            "&:hover": {
              bgcolor: isPast ? "transparent" : "#e8f5e8",
            },
          }}>
          {day.format("D")}
        </Button>
      );
    };

  if (!open || !anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement='bottom'
      sx={{ zIndex: 50 }}>
      <Paper sx={{ mt: 1, borderRadius: 3, width: {xs:"85%",md:680}, overflow: "hidden" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack>
            <Box p={2} bgcolor='#f9f9f9'>
              <Typography fontWeight={600}>
                Chọn ngày nhận - trả phòng
              </Typography>
            </Box>

            <Stack direction={{xs:"column",md:'row'}}>
              {[0, 1].map((i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    p: 1,
                    borderRight: i === 0 ? "1px solid #eee" : "none",
                  }}>
                  <DateCalendar
                    value={checkIn}
                    slots={{ day: renderDay(checkIn, checkOut) }}
                  />
                </Box>
              ))}
            </Stack>

            <Stack
              direction='row'
              justifyContent='space-between'
              p={2}
              bgcolor='#f9f9f9'>
              <Button
                variant='outlined'
                onClick={() =>
                  onApply({
                    checkIn: dayjs(),
                    checkOut: dayjs().add(1, "day"),
                  })
                }
                sx={{ borderRadius: 5 }}>
                Bất kỳ ngày nào
              </Button>

              <Button
                variant='contained'
                onClick={handleApply}
                sx={{ bgcolor: "#98b720", borderRadius: 5, px: 4 }}>
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

export default function SimpleDateSearchBar({
  value,
  onChange,
}: SimpleDateSearchBarProps) {
  const dateRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const formatDate = (date: Dayjs | null) =>
    date ? date.format("DD/MM/YYYY") : "Chọn ngày";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box zIndex={10}>
          <Box maxWidth='lg'>
            <Box
              ref={dateRef}
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                border: open ? "1px solid #98b720" : "1px solid #eee",
                borderRadius: 3,
                px: 2,
                py: 1,
                bgcolor: open ? "#f8fff8" : "#fff",
              }}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography fontWeight={500}>
                  {formatDate(value.checkIn)}
                </Typography>
                <Typography color='#999'>-</Typography>
                <Typography fontWeight={500}>
                  {formatDate(value.checkOut)}
                </Typography>
              </Stack>
            </Box>

            <DateRangePicker
              open={open}
              anchorEl={dateRef.current}
              value={value}
              onClose={() => setOpen(false)}
              onApply={onChange}
            />
          </Box>
        </Box>
      </ClickAwayListener>
    </LocalizationProvider>
  );
}
