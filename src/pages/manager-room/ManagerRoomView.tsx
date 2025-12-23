import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  useMediaQuery,
  Card,
  Checkbox,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const parseVi = (value?: string) => {
  if (!value) return "";

  try {
    const parsed = JSON.parse(value);
    return parsed?.vi || value;
  } catch (e) {
    return value; // không phải JSON
  }
};
export default function ManagerRoomView({
  setActive,
  active,
  setDateRange,
  dateRange,
  loading,
  data,
  hotels,
  idHotel,
  setIdHotel,
  setData,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openQuickBlock, setOpenQuickBlock] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [action, setAction] = useState("manager");

  const tabs = [
    { key: "hourly", label: "Theo giờ" },
    { key: "overnight", label: "Qua đêm" },
    { key: "daily", label: "Theo ngày" },
  ];

  return (
    <>
      {action == "create" && (
        <CreateRoom idHotel={idHotel} setAction={setAction} />
      )}
      {action == "lock" && <LockRoomSetup setAction={setAction} />}
      {action == "manager" && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            {/* Left section */}
            <Box display='flex' flexDirection='column' gap={0.5}>
              <Typography variant='h5' fontWeight='bold'>
                Danh sách loại phòng
              </Typography>

              <Box display='flex' alignItems='center' gap={1}>
                <HotelSelect
                  value={idHotel}
                  hotelsData={hotels}
                  onChange={(id) => {
                    setIdHotel(id);
                    console.log("ID khách sạn được chọn:", id);
                  }}
                />

                <Box display='flex' alignItems='center' gap={0.5} ml={2}>
                  <RefreshIcon sx={{ fontSize: 18, color: "#7CB518" }} />
                  <Typography fontSize={13} color='#7CB518' fontWeight={500}>
                    Nhấn cập nhật dữ liệu
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right section */}
            <Box display='flex' alignItems='center' gap={2}>
              <Box
                display='flex'
                alignItems='center'
                onClick={() => setAction("lock")}
                gap={0.5}
                sx={{ cursor: "pointer" }}>
                <LockIcon sx={{ fontSize: 18, color: "#7CB518" }} />
                <Typography fontSize={14} color='#7CB518' fontWeight={500}>
                  Khóa phòng
                </Typography>
              </Box>

              

              {/* <Box
                display='flex'
                alignItems='center'
                gap={0.5}
                onClick={() => setAction("create")}
                sx={{ cursor: "pointer" }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: "#7CB518" }} />
                <Typography fontSize={14} color='#7CB518' fontWeight={500}>
                  Tạo thêm loại phòng
                </Typography>
              </Box> */}
            </Box>
          </Box>
          <Card sx={{ mt: 4 }}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              py={2}
              px={isMobile ? 1 : 2}
              sx={{ background: "#fff" }}>
              {/* Tabs */}
              <Box display='flex' alignItems='center' gap={3}>
                {tabs.map((t) => (
                  <Box
                    key={t.key}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setData([]);
                      setActive(t.key);
                    }}>
                    <Typography
                      fontSize={17}
                      fontWeight={500}
                      sx={{
                        color: active === t.key ? "#8BC34A" : "#555",
                        borderBottom:
                          active === t.key
                            ? "2px solid #8BC34A"
                            : "2px solid transparent",
                        pb: 0.5,
                        transition: "all 0.25s",
                      }}>
                      {t.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {/* Date Range */}
              <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
            </Box>
            <Box py={3}>
              {active == "hourly" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableHourly
                        handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {active == "daily" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableDaily
                        handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {active == "overnight" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableOvernight
                        handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </Box>
          </Card>
          <QuickBlockDialog
            openQuickBlock={openQuickBlock}
            onClose={() => setOpenQuickBlock(false)}
          />
          <EditOperationDialog
            openEdit={openEdit}
            onClose={() => setOpenEdit(false)}
          />
        </Box>
      )}
    </>
  );
}
("use client");

import {
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
dayjs.locale("vi");

function QuickBlockDialog({ openQuickBlock, onClose }) {
  const [blockType] = useState("Theo giờ");
  const [startDate] = useState(dayjs("19/11/2025", "DD/MM/YYYY"));
  const [endDate] = useState(dayjs("21/11/2025", "DD/MM/YYYY"));
  const [startTime] = useState(dayjs().hour(15).minute(0));
  const [endTime] = useState(dayjs().hour(16).minute(0));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <Dialog
        open={openQuickBlock}
        maxWidth='sm'
        fullWidth
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            m: 0,
            borderRadius: { xs: 0, sm: "24px" },
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            position: "relative",
            borderBottom: "1px solid #eee",
          }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, fontSize: "18px", color: "#333" }}>
            Khóa nhanh
          </Typography>
          <IconButton sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon onClick={onClose} sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: "#fff", p: 3 }}>
          <Stack spacing={3.5}>
            {/* Khách sạn */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Khách sạn muốn khóa:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#333",
                }}>
                Khách sạn 123
              </Box>
            </Box>

            {/* Loại phòng */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Loại phòng:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1b5e20",
                }}>
                Vip123
              </Box>
            </Box>

            {/* Loại đặt phòng muốn khóa */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Loại đặt phòng muốn khóa
              </Typography>
              <FormControl fullWidth sx={{ mt: 0.8, width: "60%" }}>
                <Select
                  value={blockType}
                  size='small'
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": { py: 1.6, fontSize: "14px" },
                    borderRadius: "8px",
                    height: "40px",
                  }}>
                  <MenuItem value='Theo giờ'>Theo giờ</MenuItem>
                  <MenuItem value='Qua đêm'>Qua đêm</MenuItem>
                  <MenuItem value='Theo ngày'>Theo ngày</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Khoảng thời gian */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Khoảng thời gian
              </Typography>
              <Stack
                direction='row'
                alignItems='center'
                width={"60%"}
                spacing={1.5}
                mt={1}>
                <MobileDatePicker
                  value={startDate}
                  format='DD/MM/YYYY'
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                    },
                  }}
                />
                <Typography color='#aaa' fontSize={14}>
                  —
                </Typography>
                <MobileDatePicker
                  value={endDate}
                  format='DD/MM/YYYY'
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Khung giờ */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Khung giờ
              </Typography>
              <Stack
                direction='row'
                alignItems='center'
                width={"60%"}
                spacing={2}
                mt={1}>
                <MobileTimePicker
                  value={startTime}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "15:00",
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                      InputProps: {
                        endAdornment: (
                          <AccessTimeIcon
                            sx={{ fontSize: 18, color: "#999" }}
                          />
                        ),
                      },
                    },
                  }}
                />
                <Typography color='#aaa' fontSize={18}>
                  —
                </Typography>
                <MobileTimePicker
                  value={endTime}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "16:00",
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                      InputProps: {
                        endAdornment: (
                          <AccessTimeIcon
                            sx={{ fontSize: 18, color: "#999" }}
                          />
                        ),
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Hộp thông báo giống hệt */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#f5f8e9",
                border: "1px solid #c8e6c9",
                borderRadius: "12px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}>
              <CheckCircle sx={{ fontSize: 18, color: "#66bb6a", mt: 0.3 }} />
              <Box>
                <Typography fontSize={13} color='#33691e' lineHeight={1.5}>
                  Khách sẽ không thể đặt phòng tại{" "}
                  <strong>Khách sạn 123</strong> đối với đặt phòng:
                </Typography>
                <Chip
                  label='Theo giờ'
                  size='small'
                  sx={{
                    mt: 1,
                    bgcolor: "#98B720",
                    color: "white",
                    fontWeight: 600,
                    height: 26,
                    fontSize: "12px",
                  }}
                />
                <Typography
                  fontSize={13}
                  color='#1b5e20'
                  mt={1}
                  fontWeight={500}>
                  15:00 - 16:00 từ ngày 19/11/2025 - 21/11/2025
                </Typography>
              </Box>
            </Paper>

            {/* Nút hành động - giống hệt ảnh */}
            <Stack
              direction='row'
              justifyContent='space-between'
              spacing={2}
              mt={2}>
              <Button
                variant='outlined'
                onClick={onClose}
                sx={{
                  flex: 1,
                  borderRadius: "50px",
                  borderColor: "#ddd",
                  color: "#666",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": { borderColor: "#ccc" },
                }}>
                Hủy
              </Button>

              <Button
                variant='contained'
                sx={{
                  flex: 1,
                  borderRadius: "50px",
                  bgcolor: "#98B720",
                  "&:hover": { bgcolor: "#4caf50" },
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  boxShadow: "none",
                  fontSize: "15px",
                }}>
                Thêm lịch khóa phòng
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
import { TextField } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LaunchIcon from "@mui/icons-material/Launch";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";

// Định nghĩa type cho props

interface Slot {
  hour: string;
  from: string;
  to: string;
  booked_rooms: number;
  remaining_rooms: number;
  status: string;
}

interface RoomScheduleTableHourlyProps {
  handleOpenQuickBlock: () => void;
  handleOpenEdit: () => void;
  data: {
    room_type_id: string;
    start_time: string;
    end_time: string;
    slots: Slot[];
    price_hourly: number;
    price_hourly_increment: number;
    currency: string;
  };
}

// Nhóm slot theo ngày + giữ nguyên thứ tự giờ
const groupSlotsByDate = (slots: Slot[]) => {
  const groups: { [key: string]: Slot[] } = {};

  slots?.forEach((slot) => {
    const dateKey = slot.from.split("T")[0]; // "2025-12-08"
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(slot);
  });

  return Object.entries(groups)
    .map(([date, slots]) => {
      const dateObj = new Date(date);
      return {
        date,
        dayOfMonth: format(dateObj, "d"),
        dayName: format(dateObj, "EEEE", { locale: vi })
          .replace("Chủ nhật", "CN")
          .replace("Thứ ", "thứ ")
          .toLowerCase(),
        slots: slots.sort((a, b) => a.hour.localeCompare(b.hour)), // đảm bảo giờ tăng dần
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

function RoomScheduleTableHourly({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}: RoomScheduleTableHourlyProps) {
  const dayGroups = groupSlotsByDate(data?.slots);
  const totalSlots = data?.slots?.length;
  const columnWidth = `${100 / totalSlots}%`;

  const scrollRef = useRef<HTMLDivElement>(null);
  console.log("AAAA", dayGroups);
  return (
    <Box p={2} bgcolor='#fff'>
      {/* CHỈ 1 CONTAINER CUỘN DUY NHẤT */}
      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar": { height: 10 },
          "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
          border: "1px solid #ccc",
        }}>
        {/* BẢNG THẬT - CỘT TRÁI CỐ ĐỊNH, PHẦN PHẢI CUỘN */}
        <Box minWidth='fit-content'>
          {" "}
          {/* Đảm bảo đủ rộng để có scroll */}
          {/* HEADER */}
          <Box display='flex'>
            {/* Cột trái cố định */}
            <Box
              width='280px'
              flexShrink={0}
              bgcolor={"white"}
              position='sticky'
              left={0}
              zIndex={10}
              borderRight='2px solid #ddd'
              borderBottom='2px solid #ddd'
            />

            {/* Header phải */}
            <Box flex={1}>
              {/* Tháng */}
              <Box
                textAlign='start'
                py={1.5}
                px={2}
                borderBottom='1px solid #eee'
                bgcolor='#f9f9f9'>
                <Typography fontWeight={600} fontSize={16}>
                  {format(new Date(data?.start_time), "MMMM yyyy", {
                    locale: vi,
                  })}
                </Typography>
              </Box>

              {/* Các ngày - căn giữa trên nhóm slot */}
              <Box borderBottom='1px solid #ddd' bgcolor='white'>
                <Box display='flex'>
                  {dayGroups?.map((g) => {
                    const w = (g?.slots?.length / totalSlots) * 100;
                    return (
                      <Box
                        key={g.date}
                        width={`${w}%`}
                        minWidth={`${g.slots.length * 80}px`}
                        display='flex'
                        justifyContent='start'
                        py={2}>
                        <Button
                          variant='contained'
                          sx={{
                            bgcolor: "#98b720",
                            color: "white",
                            fontWeight: 600,
                            minWidth: "140px",
                            height: "40px",
                            fontSize: "15px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                            "&:hover": { bgcolor: "#80a61a" },
                          }}>
                          {g.dayOfMonth} {g.dayName}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Header giờ */}
              <Box
                display='flex'
                borderBottom='2px solid #ddd'
                bgcolor='#f5f5f5'>
                {data?.slots?.map((s, i) => (
                  <Box
                    key={i}
                    width={columnWidth}
                    minWidth='150px'
                    py={2}
                    textAlign='center'
                    borderRight='1px solid #eee'>
                    <Typography fontWeight={600} fontSize={15}>
                      {s.hour}
                    </Typography>
                    <Typography fontSize={11} color='#888'>
                      {format(new Date(s.from), "dd/MM")}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          {/* CÁC DÒNG DỮ LIỆU */}
          {[
            { label: parseVi(data?.name), isName: true },
            {
              label: "Tình trạng phòng",
              action: "Khóa nhanh",
              onClick: handleOpenQuickBlock,
              isStatus: true,
            },
            { label: "Số phòng đặt", isBooked: true },
            {
              label: "Số phòng còn lại",
              action: "Chỉnh sửa",
              onClick: handleOpenEdit,
              isRemaining: true,
            },
          ].map((row, idx) => (
            <Box key={idx} display='flex'>
              {/* Cột trái cố định */}
              <Box
                width='280px'
                flexShrink={0}
                bgcolor={idx === 0 ? "white" : "#fafafa"}
                position='sticky'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'
                borderBottom='1px solid #ddd'>
                <Box
                  px={3}
                  py={2}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'>
                  {row.isName ? (
                    <>
                      <Typography
                        fontWeight={700}
                        fontSize={18}
                        display='flex'
                        alignItems='center'
                        gap={1}>
                        {row.label} <KeyboardArrowUpIcon />
                      </Typography>
                      <Typography
                        color='#98b720'
                        display='flex'
                        alignItems='center'
                        gap={0.5}
                        sx={{ cursor: "pointer" }}>
                        Xem <LaunchIcon fontSize='small' />
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={500}>{row.label}</Typography>
                      {row.action && (
                        <Typography
                          onClick={row.onClick}
                          sx={{
                            cursor: "pointer",
                            color: "#98b720",
                            fontWeight: 600,
                          }}>
                          {row.action}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Dữ liệu phải */}
              <Box flex={1} display='flex'>
                {data?.slots?.map((slot, i) => (
                  <Box
                    key={i}
                    width={columnWidth}
                    minWidth='150px'
                    borderRight='1px solid #eee'
                    borderBottom='1px solid #eee'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    py={1}>
                    {row.isStatus && (
                      <Box
                        px={2}
                        py={1}
                        borderRadius='50px'
                        fontSize={13}
                        fontWeight={500}
                        bgcolor={
                          slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"
                        }
                        color={
                          slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"
                        }>
                        {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                      </Box>
                    )}
                    {row.isBooked && (
                      <Typography fontWeight={600} color='#333'>
                        {slot.booked_rooms}
                      </Typography>
                    )}
                    {row.isRemaining && (
                      <TextField
                        defaultValue={slot.remaining_rooms}
                        size='small'
                        sx={{ width: 50 }}
                        inputProps={{
                          style: { textAlign: "center", fontWeight: 600 },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
          {/* GIÁ - CŨNG CỐ ĐỊNH TRÁI */}
          {[
            {
              label: "Giá phòng/2h đầu",
              value: `${data?.price_hourly?.toLocaleString("vi-VN")}đ`,
              bg: "#fff3e9",
              color: "#e65e00",
            },
            {
              label: "Giá 1 giờ thêm",
              value: `${data?.price_hourly_increment?.toLocaleString(
                "vi-VN"
              )}đ`,
              bg: "#eef1ff",
              color: "#4e6aff",
            },
          ].map((p) => (
            <Box key={p.label} display='flex'>
              <Box
                width='280px'
                flexShrink={0}
                bgcolor='#f8f9fa'
                position='sticky'
                borderBottom='1px solid #ddd'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'>
                <Box px={3} py={2}>
                  <Typography fontWeight={500}>{p.label}</Typography>
                </Box>
              </Box>
              <Box flex={1} display='flex' alignItems='center' pl={4}>
                <Box
                  bgcolor={p.bg}
                  color={p.color}
                  px={4}
                  py={1.5}
                  borderRadius='50px'
                  fontWeight={600}
                  fontSize={15}>
                  {p.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

interface DailySlot {
  date: string;
  from: string;
  to: string;
  booked_rooms: number;
  remaining_rooms: number;
  status: string;
}

interface RoomScheduleTableDailyProps {
  handleOpenQuickBlock: () => void;
  handleOpenEdit: () => void;
  data: {
    room_type_id: string;
    start_time: string;
    end_time: string;
    daily_slots: DailySlot[];
    price_daily: number;
    currency: string;
  };
}

function RoomScheduleTableDaily({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}: RoomScheduleTableDailyProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const dailySlots = data?.slots; // 3 ngày
  const totalDays = dailySlots?.length; // 3
  const columnWidth = `${100 / totalDays}%`;

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Box p={isMobile ? 1 : 2} bgcolor='#fff'>
      {/* CHỈ 1 THANH CUỘN DUY NHẤT */}
      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar": { height: 10 },
          "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
          border: "1px solid #ccc",
        }}>
        <Box minWidth='fit-content'>
          {/* HEADER */}
          <Box display='flex'>
            {/* Cột trái cố định */}
            <Box
              width='280px'
              flexShrink={0}
              bgcolor='white'
              position='sticky'
              left={0}
              zIndex={10}
              borderRight='2px solid #ddd'
              borderBottom='2px solid #ddd'
            />

            {/* Header phải */}
            <Box flex={1}>
              {/* Tháng */}
              <Box
                textAlign='start'
                py={1.5}
                px={2}
                borderBottom='1px solid #eee'
                bgcolor='#f9f9f9'>
                <Typography fontWeight={600} fontSize={16}>
                  {format(new Date(data.start_time), "MMMM yyyy", {
                    locale: vi,
                  })}
                </Typography>
              </Box>

              {/* Các ngày - mỗi ngày 1 cột */}
              <Box display='flex' borderBottom='2px solid #ddd' bgcolor='white'>
                {dailySlots?.map((slot) => {
                  const dateObj = new Date(slot.date);
                  const dayNum = dateObj && format(dateObj, "dd");
                  const dayName =
                    dateObj &&
                    format(dateObj, "EEEE", { locale: vi })
                      .replace("Chủ nhật", "CN")
                      .replace("Thứ ", "thứ ")
                      .toLowerCase();

                  return (
                    <Box
                      key={slot.date}
                      width={columnWidth}
                      minWidth='150px'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      py={2}
                      borderRight='1px solid #eee'>
                      <Button
                        variant='contained'
                        sx={{
                          bgcolor: "#98b720",
                          color: "white",
                          fontWeight: 600,
                          minWidth: "140px",
                          height: "40px",
                          fontSize: "15px",
                          borderRadius: "20px",
                          boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                          "&:hover": { bgcolor: "#80a61a" },
                        }}>
                        {dayNum} {dayName}
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* CÁC DÒNG DỮ LIỆU */}
          {[
            { label:  parseVi(data?.name), isName: true },
            {
              label: "Tình trạng phòng",
              action: "Khóa nhanh",
              onClick: handleOpenQuickBlock,
              isStatus: true,
            },
            { label: "Số phòng đặt", isBooked: true },
            {
              label: "Số phòng còn lại",
              action: "Chỉnh sửa",
              onClick: handleOpenEdit,
              isRemaining: true,
            },
          ].map((row, idx) => (
            <Box key={idx} display='flex' borderBottom='1px solid #eee'>
              {/* Cột trái cố định */}
              <Box
                width='280px'
                flexShrink={0}
                bgcolor={idx === 0 ? "white" : "#fafafa"}
                position='sticky'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'
                borderBottom='1px solid #ddd'>
                <Box
                  px={3}
                  py={2}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'>
                  {row.isName ? (
                    <>
                      <Typography
                        fontWeight={700}
                        fontSize={18}
                        display='flex'
                        alignItems='center'
                        gap={1}>
                        {row.label} <KeyboardArrowUpIcon />
                      </Typography>
                      <Typography
                        color='#98b720'
                        display='flex'
                        alignItems='center'
                        gap={0.5}
                        sx={{ cursor: "pointer" }}>
                        Xem <LaunchIcon fontSize='small' />
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={500}>{row.label}</Typography>
                      {row.action && (
                        <Typography
                          onClick={row.onClick}
                          sx={{
                            cursor: "pointer",
                            color: "#98b720",
                            fontWeight: 600,
                          }}>
                          {row.action}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Dữ liệu phải - 3 cột */}
              <Box flex={1} display='flex'>
                {dailySlots?.map((slot, i) => (
                  <Box
                    key={i}
                    width={columnWidth}
                    minWidth='150px'
                    borderRight='1px solid #eee'
                    borderBottom='1px solid #eee'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    py={2}>
                    {row.isStatus && (
                      <Box
                        px={2}
                        py={1}
                        borderRadius='50px'
                        fontSize={13}
                        fontWeight={500}
                        bgcolor={
                          slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"
                        }
                        color={
                          slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"
                        }>
                        {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                      </Box>
                    )}
                    {row.isBooked && (
                      <Typography fontWeight={600} color='#333'>
                        {slot.booked_rooms}
                      </Typography>
                    )}
                    {row.isRemaining && (
                      <TextField
                        defaultValue={slot.remaining_rooms}
                        size='small'
                        sx={{ width: 50 }}
                        inputProps={{
                          style: { textAlign: "center", fontWeight: 600 },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}

          {/* GIÁ */}
          {[
            {
              label: "Giá phòng/đêm",
              value: `${data?.price_daily?.toLocaleString("vi-VN")}đ`,
              bg: "#fff3e9",
              color: "#e65e00",
            },
          ].map((p) => (
            <Box key={p.label} display='flex'>
              <Box
                width='280px'
                flexShrink={0}
                bgcolor='#f8f9fa'
                position='sticky'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'
                borderBottom='1px solid #ddd'>
                <Box px={3} py={2}>
                  <Typography fontWeight={500}>{p.label}</Typography>
                </Box>
              </Box>
              <Box flex={1} display='flex' alignItems='center' pl={4}>
                <Box
                  bgcolor={p.bg}
                  color={p.color}
                  px={4}
                  py={1.5}
                  borderRadius='50px'
                  fontWeight={600}
                  fontSize={15}>
                  {p.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
function RoomScheduleTableOvernight({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}: RoomScheduleTableDailyProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const dailySlots = data?.slots; // 3 ngày
  const totalDays = dailySlots?.length; // 3
  const columnWidth = `${100 / totalDays}%`;

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Box p={isMobile ? 1 : 2} bgcolor='#fff'>
      {/* CHỈ 1 THANH CUỘN DUY NHẤT */}
      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar": { height: 10 },
          "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
          border: "1px solid #ccc",
        }}>
        <Box minWidth='fit-content'>
          {/* HEADER */}
          <Box display='flex'>
            {/* Cột trái cố định */}
            <Box
              width='280px'
              flexShrink={0}
              bgcolor='white'
              position='sticky'
              left={0}
              zIndex={10}
              borderRight='2px solid #ddd'
              borderBottom='2px solid #ddd'
            />

            {/* Header phải */}
            <Box flex={1}>
              {/* Tháng */}
              <Box
                textAlign='start'
                py={1.5}
                px={2}
                borderBottom='1px solid #eee'
                bgcolor='#f9f9f9'>
                <Typography fontWeight={600} fontSize={16}>
                  {format(new Date(data.start_time), "MMMM yyyy", {
                    locale: vi,
                  })}
                </Typography>
              </Box>

              {/* Các ngày - mỗi ngày 1 cột */}
              <Box display='flex' borderBottom='2px solid #ddd' bgcolor='white'>
                {dailySlots?.map((slot) => {
                  const dateObj = new Date(slot?.date);
                  const dayNum = dateObj && format(dateObj, "dd");
                  const dayName =
                    dateObj &&
                    format(dateObj, "EEEE", { locale: vi })
                      .replace("Chủ nhật", "CN")
                      .replace("Thứ ", "thứ ")
                      .toLowerCase();

                  return (
                    <Box
                      key={slot.date}
                      width={columnWidth}
                      minWidth='150px'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      py={2}
                      borderRight='1px solid #eee'>
                      <Button
                        variant='contained'
                        sx={{
                          bgcolor: "#98b720",
                          color: "white",
                          fontWeight: 600,
                          minWidth: "140px",
                          height: "40px",
                          fontSize: "15px",
                          borderRadius: "20px",
                          boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                          "&:hover": { bgcolor: "#80a61a" },
                        }}>
                        {dayNum} {dayName}
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* CÁC DÒNG DỮ LIỆU */}
          {[
            { label:  parseVi(data?.name), isName: true },
            {
              label: "Tình trạng phòng",
              action: "Khóa nhanh",
              onClick: handleOpenQuickBlock,
              isStatus: true,
            },
            { label: "Số phòng đặt", isBooked: true },
            {
              label: "Số phòng còn lại",
              action: "Chỉnh sửa",
              onClick: handleOpenEdit,
              isRemaining: true,
            },
          ]?.map((row, idx) => (
            <Box key={idx} display='flex' borderBottom='1px solid #eee'>
              {/* Cột trái cố định */}
              <Box
                width='280px'
                flexShrink={0}
                bgcolor={idx === 0 ? "white" : "#fafafa"}
                position='sticky'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'
                borderBottom='1px solid #ddd'>
                <Box
                  px={3}
                  py={2}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'>
                  {row.isName ? (
                    <>
                      <Typography
                        fontWeight={700}
                        fontSize={18}
                        display='flex'
                        alignItems='center'
                        gap={1}>
                        {row.label} <KeyboardArrowUpIcon />
                      </Typography>
                      <Typography
                        color='#98b720'
                        display='flex'
                        alignItems='center'
                        gap={0.5}
                        sx={{ cursor: "pointer" }}>
                        Xem <LaunchIcon fontSize='small' />
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={500}>{row.label}</Typography>
                      {row.action && (
                        <Typography
                          onClick={row.onClick}
                          sx={{
                            cursor: "pointer",
                            color: "#98b720",
                            fontWeight: 600,
                          }}>
                          {row.action}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Dữ liệu phải - 3 cột */}
              <Box flex={1} display='flex'>
                {dailySlots?.map((slot, i) => (
                  <Box
                    key={i}
                    width={columnWidth}
                    minWidth='150px'
                    borderRight='1px solid #eee'
                    borderBottom='1px solid #eee'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    py={2}>
                    {row.isStatus && (
                      <Box
                        px={2}
                        py={1}
                        borderRadius='50px'
                        fontSize={13}
                        fontWeight={500}
                        bgcolor={
                          slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"
                        }
                        color={
                          slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"
                        }>
                        {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                      </Box>
                    )}
                    {row.isBooked && (
                      <Typography fontWeight={600} color='#333'>
                        {slot.booked_rooms}
                      </Typography>
                    )}
                    {row.isRemaining && (
                      <TextField
                        defaultValue={slot.remaining_rooms}
                        size='small'
                        sx={{ width: 50 }}
                        inputProps={{
                          style: { textAlign: "center", fontWeight: 600 },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}

          {/* GIÁ */}
          {[
            {
              label: "Giá phòng/đêm",
              value: `${data?.price_overnight?.toLocaleString("vi-VN")}đ`,
              bg: "#fff3e9",
              color: "#e65e00",
            },
          ].map((p) => (
            <Box key={p.label} display='flex'>
              <Box
                width='280px'
                flexShrink={0}
                bgcolor='#f8f9fa'
                position='sticky'
                left={0}
                zIndex={10}
                borderRight='2px solid #ddd'
                borderBottom='1px solid #ddd'>
                <Box px={3} py={2}>
                  <Typography fontWeight={500}>{p.label}</Typography>
                </Box>
              </Box>
              <Box flex={1} display='flex' alignItems='center' pl={4}>
                <Box
                  bgcolor={p.bg}
                  color={p.color}
                  px={4}
                  py={1.5}
                  borderRadius='50px'
                  fontWeight={600}
                  fontSize={15}>
                  {p.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { CalendarToday, AccessTime } from "@mui/icons-material";

import "dayjs/locale/vi";
import LockRoomSetup from "./LockRoomSetup";
import CreateRoom from "./CreateRoom";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";
import Loading from "../../components/Loading";
import HotelSelect from "../../components/HotelSelect";

dayjs.locale("vi");

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function EditOperationDialog({ openEdit, onClose }) {
  const [open] = useState(false);
  const [selectedDays, setSelectedDays] = useState([
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
  ]);
  const [roomCount, setRoomCount] = useState("");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <Dialog
        open={openEdit}
        maxWidth='md'
        fullWidth
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "28px" },
            m: { xs: 0, sm: 4 },
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          },
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            position: "relative",
            borderBottom: "1px solid #eee",
          }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, fontSize: "18px", color: "#333" }}>
            Chỉnh sửa hoạt động
          </Typography>
          <IconButton sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon onClick={onClose} sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: "#fff", p: 3 }}>
          <Stack spacing={3.5}>
            {/* Khách sạn */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Khách sạn muốn khóa:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#333",
                }}>
                Khách sạn 123
              </Box>
            </Box>

            {/* Loại phòng */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Loại phòng:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1b5e20",
                }}>
                Vip123
              </Box>
            </Box>

            {/* Khoảng ngày & Thời gian áp dụng */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* Khoảng ngày */}
              <Box width={"48%"}>
                <Typography
                  fontSize={13.5}
                  color='#777'
                  fontWeight={500}
                  mb={1}>
                  Khoảng ngày áp dụng
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                  <MobileDatePicker
                    slots={{ openPickerIcon: CalendarToday }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Từ ngày",
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <CalendarToday
                                sx={{ fontSize: 18, color: "#999" }}
                              />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                  <Typography color='#aaa' fontSize={20}>
                    —
                  </Typography>
                  <MobileDatePicker
                    slots={{ openPickerIcon: CalendarToday }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Đến ngày",
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Thời gian áp dụng */}
              <Box width={"48%"}>
                <Typography
                  fontSize={13.5}
                  color='#777'
                  fontWeight={500}
                  mb={1}>
                  Thời gian áp dụng
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                  <MobileTimePicker
                    ampm={false}
                    slots={{ openPickerIcon: AccessTime }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Từ giờ",
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <AccessTime
                                sx={{ fontSize: 18, color: "#999" }}
                              />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                  <Typography color='#aaa' fontSize={20}>
                    —
                  </Typography>
                  <MobileTimePicker
                    ampm={false}
                    slots={{ openPickerIcon: AccessTime }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Đến giờ",
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Chọn ngày trong tuần */}
            <Box>
              <Typography fontSize={14} color='#333' fontWeight={500} mb={2}>
                Bạn muốn áp dụng thay đổi cho ngày nào trong tuần?
              </Typography>

              {/* Dùng Flex để dễ căn chỉnh, không cần RadioGroup nữa */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "space-between",
                }}>
                {daysOfWeek.map((day) => {
                  const isChecked = selectedDays.includes(day);

                  return (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          size='small'
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDays([...selectedDays, day]);
                            } else {
                              setSelectedDays(
                                selectedDays.filter((d) => d !== day)
                              );
                            }
                          }}
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 22 },
                            color: isChecked ? "#66bb6a" : "#ccc",
                            "&.Mui-checked": { color: "#66bb6a" },
                          }}
                        />
                      }
                      label={
                        <Typography fontSize={14} fontWeight={500}>
                          {day}
                        </Typography>
                      }
                      sx={{
                        bgcolor: isChecked ? "#e8f5e9" : "#f9f9f9",
                        borderRadius: "12px",
                        px: 2,
                        py: 1,
                        m: 0,
                        border: isChecked
                          ? "1px solid #a5d6a7"
                          : "1px solid #eee",
                        "& .MuiTypography-root": {
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Cập nhật số phòng còn lại */}
            <Box>
              <Typography fontSize={14} color='#333' fontWeight={500} mb={1.5}>
                Cập nhật số phòng còn lại
              </Typography>
              <Stack direction='row' spacing={2}>
                <TextField
                  value={roomCount}
                  onChange={(e) => setRoomCount(e.target.value)}
                  placeholder='Nhập số'
                  size='small'
                  type='number'
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root": {
                      borderRadius: "12px",
                      height: 44,
                    },
                  }}
                />
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#555",
                    borderColor: "#ddd",
                    px: 4,
                    height: 44,
                  }}>
                  Phòng
                </Button>
              </Stack>
            </Box>

            <Box sx={{ height: 16 }} />

            {/* Nút Hủy và Lưu */}
            <Stack direction='row' spacing={2} mt={3}>
              <Button
                fullWidth
                variant='outlined'
                onClick={onClose}
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#777",
                  borderColor: "#ddd",
                  bgcolor: "#f5f5f5",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#eee" },
                }}>
                Hủy
              </Button>
              <Button
                fullWidth
                variant='contained'
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontSize: "15px",
                  fontWeight: 600,
                  bgcolor: "#8bc34a",
                  "&:hover": { bgcolor: "#7cb342" },
                  color: "white",
                  textTransform: "none",
                  boxShadow: "none",
                }}>
                Lưu thay đổi
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
