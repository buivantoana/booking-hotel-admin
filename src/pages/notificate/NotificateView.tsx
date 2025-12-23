"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Divider,
  Chip,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
} from "@mui/material";
import {
  ArrowBack,
  FilterList,
  CheckCircle,
  Cancel,
  Receipt,
  Hotel,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const NotificationCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#fff",
  borderRadius: 16,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  marginBottom: theme.spacing(3),
}));

const TimeText = styled(Typography)({
  fontSize: "13px",
  color: "#999",
  marginTop: 8,
});

export default function NotificateView() {
  const [tab, setTab] = useState(0);

  // Dữ liệu fake giống hệt ảnh bạn gửi
  const bookingNotifications = [
    {
      type: "success",
      title: "Bạn có đặt phòng theo giờ",
      bookingId: "123456",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
    {
      type: "cancel",
      title: "Khách đã hủy phòng theo giờ",
      bookingId: "123456",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      reason: "Không còn nhu cầu",
      timeAgo: "1 phút trước",
    },
    {
      type: "warning",
      title: "Khách không đến nhận phòng",
      bookingId: "123456",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
  ];

  const paymentNotifications = [
    {
      type: "completed",
      title: "Thanh toán đối soát tháng 11, 2025 đã được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "pending",
      title: "Hotel Booking đã gửi đối soát tháng 11, 2025:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "rejected",
      title: "Đối soát tháng 11,2025 đang được Hotel Booking xử lý/thanh toán:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "completed2",
      title: "Thanh toán đối soát tháng 11, 2025 đã được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Header cố định */}

      <Toolbar>
        <IconButton edge='start'>
          <ArrowBack />
        </IconButton>
        <Typography variant='h6' fontWeight={700} sx={{ flexGrow: 1, ml: 2 }}>
          Danh sách thông báo
        </Typography>
      </Toolbar>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 600,
              },
              "& .Mui-selected": { color: "#98B720 !important"  },
              "& .MuiTabs-indicator": { backgroundColor: "#98B720 !important", height: 3 },
            }}>
            <Tab label='Đặt phòng' />
            <Tab label='Đối soát và thanh toán' />
          </Tabs>
        </Box>

        <Box p={4}>
          {/* Filter chips nhỏ (chỉ hiện ở tab Đặt phòng) */}
          {tab === 0 && (
            <Stack direction='row' spacing={1} mb={3} flexWrap='wrap' gap={1}>
              <Chip label='Tất cả 5' size='small' color='default' />
              <Chip label='Đặt phòng mới 2' size='small' variant='outlined' />
              <Chip label='Khách không đến 2' size='small' color='warning' />
              <Chip label='Hủy đặt phòng 1' size='small' color='error' />
            </Stack>
          )}

          {/* Danh sách thông báo */}
          {tab === 0
            ? // Tab Đặt phòng
              bookingNotifications.map((notif, i) => (
                <NotificationCard key={i}>
                  <Stack direction='row' spacing={2} alignItems='flex-start'>
                    <Avatar
                      sx={{
                        bgcolor:
                          notif.type === "success"
                            ? "#e8f5e9"
                            : notif.type === "cancel"
                            ? "#ffebee"
                            : "#fff3e0",
                        width: 48,
                        height: 48,
                      }}>
                      {notif.type === "success" ? (
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      ) : notif.type === "cancel" ? (
                        <Cancel sx={{ color: "#e53935" }} />
                      ) : (
                        <Hotel sx={{ color: "#fb8c00" }} />
                      )}
                    </Avatar>

                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize='15.5px' mb={1}>
                        {notif.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        • Mã đặt phòng: {notif.bookingId}
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
                      {notif.reason && (
                        <Typography
                          variant='body2'
                          color='#e53935'
                          fontWeight={500}>
                          • Lý do: {notif.reason}
                        </Typography>
                      )}
                      <TimeText>{notif.timeAgo}</TimeText>
                    </Box>
                  </Stack>
                </NotificationCard>
              ))
            : // Tab Đối soát và thanh toán
              paymentNotifications.map((notif, i) => (
                <NotificationCard key={i}>
                  <Stack direction='row' spacing={2} alignItems='flex-start'>
                    <Avatar
                      sx={{
                        bgcolor: notif.type.includes("completed")
                          ? "#e8f5e9"
                          : notif.type === "pending"
                          ? "#fff8e1"
                          : "#fff3e0",
                        width: 48,
                        height: 48,
                      }}>
                      <Receipt
                        sx={{
                          color: notif.type.includes("completed")
                            ? "#4caf50"
                            : notif.type === "pending"
                            ? "#fb8c00"
                            : "#ef6c00",
                        }}
                      />
                    </Avatar>

                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize='15.5px' mb={1}>
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
                </NotificationCard>
              ))}
        </Box>
      </Card>
    </Box>
  );
}
