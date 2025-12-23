"use client";

import React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  MusicNote as TikTokIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import momo from "../../src/images/Rectangle 30024.png";
import vnpay from "../../src/images/Frame 1321317955.png";
import app from "../../src/images/App.png";
import app1 from "../../src/images/App (1).png";
import ins from "../../src/images/Logos.png"
import fb from "../../src/images/Logos (1).png"
import tiktok from "../../src/images/Logos (2).png"
import youtube from "../../src/images/Logos (3).png"
const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "#f9f9f9", borderTop: "1px solid #eee", py: 4, }}>
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='flex-start'>
          {/* LOGO & INFO */}
          <Grid item xs={12} md={5.5}>
            <Stack spacing={2}>
              <Typography fontWeight={700} fontSize='1.5rem' color='#333'>
                Logo
              </Typography>
              <Typography fontSize='0.9rem' color='#666' lineHeight={1.6}>
                Địa chỉ: Lorem Ipsum is simply dummy text of the printing and
                typesetting
              </Typography>
              <Typography fontSize='0.9rem' color='#666'>
                Liên hệ hợp tác:{" "}
                <strong style={{ color: "#666" }}>LoremIpsum@gmail.com</strong>
              </Typography>
              <Typography fontSize='0.9rem' color='#666'>
                Hỗ trợ khách hàng:{" "}
                <strong style={{ color: "#666" }}>LoremIpsum@gmail.com</strong>
              </Typography>
              <Typography fontSize='0.9rem' color='#666'>
                Điện thoại: <strong style={{ color: "#666" }}>123456789</strong>
              </Typography>

              {/* SOCIAL ICONS */}
              <Stack direction='row' spacing={1.5} mt={1}>
                <Link href='#' color='inherit'>
                  <img src={ins} alt="" />
                </Link>
                <Link href='#' color='inherit'>
                <img src={fb} alt="" />
                </Link>
                <Link href='#' color='inherit'>
                <img src={tiktok} alt="" />
                </Link>
                <Link href='#' color='inherit'>
                <img src={youtube} alt="" />
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* GIỚI THIỆU */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Stack spacing={2.5}>
              <Typography fontWeight={600} fontSize='1rem' color='#333'>
                Giới thiệu
              </Typography>
              <Link href='#' underline='hover' color='#666' fontSize='0.9rem'>
                Về chúng tôi
              </Link>
              <Link href='#' underline='hover' color='#666' fontSize='0.9rem'>
                Trang Blog
              </Link>
              <Link href='#' underline='hover' color='#666' fontSize='0.9rem'>
                Quy chế hoạt động website
              </Link>
              <Link href='#' underline='hover' color='#666' fontSize='0.9rem'>
                Cơ hội nghề nghiệp
              </Link>
              <Link href='#' underline='hover' color='#666' fontSize='0.9rem'>
                Dành cho đối tác
              </Link>
            </Stack>
          </Grid>

          {/* ĐỐI TÁC THANH TOÁN & APP */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display={"flex"} justifyContent={"end"}>

            <Stack
              spacing={3}
              direction={isMobile ? "column" : "column"}
              alignItems={isMobile ? "flex-start" : "start"}>
              {/* ĐỐI TÁC */}
              <Stack spacing={1.5}>
                <Typography fontWeight={600} fontSize='1rem' color='#333'>
                  Đối tác thanh toán
                </Typography>
                <Box display={"flex"} gap={2}>
                  <Box
                    component='img'
                    src={momo}
                    alt='Momo'
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#ddd",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#999",
                    }}
                  />
                  <Box
                    component='img'
                    src={vnpay}
                    alt='Momo'
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#ddd",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#999",
                    }}
                  />
                </Box>
              </Stack>

              {/* TẢI ỨNG DỤNG */}
              <Stack spacing={1.5}>
                <Typography fontWeight={600} fontSize='1rem' color='#333'>
                  Tải ứng dụng
                </Typography>
                <Box display={"flex"} gap={2}>
                  <Box
                    component='img'
                    src={app}
                    alt='App Store'
                    sx={{
                      bgcolor: "#000",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />

                  <Box
                    component='img'
                    src={app1}
                    alt='Google Play'
                    sx={{
                      bgcolor: "#000",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider sx={{ my: 3, bgcolor: "#eee" }} />

        {/* COPYRIGHT & LINKS */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
          textAlign={{ xs: "center", sm: "left" }}>
          <Typography fontSize='0.85rem' color='#999'>
            © 2025 Booking Hotel. Bảo lưu mọi quyền
          </Typography>
          <Stack direction='row' spacing={2}>
            <Link href='#' underline='hover' color='#666' fontSize='0.85rem'>
              Điều khoản
            </Link>
            <Link href='#' underline='hover' color='#666' fontSize='0.85rem'>
              Bảo mật
            </Link>
            <Link href='#' underline='hover' color='#666' fontSize='0.85rem'>
              Cookie
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
