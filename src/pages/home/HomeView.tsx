"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
  Avatar,
  Popper,
  Paper,
  ClickAwayListener,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import start from "../../images/star.svg";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/vi";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("vi");

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Star } from "@mui/icons-material";
const CARD_CONFIG = [
  {
    key: "hourly",
    title: "Đặt phòng theo giờ",
    icon: AccessTimeIcon,
    color: "#FF6B6B",
  },
  {
    key: "overnight",
    title: "Đặt phòng qua đêm",
    icon: NightShelterIcon,
    color: "#4DABF7",
  },
  {
    key: "daily",
    title: "Đặt phòng theo ngày",
    icon: FlightTakeoffIcon,
    color: "#FFC048",
  },
];
// Styled Components
const CompareBar = styled(Box)({
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "4px 12px",
  fontSize: "0.8rem",
  color: "#666",
});

const WeekPickerButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 500,
  minWidth: 170,
  "&:hover": { borderColor: "#999" },
}));

// Custom Day - Theo tuần
function WeekDay(
  props: PickersDayProps<Dayjs> & { selectedDate?: Dayjs | null }
) {
  const { selectedDate, day, outsideCurrentMonth, ...other } = props;
  if (!selectedDate || outsideCurrentMonth)
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
      />
    );

  const start = selectedDate.startOf("week");
  const end = selectedDate.endOf("week");
  const isInWeek =
    day.isSameOrAfter(start, "day") && day.isSameOrBefore(end, "day");
  const isSelected = day.isSame(selectedDate, "day");

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...(isInWeek && {
          backgroundColor: "#E8F5E8",
          color: "#2E7D32",
          fontWeight: 600,
          borderRadius: 0,
          "&:first-of-type": {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
          "&:last-of-type": {
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          },
        }),
        ...(isSelected && {
          backgroundColor: "#4CAF50 !important",
          color: "white !important",
          fontWeight: "bold",
        }),
      }}
    />
  );
}

// Custom Day - Theo tháng
function MonthDay(
  props: PickersDayProps<Dayjs> & { selectedDate?: Dayjs | null }
) {
  const { selectedDate, day, outsideCurrentMonth, ...other } = props;
  if (!selectedDate || outsideCurrentMonth)
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
      />
    );

  const isInMonth = day.isSame(selectedDate, "month");
  const isSelected = day.isSame(selectedDate, "day");

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...(isInMonth && {
          backgroundColor: "#E8F5E8",
          color: "#2E7D32",
          fontWeight: 600,
          borderRadius: "50%",
        }),
        ...(isSelected && {
          backgroundColor: "#4CAF50 !important",
          color: "white !important",
          fontWeight: "bold",
        }),
      }}
    />
  );
}

// Week & Month Picker - SIÊU ĐẸP
type ViewMode = "week" | "month";

const WeekMonthPicker: React.FC<{
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState<ViewMode>("week");

  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDateChange = (newDate: Dayjs | null) => {
    onChange(newDate);
    handleClose();
  };

  const formatDisplay = () => {
    if (!value) return mode === "week" ? "Tuần này" : "Tháng này";
    if (mode === "week") {
      const start = value.startOf("week").format("DD/MM");
      const end = value.endOf("week").format("DD/MM/YYYY");
      return `${start} - ${end}`;
    } else {
      return value.format("MM/YYYY");
    }
  };

  return (
    <>
      <WeekPickerButton onClick={handleClick}>
        <CalendarTodayIcon sx={{ fontSize: 16, color: "#666" }} />
        <Box component='span'>{formatDisplay()}</Box>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 18, ml: "auto", color: "#666" }}
        />
      </WeekPickerButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement='bottom-start'
        sx={{ zIndex: 9999 }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={12}
            sx={{ mt: 1, borderRadius: 3, overflow: "hidden", width: 340 }}>
            <Tabs
              value={mode}
              onChange={(_, v) => setMode(v)}
              centered
              sx={{ bgcolor: "#f5f5f5" }}>
              <Tab
                label='Theo tuần'
                value='week'
                sx={{ fontWeight: 600, minWidth: 100 }}
              />
              <Tab
                label='Theo tháng'
                value='month'
                sx={{ fontWeight: 600, minWidth: 100 }}
              />
            </Tabs>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
              {mode === "week" ? (
                <DateCalendar
                  value={value}
                  onChange={handleDateChange}
                  disableFuture
                  showDaysOutsideCurrentMonth
                  fixedWeekNumber={6}
                  slots={{ day: WeekDay }}
                  slotProps={{ day: { selectedDate: value } as any }}
                  sx={{ "& .MuiPickersDay-root": { borderRadius: 0 } }}
                />
              ) : (
                <DateCalendar
                  value={value}
                  onChange={handleDateChange}
                  views={["year", "month", "day"]}
                  disableFuture
                  slots={{ day: MonthDay }}
                  slotProps={{ day: { selectedDate: value } as any }}
                />
              )}
            </LocalizationProvider>

            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                bgcolor: "#fafafa",
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}>
              <Button onClick={handleClose} sx={{ color: "#666" }}>
                Hủy
              </Button>
              <Button
                onClick={handleClose}
                variant='contained'
                sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#43a047" } }}>
                Đồng ý
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

// Custom Dot
const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill='#3B82F6'
      stroke='#fff'
      strokeWidth={3}
    />
  );
};

const formatCurrency = (value: number) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(0)}tr`
    : `${(value / 1000).toFixed(0)}k`;

// Performance Chart
const PerformanceChart = ({
  title,

  subtitle,
  data,
  markedDateStart,
  markedDateEnd,
  dateRangeRevenueEvent,
  setDateRangeRevenueEvent,
  setRoomType,
  roomType,
}: any) => {
  const isVisit = title.includes("ghé thăm");
  const [selectedPeriod, setSelectedPeriod] = useState<Dayjs | null>(dayjs());
  const dayLabels = [
    "Thứ Hai", // 2025-12-08
    "Thứ Ba", // 2025-12-09
    "Thứ Tư", // 2025-12-10
    "Thứ Năm", // 2025-12-11
    "Thứ Sáu", // 2025-12-12
    "Thứ Bảy", // 2025-12-13
    "Chủ Nhật", // 2025-12-14
  ];

  // Tạo map nhanh để lấy value theo date
  const prevMap = new Map(data?.start?.map((item) => [item.date, item.value]));
  const currentMap = new Map(data?.end?.map((item) => [item.date, item.value]));

  // Tạo mảng data cho chart (7 ngày đầy đủ, value = 0 nếu không có dữ liệu)

  const isWeek = data?.end?.length === 7;

  const chartData = data?.end?.map((item, index) => {
    return {
      day: isWeek ? dayLabels[index] : dayjs(item.date).format("DD/MM"),
      prev: data?.start?.[index]?.value ?? 0, // ✅ FIX
      current: item.value ?? 0,
    };
  });

  // ===== TÍNH VALUE & CHANGE TỪ DATA =====
  const prevTotal =
    data?.start?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

  const currentTotal =
    data?.end?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

  const value = currentTotal;

  // Tính % thay đổi
  let changePercent = 0;
  if (prevTotal === 0) {
    changePercent = currentTotal > 0 ? 100 : 0;
  } else {
    changePercent = ((currentTotal - prevTotal) / prevTotal) * 100;
  }

  // Format text hiển thị
  const change = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`;
  const startData = data?.start ?? [];
  const endData = data?.end ?? [];

  const maxValue = Math.max(
    ...startData.map((i) => i.value),
    ...endData.map((i) => i.value),
    0
  );
  const yMax = maxValue <= 1 ? 2 : Math.ceil(maxValue * 1.2);
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ pb: 4 }}>
        <Typography fontSize={"18px"} fontWeight='bold' gutterBottom>
          {title}
        </Typography>

        <Stack direction='row' alignItems='center' gap={2} mb={1}>
          <Typography
            variant='h3'
            fontWeight='bold'
            sx={{ fontSize: "2.5rem" }}>
            {value}
          </Typography>
          <Chip
            label={change}
            size='small'
            sx={{
              bgcolor: "#E6F4EA",
              color: "#1A9739",
              fontWeight: "bold",
              height: 32,
            }}
          />
        </Stack>

        <Typography variant='body2' color='text.secondary' mb={3}>
          {subtitle}
        </Typography>

        {!roomType && (
          <Stack direction='row' alignItems='center' gap={2} mb={3}>
            <Box width={"30%"}>
              <SimpleDatePopup
                value={dateRangeRevenueEvent}
                onChange={setDateRangeRevenueEvent}
              />
            </Box>
            <CompareBar
              sx={{
                height: "35px",
                alignItems: "center",
                display: "flex",
                borderRadius: 2,
              }}>
              So sánh với{" "}
              {dateRangeRevenueEvent.mode === "week"
                ? "Tuần trước"
                : "Tháng trước"}
            </CompareBar>
          </Stack>
        )}
        {roomType && (
          <Box mb={3}>
            <RoomTypeSelect
              value={roomType}
              onChange={(newValue) => setRoomType(newValue)}
            />
          </Box>
        )}

        <Box sx={{ height: 280, position: "relative" }}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid
                stroke='#f0f0f0'
                vertical={false}
                strokeDasharray='5 5'
              />
              <XAxis
                dataKey='day'
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                domain={[0, yMax]}
                allowDecimals={false}
              />
              <Line
                type='monotone'
                dataKey='prev'
                stroke='#BDC3C7'
                strokeWidth={2}
                strokeDasharray='7 7'
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='current'
                stroke='#3B82F6'
                strokeWidth={3.5}
                dot={<CustomDot />}
                activeDot={{ r: 7 }}
              />
              <ReferenceLine x='Thứ 4' stroke='#ddd' strokeWidth={1.5} />

              <foreignObject x='42%' y='50' width='140' height='60'>
                <Box
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    px: 1.8,
                    py: 1,
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: 13,
                  }}>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {markedDateStart}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='#3B82F6'
                    fontWeight='medium'>
                    {markedDateEnd}
                  </Typography>
                </Box>
              </foreignObject>
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={4} mt={3}>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#3B82F6",
              }}
            />
            <Typography variant='body2' color='#666' fontWeight={500}>
              Kỳ này
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{ width: 20, height: 2, bgcolor: "#BDC3C7", borderRadius: 1 }}
            />
            <Typography variant='body2' color='#666' fontWeight={500}>
              Kỳ trước
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Doanh thu
const RevenueCompareChart = ({
  setRoomTypeGeneral,
  roomTypeGeneral,
  dataGeneralRoomType,
}) => {
  const totalPrev = dataGeneralRoomType?.start?.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const totalCurrent = dataGeneralRoomType?.end?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const percentChange =
    totalPrev === 0
      ? 0
      : Math.round(((totalCurrent - totalPrev) / totalPrev) * 100);

  const revenueCompareData = dataGeneralRoomType?.start?.map((item, index) => ({
    day: dayjs(item.date).format("DD/MM"),
    "Tuần trước": item.value, // Tuần trước
    "Tuần này": dataGeneralRoomType?.end[index]?.value || 0, // Tuần này
  }));

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
          mb={2}>
          <Box>
            <Typography fontSize={"18px"} fontWeight='bold'>
              Doanh thu hàng tuần
            </Typography>
            <Stack direction='row' alignItems='center' gap={2} mt={1}>
              <Typography variant='h6' fontWeight='bold'>
                {totalCurrent?.toLocaleString()}đ
              </Typography>
              <Chip
                label={`${percentChange}% so với tuần trước`}
                sx={{
                  bgcolor: percentChange >= 0 ? "#E6F4EA" : "#FDECEA",
                  color: percentChange >= 0 ? "#1A9739" : "#D32F2F",
                  fontWeight: "bold",
                }}
              />
            </Stack>
            <Typography variant='body2' color='text.secondary' mt={1}>
              doanh thu đang tăng – bạn hãy thêm những ưu đãi để hút khách hơn
              nữa
            </Typography>
          </Box>
        </Stack>
        <Box>
          <RoomTypeSelect
            value={roomTypeGeneral}
            onChange={(newValue) => setRoomTypeGeneral(newValue)}
          />
        </Box>

        <Box sx={{ height: 300, mt: 4 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={revenueCompareData}
              margin={{ left: -20, right: 10 }}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f0f0f0'
                vertical={false}
              />
              <XAxis
                dataKey='day'
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()}đ`}
              />
              <Bar
                dataKey='Tuần trước'
                fill='#BBDEFB'
                radius={[8, 8, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey='Tuần này'
                fill='#2196F3'
                radius={[8, 8, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={4} mt={2}>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 2,
                bgcolor: "#BBDEFB",
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Tuần trước
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 2,
                bgcolor: "#2196F3",
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Tuần này
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const RevenuePaymentChart = ({
  setDateRangeRevenueMethod,
  dateRangeRevenueMethod,
  dataGeneralMethod,
}) => {
  const totalRevenue = dataGeneralMethod.reduce(
    (sum, item) => sum + item.online + item.offline,
    0
  );
  const revenueStackData = dataGeneralMethod.map((item) => ({
    day: dayjs(item.date).format("DD/MM"),
    "Trả trước": item.online,
    "Trả tại khách sạn": item.offline,
  }));
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
          mb={2}>
          <Box>
            <Typography fontSize={"18px"} fontWeight='bold'>
              Khách hàng thanh toán
            </Typography>
            <Typography variant='h6' fontWeight='bold' mt={1}>
              {totalRevenue.toLocaleString()}đ
            </Typography>
          </Box>
        </Stack>
        <Box width={"50%"}>
          <SimpleDatePopup
            value={dateRangeRevenueMethod}
            onChange={setDateRangeRevenueMethod}
          />
        </Box>

        <Box sx={{ height: 300, mt: 4 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={revenueStackData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f0f0f0'
                vertical={false}
              />
              <XAxis
                dataKey='day'
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()}đ`}
              />
              <Bar dataKey='Trả trước' stackId='a' fill='#FFB300' />
              <Bar
                dataKey='Trả tại khách sạn'
                stackId='a'
                fill='#42A5F5'
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={4} mt={2}>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 2,
                bgcolor: "#FFB300",
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Trả trước
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 2,
                bgcolor: "#42A5F5",
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Trả tại khách sạn
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function HomeView({
  setDateRange,
  dateRange,
  dataGeneral,
  setDateRangeRevenueMethod,
  dateRangeRevenueMethod,
  dataGeneralMethod,
  setRoomTypeGeneral,
  roomTypeGeneral,
  dataGeneralRoomType,
  setDateRangeRevenueEvent,
  dateRangeRevenueEvent,
  setDateRangeRevenueEventView,
  dateRangeRevenueEventView,
  dataEventView,
  dataEventVisit,
  setRoomTypeBooking,
  roomTypeBooking,
  setRoomTypeCheckin,
  roomTypeCheckin,
  dataEventCheckin,
  dataEventBooked,
  dataReview,
  hotels,
  idHotel,
  setIdHotel,
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const BOOKING_ITEMS = [
    {
      key: "total",
      label: "Tổng số đơn",
      color: "#495057",
    },
    {
      key: "pending_hotel",
      label: "Chờ khách sạn xác nhận",
      color: "#FAB005",
    },
    {
      key: "pending_checkin",
      label: "Chờ nhận phòng",
      color: "#4DABF7",
    },
    {
      key: "checked_in",
      label: "Đang ở",
      color: "#51CF66",
    },
    {
      key: "completed",
      label: "Hoàn tất",
      color: "#ADB5BD",
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  console.log("AAAAA dataEventCheckin", dataEventCheckin);
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <NotificationPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent='space-between'
        alignItems='center'
        mb={5}
        gap={2}>
        <Box>
          <Typography variant='h5' fontWeight='bold'>
            Trang chủ
          </Typography>
          {/* <HotelSelect
            value={idHotel}
            hotelsData={hotels}
            onChange={(id) => {
              setIdHotel(id);
              console.log("ID khách sạn được chọn:", id);
            }}
          /> */}
        </Box>

        {/* <Avatar onClick={handleClick} sx={{}}>
            <NotificationsNoneIcon />
          </Avatar> */}
      </Stack>

      {/* Tổng quan đặt phòng */}
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Typography variant='h6' fontWeight='bold' mb={1}>
            Tổng quan đặt phòng
          </Typography>
          <Typography variant='body2' color='text.secondary' mb={4}>
            Tổng quan đặt phòng khách sạn của bạn trong hôm nay
          </Typography>
        </Box>
        <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
      </Box>

      <Grid container spacing={3} mb={6}>
        {CARD_CONFIG.map((card) => {
          const cardData = dataGeneral[card.key as keyof typeof dataGeneral];

          return (
            <Grid item xs={12} md={4} key={card.key}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: card.color,
                        width: 56,
                        height: 56,
                      }}>
                      <card.icon sx={{ fontSize: 32, color: "white" }} />
                    </Avatar>

                    <Typography variant='h6' fontWeight='bold'>
                      {card.title}
                    </Typography>
                  </Stack>

                  {BOOKING_ITEMS.map((item) => (
                    <Stack
                      key={item.key}
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      py={0.8}>
                      <Stack direction='row' alignItems='center' gap={1.5}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {item.label}
                        </Typography>
                      </Stack>

                      <Typography fontWeight='bold' fontSize='1rem'>
                        {cardData?.[item.key as keyof typeof cardData] ?? 0}
                      </Typography>
                    </Stack>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Hiệu suất */}
      <Typography variant='h6' fontWeight='bold' mb={4}>
        Hiệu suất khách sạn
      </Typography>

      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Khách ghé thăm'
            value='86'
            change='26% so với tuần trước'
            subtitle='Khách ghé thăm tăng – bạn hãy thêm những ưu đãi để hút khách hơn nữa'
            data={dataEventVisit}
            markedDateStart={dataEventVisit?.end?.[0]?.date}
            markedDateEnd={
              dataEventVisit?.end?.[dataEventVisit?.end?.length - 1]?.date
            }
            setDateRangeRevenueEvent={setDateRangeRevenueEvent}
            dateRangeRevenueEvent={dateRangeRevenueEvent}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Lượt xem'
            value='260'
            change='26% so với tuần trước'
            subtitle='Khách ít quan tâm – bạn hãy thử chiến dịch truyền thông để kéo lại sự chú ý'
            data={dataEventView}
            markedDateStart={dataEventView?.end?.[0]?.date}
            markedDateEnd={
              dataEventView?.end?.[dataEventView?.end?.length - 1]?.date
            }
            setDateRangeRevenueEvent={setDateRangeRevenueEventView}
            dateRangeRevenueEvent={dateRangeRevenueEventView}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Lượt đặt phòng'
            value='86'
            change='26% so với tuần trước'
            subtitle='Đặt phòng đang tăng -  bạn hãy thêm những ưu đãi để hút khách hơn nữa'
            data={dataEventBooked}
            markedDateStart={dataEventBooked?.end?.[0]?.date}
            markedDateEnd={
              dataEventBooked?.end?.[dataEventBooked?.end?.length - 1]?.date
            }
            setDateRangeRevenueEvent={setDateRangeRevenueEvent}
            dateRangeRevenueEvent={dateRangeRevenueEvent}
            setRoomType={setRoomTypeBooking}
            roomType={roomTypeBooking}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Lượt nhận phòng'
            value='260'
            change='26% so với tuần trước'
            subtitle='Khách nhận phòng giảm -  cần xem lại trải nghiệm khách khi nhận phòng'
            data={dataEventCheckin}
            markedDateStart={dataEventCheckin?.end?.[0]?.date}
            markedDateEnd={
              dataEventCheckin?.end?.[dataEventCheckin?.end?.length - 1]?.date
            }
            setDateRangeRevenueEvent={setDateRangeRevenueEventView}
            dateRangeRevenueEvent={dateRangeRevenueEventView}
            setRoomType={setRoomTypeCheckin}
            roomType={roomTypeCheckin}
          />
        </Grid>
      </Grid>

      {/* Doanh thu */}
      <Typography variant='h6' fontWeight='bold' mb={4}>
        Doanh thu
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RevenueCompareChart
            setRoomTypeGeneral={setRoomTypeGeneral}
            dataGeneralRoomType={dataGeneralRoomType}
            roomTypeGeneral={roomTypeGeneral}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RevenuePaymentChart
            setDateRangeRevenueMethod={setDateRangeRevenueMethod}
            dateRangeRevenueMethod={dateRangeRevenueMethod}
            dataGeneralMethod={dataGeneralMethod}
          />
        </Grid>
      </Grid>
      {/* <Review dataReview={dataReview} /> */}
    </Box>
  );
}
const Review = ({ dataReview }) => {
  const {
    total_reviews = 0,
    avg_rating = 0,
    rating_stats = {},
    recent_reviews = [],
  } = dataReview || {};
  const navigate = useNavigate();
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        sx={{
          fontSize: 14,
          color: i < Math.floor(rating) ? "#98b720" : "#e0e0e0",
        }}
      />
    ));
  };

  const starOrder = [5, 4, 3, 2, 1];

  return (
    <Stack mt={5} spacing={4}>
      {/* HEADER */}
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h6' fontWeight='bold'>
          Tổng quan Đánh giá
        </Typography>

        <Button
          variant='outlined'
          onClick={() => navigate("/review")}
          sx={{
            borderColor: "#98b720",
            color: "#98b720",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            py: 1,
            "&:hover": { borderColor: "#7a9a1a", bgcolor: "#f0f8f0" },
          }}>
          Xem tất cả đánh giá
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, p: 4 }}>
        <Grid container alignItems='center'>
          {/* AVG SCORE */}
          <Grid item xs={12} md={6}>
            <Box display='flex' gap={2}>
              <Box
                sx={{
                  bgcolor: "#98b720",
                  color: "white",
                  borderRadius: "12px",
                  px: 5,
                  py: 2.5,
                  display: "flex",
                  alignItems: "center",
                }}>
                <Typography variant='h2'>{avg_rating.toFixed(1)}</Typography>
              </Box>

              <Box>
                <Typography fontWeight={600} fontSize='1.4rem' color='#98b720'>
                  Xuất sắc
                </Typography>
                <Typography fontSize='0.85rem'>
                  Từ {total_reviews} đánh giá
                </Typography>
                <Typography fontSize='0.8rem' color='#999'>
                  Bởi người dùng trong Booking Hotel
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* RATING STATS */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {starOrder.map((star) => {
                const count = rating_stats[star] || 0;
                const percent = total_reviews
                  ? (count / total_reviews) * 100
                  : 0;

                return (
                  <Stack
                    key={star}
                    direction='row'
                    alignItems='center'
                    spacing={2}>
                    <Typography width={40} fontSize='0.9rem'>
                      {star} ⭐
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant='determinate'
                        value={percent}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#98b720",
                          },
                        }}
                      />
                    </Box>

                    <Typography
                      fontWeight={600}
                      fontSize='0.9rem'
                      color='#98b720'>
                      {count}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        </Grid>

        {/* RECENT REVIEWS */}
        <Grid mt={5} container spacing={3}>
          {recent_reviews.length === 0 ? (
            <Typography color='#999' textAlign='center' width='100%'>
              Chưa có đánh giá nào
            </Typography>
          ) : (
            recent_reviews.slice(0, 3).map((review) => (
              <Grid item xs={12} md={4} key={review.id}>
                <Paper
                  sx={{
                    borderRadius: "16px",
                    p: 2.5,
                    border: "1px solid #eee",
                  }}>
                  <Stack spacing={1.5}>
                    <Stack direction='row' spacing={1.5}>
                      <img
                        src={review.avatar}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                        alt=''
                      />
                      <Box>
                        <Typography fontWeight={600}>
                          {review.user_name}
                        </Typography>
                        <Stack direction='row' spacing={0.5}>
                          {renderStars(review.rate)}
                        </Stack>
                      </Box>
                    </Stack>

                    <Typography fontSize='0.9rem' color='#666'>
                      {review.comment}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Card>
    </Stack>
  );
};

import { Popover, Divider, Badge } from "@mui/material";
import {
  Notifications,
  AccessTime,
  Hotel,
  CheckCircle,
  Cancel,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";
import SimpleDateSelect from "../../components/SimpleDateSelect";
import SimpleDatePopup from "../../components/SimpleDateSelect";

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      margin: 8,
      borderRadius: 20,
    },
  },
}));

const NotificationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
  cursor: "pointer",
}));

const TimeText = styled(Typography)({
  fontSize: "12px",
  color: "#999",
  marginTop: 8,
});

function NotificationPopover({ handleClick, anchorEl, setAnchorEl }) {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Fake data giống hệt ảnh bạn gửi
  const bookingNotifications = [
    {
      type: "success",
      title: "Bạn có đặt phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
    {
      type: "cancel",
      title: "Khách đã hủy phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
    {
      type: "success",
      title: "Bạn có đặt phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
  ];

  const paymentNotifications = [
    {
      type: "pending",
      title: "Thanh toán đối soát tháng 11, 2025 đã được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "completed",
      title: "Hotel Booking đã gửi đối soát tháng 11, 2025:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "rejected",
      title: "Đối soát tháng 11,2025 đang được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
  ];

  return (
    <>
      {/* Nút mở popover (thường là icon chuông) */}

      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <Box>
          {/* Header */}
          <Box
            px={3}
            py={2}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom='1px solid #eee'>
            <Typography variant='h6' fontWeight={700}>
              Thông báo
            </Typography>
            <Button
              onClick={() => navigate("/notificate")}
              size='small'
              sx={{ textTransform: "none", fontSize: "14px" }}>
              Xem tất cả
            </Button>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant='fullWidth'
            sx={{
              borderBottom: "1px solid #eee",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14.5px",
                fontWeight: 600,
              },
              "& .Mui-selected": {
                color: "#4caf50",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4caf50",
                height: 3,
              },
            }}>
            <Tab label='Đặt phòng' />
            <Tab label='Đối soát và thanh toán' />
          </Tabs>

          {/* Nội dung tab */}
          <Box maxHeight='70vh' sx={{ overflowY: "auto" }}>
            {tab === 0
              ? // Tab Đặt phòng
                bookingNotifications.map((notif, i) => (
                  <NotificationItem key={i}>
                    <Stack direction='row' spacing={2} alignItems='flex-start'>
                      <Badge
                        badgeContent=' '
                        color='error'
                        variant='dot'
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{
                          "& .MuiBadge-badge": {
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                          },
                        }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              notif.type === "success"
                                ? "#e8f5e9"
                                : notif.type === "cancel"
                                ? "#ffebee"
                                : "#fff3e0",
                            width: 44,
                            height: 44,
                          }}>
                          {notif.type === "success" ? (
                            <CheckCircle sx={{ color: "#4caf50" }} />
                          ) : notif.type === "cancel" ? (
                            <Cancel sx={{ color: "#e53935" }} />
                          ) : (
                            <Hotel sx={{ color: "#fb8c00" }} />
                          )}
                        </Avatar>
                      </Badge>

                      <Box flex={1}>
                        <Typography fontWeight={600} fontSize='15px' mb={0.5}>
                          {notif.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Khách sạn: {notif.hotel}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Loại phòng: {notif.roomType}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Thời gian: {notif.time}
                        </Typography>
                        <TimeText>{notif.timeAgo}</TimeText>
                      </Box>
                    </Stack>
                    {i < bookingNotifications.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </NotificationItem>
                ))
              : // Tab Đối soát và thanh toán
                paymentNotifications.map((notif, i) => (
                  <NotificationItem key={i}>
                    <Stack direction='row' spacing={2} alignItems='flex-start'>
                      <Badge
                        badgeContent=' '
                        color='error'
                        variant='dot'
                        invisible={notif.type === "completed"}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              notif.type === "pending"
                                ? "#fff3e0"
                                : notif.type === "completed"
                                ? "#e8f5e9"
                                : "#fff8e1",
                            width: 44,
                            height: 44,
                          }}>
                          <Receipt
                            sx={{
                              color:
                                notif.type === "pending"
                                  ? "#fb8c00"
                                  : notif.type === "completed"
                                  ? "#4caf50"
                                  : "#ef6c00",
                            }}
                          />
                        </Avatar>
                      </Badge>

                      <Box flex={1}>
                        <Typography fontWeight={600} fontSize='15px' mb={0.5}>
                          {notif.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Khách sạn: {notif.hotel}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Tổng cộng nợ: {notif.amount}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Số lượng đặt phòng: {notif.rooms}
                        </Typography>
                        <TimeText>{notif.timeAgo}</TimeText>
                      </Box>
                    </Stack>
                    {i < paymentNotifications.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </NotificationItem>
                ))}
          </Box>
        </Box>
      </StyledPopover>
    </>
  );
}

import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import HotelSelect from "../../components/HotelSelect";

type RoomType = "all" | "hourly" | "overnight" | "daily";

interface RoomTypeSelectProps extends Omit<SelectProps<RoomType>, "onChange"> {
  value?: RoomType;
  onChange?: (value: RoomType) => void;
}

const RoomTypeSelect: React.FC<RoomTypeSelectProps> = ({
  value: controlledValue,
  onChange: controlledOnChange,
  ...props
}) => {
  // Nếu không truyền value/onChange từ props thì dùng state nội bộ
  const [internalValue, setInternalValue] = React.useState<RoomType>("all");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (event: SelectChangeEvent<RoomType>) => {
    const newValue = event.target.value as RoomType;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    controlledOnChange?.(newValue);
  };

  const getDisplayText = (val: RoomType) => {
    switch (val) {
      case "hourly":
        return "Theo giờ";
      case "overnight":
        return "Qua đêm";
      case "daily":
        return "Theo ngày";
      default:
        return "Tất cả các loại đặt phòng";
    }
  };

  return (
    <FormControl {...props}>
      <Select<RoomType>
        labelId='room-type-select-label'
        value={value}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty // Để hiển thị placeholder khi value là 'all'
        renderValue={(selected) => getDisplayText(selected as RoomType)}
        input={
          <OutlinedInput
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
        }>
        <MenuItem value='all'>Tất cả các loại đặt phòng</MenuItem>
        <MenuItem value='hourly'>Theo giờ</MenuItem>
        <MenuItem value='overnight'>Qua đêm</MenuItem>
        <MenuItem value='daily'>Theo ngày</MenuItem>
      </Select>
    </FormControl>
  );
};
