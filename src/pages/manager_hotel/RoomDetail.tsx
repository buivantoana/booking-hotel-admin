import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Close, ContentCopy, Edit, PauseCircle } from "@mui/icons-material";
import remove from "../../images/delete.png";
import confirm from "../../images/Frame.png";
import { useSearchParams } from "react-router-dom";
import { parseRoomName } from "../../utils/utils";

export default function RoomDetail({
  onNext,
  room,
  getHotelDetail,
  detailHotel,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [action, setAction] = useState("detail");
  const [searchParams, setSearchParams] = useSearchParams();
  // Parse dữ liệu từ room props
  const parsedName = room ? parseRoomName(room.name) || "Không có tên" : "";
  const parsedNameHotel = detailHotel
    ? parseRoomName(detailHotel.name) || "Không có tên"
    : "";
  const parsedBedType = room?.bed_type
    ? typeof room.bed_type === "string"
      ? JSON.parse(room.bed_type).vi
      : room.bed_type
    : "-";
  const parsedDirection = room?.direction
    ? typeof room.direction === "string"
      ? JSON.parse(room.direction).vi
      : room.direction
    : "-";
  const area = room?.area_m2 ? `${room.area_m2}m²` : "-";

  // Parse hình ảnh phòng
  const roomImages = React.useMemo(() => {
    if (!room?.images) return [];
    try {
      const urls = JSON.parse(room.images);
      return Array.isArray(urls) ? urls : [];
    } catch (e) {
      return [];
    }
  }, [room]);

  // Format giá tiền VND
  const formatPrice = (price) => {
    if (!price || price === 0) return "-";
    return (
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(price) + "đ"
    );
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Dialog ngừng kinh doanh */}
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
              sx={{ position: "absolute", top: -40, right: 8 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Cảnh báo
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Khách sẽ không thể đặt phòng này sau khi bạn ngừng kinh doanh loại
            phòng. Bạn có thể mở kinh doanh lại loại phòng trong tương lai.
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
            onClick={() => setDeleteDialogOpen(false)}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Xác nhận ngừng kinh doanh
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

      {/* Dialog mở lại kinh doanh */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#e8f5e9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}>
              <img src={confirm} alt='' />
            </Box>
            <IconButton
              onClick={() => setConfirmDialogOpen(false)}
              sx={{ position: "absolute", top: -40, right: 8 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Xác nhận mở lại kinh doanh
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Hãy đảm bảo cập nhật đầy đủ thông tin, giá và tình trạng sẵn sàng
            trước khi mở lại hoạt động kinh doanh để tránh sai sót trong quá
            trình đặt phòng.
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
            onClick={() => setConfirmDialogOpen(false)}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Gửi duyệt
          </Button>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
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

      {/* View chi tiết */}
      {action === "detail" && room && (
        <>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <KeyboardArrowLeftIcon
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("manager_room", "true"); // thêm params mới
                setSearchParams(params);
                onNext("edit_detail");
              }}
              sx={{ fontSize: 30, mr: 1, cursor: "pointer" }}
            />
            <Box>
              <Typography variant='h5' fontWeight={600}>
                {parsedName}
              </Typography>
              <Typography color='gray'>{parsedNameHotel}</Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* <Box display={"flex"} gap={"10px"}>
              <Button
                variant='outlined'
                sx={{
                  borderRadius: "24px",
                  height: 40,
                  minWidth: 120,
                  border: "1px solid rgba(208, 211, 217, 1)",
                  background: "rgba(240, 241, 243, 1)",
                  color: "black",
                }}>
                Ngừng hợp tác
              </Button>
            </Box> */}
          </Box>

          {/* Container chính */}
          <Box
            sx={{
              background: "white",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 2px 7px rgba(0,0,0,0.05)",
            }}>
            {/* Thông tin phòng */}
            <Typography fontWeight={700} mb={2}>
              Thông tin phòng
            </Typography>

            <Grid container spacing={2} mb={4}>
              {[
                { label: "Số lượng phòng bán", value: "Không giới hạn" },
                { label: "Diện tích", value: area },
                { label: "Loại giường", value: parsedBedType },
                { label: "Hướng phòng", value: parsedDirection },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box
                    sx={{
                      border: "1px solid #EBEBEB",
                      borderRadius: 3,
                      p: 2.5,
                      height: "100%",
                    }}>
                    <Typography color='gray' fontSize={14} mb={1}>
                      {item.label}
                    </Typography>
                    <Typography fontWeight={700}>{item.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Tiện ích phòng - tạm để trống nếu không có dữ liệu rõ ràng */}
            <Typography fontWeight={700} mt={8} mb={2}>
              Tiện ích phòng
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography color='#999' fontStyle='italic'>
                Chưa có tiện ích nào được thiết lập
              </Typography>
            </Box>

            {/* Hình ảnh */}
            <Typography fontWeight={700} mb={2}>
              Hình ảnh phòng
            </Typography>

            {roomImages.length === 0 ? (
              <Typography color='#999'>Chưa có hình ảnh</Typography>
            ) : (
              <Grid container spacing={2} mb={4}>
                {roomImages.map((url, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box
                      component='img'
                      src={url}
                      alt={`Room image ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 3,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Giá phòng */}
            <Typography fontWeight={700} mb={2}>
              Giá phòng
            </Typography>

            <Grid container spacing={3}>
              {/* Theo giờ */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: "1px solid #DCEFD8" }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#E8F5E9",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#2E7D32",
                        display: "inline-block",
                      }}>
                      Theo giờ
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                      <Box>
                        <Typography fontWeight={600}>Giá 2 giờ đầu</Typography>
                        <Typography
                          color='#82B440'
                          fontWeight={700}
                          fontSize='1.2rem'>
                          {formatPrice(room.price_hourly)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontWeight={600}>Giá giờ thêm</Typography>
                        <Typography
                          color='#82B440'
                          fontWeight={700}
                          fontSize='1.2rem'>
                          {formatPrice(room.price_hourly_increment)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography fontSize={13} mt={2} color='#666'>
                      ✓ Cho phép khách đặt tối đa thêm giờ tùy theo quy định
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Qua đêm */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: "1px solid #D4E4FB" }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#E3F2FD",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#1976D2",
                        display: "inline-block",
                      }}>
                      Qua đêm
                    </Box>
                    <Typography fontWeight={600}>Giá 1 đêm</Typography>
                    <Typography
                      color='#1565C0'
                      fontWeight={700}
                      fontSize='1.4rem'>
                      {formatPrice(room.price_overnight)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Theo ngày */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: "1px solid #FFF3C4" }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#FFFDE7",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#DAA200",
                        display: "inline-block",
                      }}>
                      Theo ngày
                    </Box>
                    <Typography fontWeight={600}>Giá 1 ngày</Typography>
                    <Typography
                      color='#DAA200'
                      fontWeight={700}
                      fontSize='1.4rem'>
                      {formatPrice(room.price_daily)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}

// Menu thao tác (3 chấm)
function ActionMenu({ setDeleteDialogOpen, setConfirmDialogOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "#98B720",
          color: "#98B720",
          fontWeight: 500,
          mr: 2,
          "&:hover": {
            borderColor: "#98B720",
            bgcolor: "rgba(152,183,32,0.04)",
          },
        }}>
        Thao tác
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            mt: 1,
          },
        }}>
        <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <Edit fontSize='small' sx={{ color: "#666" }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <ContentCopy fontSize='small' sx={{ color: "#666" }} />
          Nhân bản
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
          <PauseCircle fontSize='small' />
          Ngừng kinh doanh
        </MenuItem>
      </Menu>
    </>
  );
}
