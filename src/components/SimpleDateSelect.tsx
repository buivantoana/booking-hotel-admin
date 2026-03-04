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
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

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

/* ================= DAY CELL ================= */

interface DayCellProps {
  day: Dayjs;
  currentMonth: number;
  currentYear: number;
  checkIn: Dayjs;
  checkOut: Dayjs;
  hoveredDay: Dayjs | null;
  onClick: (day: Dayjs) => void;
  onHover: (day: Dayjs | null) => void;
}

function DayCell({
  day,
  currentMonth,
  currentYear,
  checkIn,
  checkOut,
  hoveredDay,
  onClick,
  onHover,
}: DayCellProps) {
  const isCurrentMonth =
    day.month() === currentMonth && day.year() === currentYear;

  // Confirmed range
  const inRange = day.isBetween(checkIn, checkOut, "day", "[]");
  const isStart = day.isSame(checkIn, "day");
  const isEnd = day.isSame(checkOut, "day");

  // Hover preview range (hoveredDay = END, hoveredDay-6 = START)
  const hoverEnd = hoveredDay;
  const hoverStart = hoverEnd
    ? hoverEnd.subtract(6, "day").startOf("day")
    : null;
  const inHoverRange =
    hoverStart && hoverEnd
      ? day.isBetween(hoverStart, hoverEnd, "day", "[]")
      : false;
  const isHoverStart = hoverStart ? day.isSame(hoverStart, "day") : false;
  const isHoverEnd = hoverEnd ? day.isSame(hoverEnd, "day") : false;

  const isHighlighted = inRange;
  const isPreview = !isHighlighted && inHoverRange;

  const isCircleFilled = isStart || isEnd;
  const isCirclePreview = !isCircleFilled && (isHoverStart || isHoverEnd);

  // Strip: show left half and right half separately
  const stripColor = isHighlighted
    ? "#E8F5C8"
    : isPreview
    ? "#F0F0F0"
    : "transparent";
  const showLeftStrip = isHighlighted || isPreview;
  const showRightStrip = isHighlighted || isPreview;

  return (
    <Box
      sx={{
        position: "relative",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {/* Left half strip */}
      {showLeftStrip && !isStart && !isHoverStart && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            bgcolor: stripColor,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Right half strip */}
      {showRightStrip && !isEnd && !isHoverEnd && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            bgcolor: stripColor,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Day circle */}
      <Box
        onClick={() => onClick(day)}
        onMouseEnter={() => onHover(day)}
        onMouseLeave={() => onHover(null)}
        sx={{
          position: "relative",
          zIndex: 1,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: isCircleFilled ? 700 : 400,
          bgcolor: isCircleFilled
            ? "#9DBD00"
            : isCirclePreview
            ? "#BBDA00"
            : "transparent",
          color: isCircleFilled
            ? "#fff"
            : isCurrentMonth
            ? "text.primary"
            : "text.disabled",
          "&:hover": {
            bgcolor: isCircleFilled ? "#8AAA00" : "rgba(0,0,0,0.07)",
          },
          transition: "background 0.12s",
        }}>
        {day.date()}
      </Box>
    </Box>
  );
}

/* ================= CUSTOM CALENDAR ================= */

const VI_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface CustomCalendarProps {
  month: Dayjs;
  checkIn: Dayjs;
  checkOut: Dayjs;
  hoveredDay: Dayjs | null;
  onDateClick: (day: Dayjs) => void;
  onHover: (day: Dayjs | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hidePrev?: boolean;
  hideNext?: boolean;
}

function CustomCalendar({
  month,
  checkIn,
  checkOut,
  hoveredDay,
  onDateClick,
  onHover,
  onPrev,
  onNext,
  hidePrev,
  hideNext,
}: CustomCalendarProps) {
  const firstDay = month.startOf("month");
  const startOffset = (firstDay.isoWeekday() - 1 + 7) % 7;
  const gridStart = firstDay.subtract(startOffset, "day");

  const days: Dayjs[] = [];
  for (let i = 0; i < 42; i++) days.push(gridStart.add(i, "day"));

  // Show 5 rows if 6th row has no current-month days
  const totalRows = days[35].month() !== month.month() ? 5 : 6;

  return (
    <Box sx={{ width: 36 * 7 }}>
      {/* Month nav header */}
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        mb={1.5}>
        <IconButton
          size='small'
          onClick={onPrev}
          sx={{ visibility: hidePrev ? "hidden" : "visible", p: 0.5 }}>
          <KeyboardArrowLeftIcon fontSize='small' />
        </IconButton>
        <Typography fontWeight={700} fontSize={13.5}>
          {month.locale("vi").format("MMMM YYYY")}
        </Typography>
        <IconButton
          size='small'
          onClick={onNext}
          sx={{ visibility: hideNext ? "hidden" : "visible", p: 0.5 }}>
          <KeyboardArrowRightIcon fontSize='small' />
        </IconButton>
      </Stack>

      {/* Weekday labels */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 36px)",
          mb: 0.5,
        }}>
        {VI_WEEKDAYS.map((d) => (
          <Box
            key={d}
            sx={{
              textAlign: "center",
              fontSize: 11.5,
              fontWeight: 600,
              color: "text.disabled",
              py: 0.5,
            }}>
            {d}
          </Box>
        ))}
      </Box>

      {/* Day grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)" }}>
        {days.slice(0, totalRows * 7).map((day, i) => (
          <DayCell
            key={i}
            day={day}
            currentMonth={month.month()}
            currentYear={month.year()}
            checkIn={checkIn}
            checkOut={checkOut}
            hoveredDay={hoveredDay}
            onClick={onDateClick}
            onHover={onHover}
          />
        ))}
      </Box>
    </Box>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function SimpleDatePopup({ value, onChange }: Props) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<Mode>(value.mode);
  const [checkIn, setCheckIn] = useState<Dayjs>(value.checkIn);
  const [checkOut, setCheckOut] = useState<Dayjs>(value.checkOut);

  // Left calendar month; right = left + 1 always
  const [leftMonth, setLeftMonth] = useState<Dayjs>(
    value.checkIn.startOf("month")
  );
  const rightMonth = leftMonth.add(1, "month");

  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);

  useEffect(() => {
    setMode(value.mode);
    setCheckIn(value.checkIn);
    setCheckOut(value.checkOut);
    setLeftMonth(value.checkIn.startOf("month"));
  }, [value]);

  const handleDateClick = (day: Dayjs) => {
    if (mode === "week") {
      // day = END of range, START = day - 6
      const end = day.endOf("day");
      const start = day.subtract(6, "day").startOf("day");
      setCheckIn(start);
      setCheckOut(end);
      setHoveredDay(null);

      // If the selected day is not visible in either picker, navigate
      const startMonth = start.startOf("month");
      const endMonth = end.startOf("month");
      if (
        !startMonth.isSame(leftMonth, "month") &&
        !startMonth.isSame(rightMonth, "month") &&
        !endMonth.isSame(leftMonth, "month") &&
        !endMonth.isSame(rightMonth, "month")
      ) {
        setLeftMonth(startMonth);
      }
    } else {
      setCheckIn(day.startOf("month"));
      setCheckOut(day.endOf("month"));
    }
  };

  const handleApply = () => {
    onChange({ mode, checkIn, checkOut });
    setOpen(false);
  };

  const handleOpen = () => {
    setMode(value.mode);
    setCheckIn(value.checkIn);
    setCheckOut(value.checkOut);
    setLeftMonth(value.checkIn.startOf("month"));
    setHoveredDay(null);
    setOpen(true);
  };

  const triggerLabel =
    mode === "week"
      ? `${value.checkIn.format("DD/MM/YYYY")} – ${value.checkOut.format(
          "DD/MM/YYYY"
        )}`
      : value.checkIn.locale("vi").format("MMMM YYYY");

  return (
    <LocalizationProvider adapterLocale='vi' dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          {/* ===== TRIGGER ===== */}
          <Box
            ref={anchorRef}
            onClick={handleOpen}
            sx={{
              border: "1px solid #d0d5dd",
              borderRadius: 2,
              px: 2,
              py: 1,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#fff",
              userSelect: "none",
              "&:hover": { borderColor: "#9DBD00" },
              transition: "border-color 0.15s",
            }}>
            <Typography fontWeight={500} fontSize={14}>
              {mode === "week" ? "Tuần này" : "Tháng này"}
            </Typography>
            <KeyboardArrowDownIcon
              fontSize='small'
              sx={{ color: "text.secondary" }}
            />
          </Box>

          {/* ===== POPUP ===== */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement='bottom-start'
            style={{ zIndex: 1300 }}>
            <Paper
              elevation={6}
              sx={{ mt: 1, borderRadius: 3, overflow: "hidden" }}>
              <Stack direction='row'>
                {/* ===== SIDEBAR ===== */}
                <Stack
                  width={140}
                  p={2}
                  spacing={0.5}
                  sx={{ bgcolor: "#FAFAFA", borderRight: "1px solid #EEEEEE" }}>
                  <Typography
                    fontSize={11}
                    fontWeight={700}
                    color='text.disabled'
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      mb: 1,
                    }}>
                    Xem theo
                  </Typography>

                  {(["week", "month"] as Mode[]).map((m) => (
                    <Box
                      key={m}
                      onClick={() => {
                        const now = dayjs();
                        setMode(m);
                        if (m === "week") {
                          setCheckIn(now.subtract(6, "day").startOf("day"));
                          setCheckOut(now.endOf("day"));
                          setLeftMonth(now.subtract(6, "day").startOf("month"));
                        } else {
                          setCheckIn(now.startOf("month"));
                          setCheckOut(now.endOf("month"));
                        }
                        setHoveredDay(null);
                      }}
                      sx={{
                        px: 1.5,
                        py: 0.9,
                        borderRadius: 1.5,
                        cursor: "pointer",
                        bgcolor: mode === m ? "#EEF7CC" : "transparent",
                        color: mode === m ? "#6B8700" : "text.primary",
                        fontWeight: mode === m ? 600 : 400,
                        fontSize: 14,
                        "&:hover": {
                          bgcolor: mode === m ? "#EEF7CC" : "#F0F0F0",
                        },
                        transition: "background 0.12s",
                      }}>
                      {m === "week" ? "Tuần" : "Tháng"}
                    </Box>
                  ))}
                </Stack>

                {/* ===== CONTENT ===== */}
                <Stack p={2.5} spacing={2.5}>
                  {/* Range label */}
                  <Box
                    sx={{
                      border: "1px solid #EBEBEB",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: "#FAFAFA",
                    }}>
                    <CalendarTodayIcon
                      fontSize='small'
                      sx={{ color: "#9DBD00" }}
                    />
                    <Typography fontSize={13} fontWeight={600} color='#333'>
                      {checkIn.format("DD/MM/YYYY")}
                    </Typography>
                    <Typography fontSize={13} color='#BBB'>
                      —
                    </Typography>
                    <Typography fontSize={13} fontWeight={600} color='#333'>
                      {checkOut.format("DD/MM/YYYY")}
                    </Typography>
                  </Box>

                  {/* Calendars */}
                  {mode === "week" ? (
                    <Stack direction='row' spacing={3} alignItems='flex-start'>
                      <CustomCalendar
                        month={leftMonth}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        hoveredDay={hoveredDay}
                        onDateClick={handleDateClick}
                        onHover={setHoveredDay}
                        onPrev={() =>
                          setLeftMonth((m) => m.subtract(1, "month"))
                        }
                        onNext={() => setLeftMonth((m) => m.add(1, "month"))}
                        hideNext
                      />
                      <Divider orientation='vertical' flexItem />
                      <CustomCalendar
                        month={rightMonth}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        hoveredDay={hoveredDay}
                        onDateClick={handleDateClick}
                        onHover={setHoveredDay}
                        onPrev={() =>
                          setLeftMonth((m) => m.subtract(1, "month"))
                        }
                        onNext={() => setLeftMonth((m) => m.add(1, "month"))}
                        hidePrev
                      />
                    </Stack>
                  ) : (
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
                  )}

                  {/* Actions */}
                  <Stack
                    direction='row'
                    justifyContent='flex-end'
                    spacing={1.5}>
                    <Button
                      onClick={() => setOpen(false)}
                      sx={{
                        px: 3,
                        borderRadius: 5,
                        bgcolor: "#F0F0F0",
                        color: "text.secondary",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#E5E5E5" },
                      }}>
                      Hủy
                    </Button>
                    <Button
                      variant='contained'
                      onClick={handleApply}
                      sx={{
                        px: 3,
                        borderRadius: 5,
                        bgcolor: "#9DBD00",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#8AAA00" },
                      }}>
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
