import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  TextField,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import remove from "../../images/delete.png";

export default function LockRoomSetup({ setAction }) {
  const [hotel, setHotel] = React.useState("");
  const [roomType, setRoomType] = React.useState("");
  const [bookingType, setBookingType] = React.useState("");
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [fromTime, setFromTime] = React.useState(null);
  const [toTime, setToTime] = React.useState(null);

  const Label = ({ children }) => (
    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 500,
        color: "#344054",

        minWidth: 22,
      }}>
      {children}
    </Typography>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, background: "#F7F9FB", minHeight: "100vh" }}>
        <Typography
          display={"flex"}
          alignItems={"center"}
          gap={2}
          sx={{ fontSize: 24, fontWeight: 700, mb: 3 }}>
          <ArrowBackIos
            sx={{
              fontSize: 24,
              color: "#666",
              cursor: "pointer",
              "&:hover": { color: "#333" },
            }}
            onClick={() => setAction("manager")} // hoặc navigate(-1)
          />{" "}
          Thiết lập khóa phòng
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "20px",
            background: "#FFFFFF",
            border: "1px solid #F0F0F0",
          }}>
          <Grid container spacing={4}>
            {/* LEFT FORM */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 3 }}>
                Tạo lịch khóa phòng
              </Typography>

              {/* HOTEL */}
              <Grid
                container
                alignItems='center'
                justifyContent={"space-between"}
                sx={{ mb: 3 }}>
                <Grid item xs={5}>
                  <Label>Khách sạn muốn khóa</Label>
                </Grid>
                <Grid item xs={7}>
                  <FormControl fullWidth>
                    <Select
                      value={hotel}
                      onChange={(e) => setHotel(e.target.value)}
                      IconComponent={KeyboardArrowDownIcon}
                      displayEmpty
                      sx={{ borderRadius: 1, height: "40px" }}>
                      <MenuItem value=''>Chọn khách sạn</MenuItem>
                      <MenuItem value='1'>Khách sạn A</MenuItem>
                      <MenuItem value='2'>Khách sạn B</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ROOM TYPE */}
              <Grid
                container
                alignItems='center'
                justifyContent={"space-between"}
                sx={{ mb: 3 }}>
                <Grid item xs={5}>
                  <Label>Loại khách sạn muốn khóa</Label>
                </Grid>
                <Grid item xs={7}>
                  <FormControl fullWidth>
                    <Select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ borderRadius: 1, height: "40px" }}>
                      <MenuItem value=''>Chọn loại phòng</MenuItem>
                      <MenuItem value='standard'>Standard</MenuItem>
                      <MenuItem value='vip'>VIP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* BOOKING TYPE */}
              <Grid
                container
                alignItems='center'
                justifyContent={"space-between"}
                sx={{ mb: 3 }}>
                <Grid item xs={5}>
                  <Label>Loại đặt phòng</Label>
                </Grid>
                <Grid item xs={7}>
                  <FormControl fullWidth>
                    <Select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value)}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ borderRadius: 1, height: "40px" }}>
                      <MenuItem value=''>Tất cả các loại đặt phòng</MenuItem>
                      <MenuItem value='hourly'>Theo giờ</MenuItem>
                      <MenuItem value='overnight'>Qua đêm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* DATE RANGE */}
              <Grid
                container
                alignItems='center'
                justifyContent={"space-between"}
                sx={{ mb: 3 }}>
                <Grid item xs={5}>
                  <Label>Khoảng thời gian</Label>
                </Grid>
                <Grid item xs={7}>
                  <Box display='flex' gap={2}>
                    <DatePicker
                      label='Từ ngày'
                      value={fromDate}
                      onChange={setFromDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              height: 40,

                              // Input text
                              "& .MuiInputBase-input": {
                                height: "40px",
                                padding: "0 12px",
                                boxSizing: "border-box",
                              },

                              // Outline
                              "& .MuiOutlinedInput-notchedOutline": {
                                top: 0,
                              },
                            },
                          },

                          // 👉 FIX LABEL BỊ LỆCH
                          InputLabelProps: {
                            sx: {
                              lineHeight: "1", // Giữ độ cao label
                              transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                              "&.MuiInputLabel-shrink": {
                                transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                              },
                            },
                          },
                        },
                      }}
                    />

                    <DatePicker
                      label='Đến ngày'
                      value={toDate}
                      onChange={setToDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              height: 40,

                              // Input text
                              "& .MuiInputBase-input": {
                                height: "40px",
                                padding: "0 12px",
                                boxSizing: "border-box",
                              },

                              // Outline
                              "& .MuiOutlinedInput-notchedOutline": {
                                top: 0,
                              },
                            },
                          },

                          // 👉 FIX LABEL BỊ LỆCH
                          InputLabelProps: {
                            sx: {
                              lineHeight: "1", // Giữ độ cao label
                              transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                              "&.MuiInputLabel-shrink": {
                                transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* TIME RANGE */}
              <Grid
                container
                alignItems='center'
                justifyContent={"space-between"}>
                <Grid item xs={5}>
                  <Label>Khung giờ</Label>
                </Grid>
                <Grid item xs={7}>
                  <Box display='flex' gap={2}>
                    <TimePicker
                      label='Từ giờ'
                      value={fromTime}
                      onChange={setFromTime}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              height: 40,

                              // Input text
                              "& .MuiInputBase-input": {
                                height: "40px",
                                padding: "0 12px",
                                boxSizing: "border-box",
                              },

                              // Outline
                              "& .MuiOutlinedInput-notchedOutline": {
                                top: 0,
                              },
                            },
                          },

                          // 👉 FIX LABEL BỊ LỆCH
                          InputLabelProps: {
                            sx: {
                              lineHeight: "1", // Giữ độ cao label
                              transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                              "&.MuiInputLabel-shrink": {
                                transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      label='Đến giờ'
                      value={toTime}
                      onChange={setToTime}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              height: 40,

                              // Input text
                              "& .MuiInputBase-input": {
                                height: "40px",
                                padding: "0 12px",
                                boxSizing: "border-box",
                              },

                              // Outline
                              "& .MuiOutlinedInput-notchedOutline": {
                                top: 0,
                              },
                            },
                          },

                          // 👉 FIX LABEL BỊ LỆCH
                          InputLabelProps: {
                            sx: {
                              lineHeight: "1", // Giữ độ cao label
                              transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                              "&.MuiInputLabel-shrink": {
                                transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "#FAFDF5",
                  borderRadius: "16px",
                  p: 3,
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "#9DA7A1",
                }}>
                <Typography
                  fontSize={15}
                  fontWeight={500}
                  color='#d32f2f'
                  lineHeight={1.5}
                  mb={2}>
                  Khách sẽ không thể đặt phòng tại Khách sạn 123 đối với đặt
                  phòng:
                </Typography>

                {/* Loại phòng bị giới hạn */}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  sx={{ mb: 2 }}>
                  <Typography
                    component='span'
                    fontSize={14}
                    color='#555'
                    fontWeight={500}>
                    Loại phòng:
                  </Typography>
                  <Typography
                    component='span'
                    fontSize={15}
                    fontWeight={600}
                    color='#4caf50'
                    ml={2}>
                    Vip206
                  </Typography>
                </Box>

                {/* Thời gian áp dụng */}
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography
                    component='span'
                    fontSize={14}
                    color='#555'
                    fontWeight={500}>
                    Theo giờ
                  </Typography>
                  <Typography
                    component='span'
                    fontSize={14}
                    color='#333'
                    fontWeight={500}
                    ml={2}>
                    08:00 - 12:00 từ ngày 19/11/2025 - 21/11/2025
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button
              variant='contained'
              sx={{
                background: "#B7D682",
                color: "#fff",
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontSize: 16,
                borderRadius: "30px",
                "&:hover": { background: "#A6C76D" },
              }}>
              Thêm lịch khóa phòng
            </Button>
          </Box>
        </Paper>
        <RoomBlockHistory />
      </Box>
    </LocalizationProvider>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, Close, Delete as DeleteIcon } from "@mui/icons-material";

function RoomBlockHistory() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        bgcolor: "#ffffff",
        border: "1px solid #eee",
        overflow: "hidden",
        mt: 4,
        mx: "auto",
        px: 3,
      }}>
      {/* Header */}
      <Box
        sx={{
          py: 3,
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}>
        <Typography fontSize={18} fontWeight={600} color='#333'>
          Lịch sử khóa phòng
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}>
          <FormControl size='small' sx={{ minWidth: 220 }}>
            <InputLabel>Tất cả các khách sạn</InputLabel>
            <Select defaultValue='' label='Tất cả các khách sạn'>
              <MenuItem value=''>Tất cả các khách sạn</MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={{ minWidth: 220 }}>
            <InputLabel>Lọc theo loại phòng</InputLabel>
            <Select defaultValue='' label='Lọc theo loại phòng'>
              <MenuItem value=''>Tất cả</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}

      <TableContainer>
        <Table sx={{ minWidth: 650, borderRadius: "10px !important" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Loại phòng
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Ngày bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Ngày kết thúc
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Loại phòng đặt
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Giờ bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Giờ kết thúc
              </TableCell>
              <TableCell
                align='center'
                sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Dòng 1 */}
            <TableRow
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component='th' scope='row' sx={{ fontWeight: 500 }}>
                Vip 206
              </TableCell>
              <TableCell>19/11/2025</TableCell>
              <TableCell>21/11/2025</TableCell>
              <TableCell>
                <Box
                  component='span'
                  sx={{ color: "#1976d2", fontWeight: 500 }}>
                  Theo giờ
                </Box>
              </TableCell>
              <TableCell>08:00</TableCell>
              <TableCell>12:00</TableCell>
              <TableCell align='center'>
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  size='small'
                  sx={{
                    bgcolor: "#ffebee",
                    color: "#d32f2f",
                    "&:hover": { bgcolor: "#ffcdd2" },
                  }}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>

            {/* Dòng 2 */}
            <TableRow hover>
              <TableCell component='th' scope='row' sx={{ fontWeight: 500 }}>
                Vip 123
              </TableCell>
              <TableCell>19/11/2025</TableCell>
              <TableCell>21/11/2025</TableCell>
              <TableCell>
                <Box
                  component='span'
                  sx={{ color: "#7b1fa2", fontWeight: 500 }}>
                  Tất cả
                </Box>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell align='center'>
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  size='small'
                  sx={{
                    bgcolor: "#ffebee",
                    color: "#d32f2f",
                    "&:hover": { bgcolor: "#ffcdd2" },
                  }}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#ffebee",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}>
              <img src={remove} alt='' />
            </Box>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='18px' mb={1}>
            Xóa lệnh khóa phòng
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Bạn có chắc muốn xóa lệnh khóa phòng này không?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 4,
            gap: 2,
            flexDirection: "column",
          }}>
          <Button
            onClick={() => {}}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Đồng ý
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant='outlined'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              borderColor: "#ddd",
              color: "#666",
              width: "100%",
            }}>
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
