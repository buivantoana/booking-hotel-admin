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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Close, ContentCopy, Edit, PauseCircle } from "@mui/icons-material";
import remove from "../../images/delete.png";
import confirm from "../../images/Frame.png";
import { useSearchParams } from "react-router-dom";
import { direction, facilities, parseRoomName, type_bed } from "../../utils/utils";
const getLabelsByIds = (ids: string[] | null | undefined, list) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id) => list.find((item) => item.id === id)?.name?.vi)
    .filter(Boolean) as string[];
};
export default function RoomDetail({
  onNext,
  room,
  getHotelDetail,
  detailHotel,
  setDeleteDialogOpen,
  setCancelDialogOpen,
  attribute,
  rooms
}) {

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [action, setAction] = useState("detail");
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Parse dữ liệu từ room props
  const parsedName = room ? parseRoomName(room.name) || "Không có tên" : "";
  const parsedNameHotel = room
    ? parseRoomName(room.hotel_name) || "Không có tên"
    : parseRoomName(detailHotel.name);
  const bedTypeIds = React.useMemo(() => {
    if (!room?.bed_type) return [];
    try {
      return typeof room.bed_type === "string"
        ? JSON.parse(room.bed_type)
        : Array.isArray(room.bed_type)
          ? room.bed_type
          : [];
    } catch {
      return [];
    }
  }, [room?.bed_type]);

  const directionIds = React.useMemo(() => {
    if (!room?.direction) return [];
    try {
      return typeof room.direction === "string"
        ? JSON.parse(room.direction)
        : Array.isArray(room.direction)
          ? room.direction
          : [];
    } catch {
      return [];
    }
  }, [room?.direction]);

  // Chuyển sang label để hiển thị
  const bedTypeLabels = getLabelsByIds(bedTypeIds, attribute?.bed_type || []);
  const directionLabels = getLabelsByIds(directionIds, attribute?.direction || []);
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

  console.log("AAAA detailHotel", detailHotel)
  console.log("AAAA room", room)
  console.log("AAAA rooms", rooms)
  console.log("AAAA searchParams", detailHotel?.room_types?.some((item) => item.status == "pending" && item.id == room.id))
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Dialog ngừng kinh doanh */}
      {/* <Dialog
        open={}
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
      </Dialog> */}

      {/* Dialog mở lại kinh doanh */}
      {/* <Dialog
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
            Duyệt
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
      </Dialog> */}

      {/* View chi tiết */}
      {action === "detail" && room && (
        <>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <KeyboardArrowLeftIcon
              onClick={() => {
                if (searchParams.get("tab") == "all") {
                  onNext("manager");
                } else {
                  const params = new URLSearchParams(searchParams);
                  params.set("manager_room", "true"); // thêm params mới
                  setSearchParams(params);
                  onNext("edit_detail");
                }
              }}
              sx={{ fontSize: 30, mr: 1, cursor: "pointer" }}
            />
            <Box>
              <Typography variant='h5' fontWeight={600}>
                {parsedName}
              </Typography>
              {!isMobile && <Typography color='gray'>{parsedNameHotel}</Typography>}

            </Box>
            <Chip
              label={"Chờ duyệt"}
              size='small'
              sx={{ bgcolor: "#FEF7F2", color: "#EA6A00",ml:2 }}
            />
            <Box sx={{ flexGrow: 1 }} />

            {(searchParams.get("tab") == "all" ? rooms?.some((item) => item.id == room.id) : detailHotel?.room_types?.some((item) => item.status == "pending" && item.id == room.id)) && <Box display={"flex"} gap={"10px"}>
              <Button
                variant='contained'
                onClick={() => setCancelDialogOpen(true)}
                sx={{
                  bgcolor: "#F0F1F3",
                  color: "black",
                  fontWeight: 600,
                  fontSize: 15,
                  px: isMobile ? 2 : 4,
                  py: isMobile ? 1 : 1.4,
                  borderRadius: "50px",
                  textTransform: "none",
                  boxShadow: "none",
                }}>
                Từ chối
              </Button>
              <Button
                variant='contained'
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  bgcolor: "#98B720",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 15,
                  px: isMobile ? 2 : 4,
                  py: isMobile ? 1 : 1.4,
                  borderRadius: "50px",
                  textTransform: "none",
                  boxShadow: "none",
                }}>
                Phê duyệt
              </Button>
            </Box>}
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

            <Grid container spacing={2} gap={{ xs: 5, md: 0 }} mb={4}>
              {[
                { label: "Số lượng phòng bán", value: room?.number },
                { label: "Diện tích", value: area },
                {
                  label: "Loại giường",
                  value:
                    bedTypeLabels.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {bedTypeLabels.map((label, i) => (
                          <Chip
                            key={i}
                            label={label}
                            size='small'
                            sx={{
                              bgcolor: "#e8f5e9",
                              color: "#2e7d32",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      "-"
                    ),
                },
                {
                  label: "Hướng phòng",
                  value:
                    directionLabels.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {directionLabels.map((label, i) => (
                          <Chip
                            key={i}
                            label={label}
                            size='small'
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      "-"
                    ),
                },
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
              {(() => {
                // Parse facilities từ DB (là JSON string dạng array id)
                const facilityIds = () => {
                  if (!room?.amenities) return [];
                  try {
                    const parsed =
                      typeof room.amenities === "string"
                        ? JSON.parse(room.amenities)
                        : Array.isArray(room.amenities)
                          ? room.amenities
                          : [];
                    return Array.isArray(parsed) ? parsed : [];
                  } catch (e) {
                    console.warn("Parse facilities error:", e);
                    return [];
                  }
                };

                // Map id → object đầy đủ (label + icon)
                const selectedFacilities = attribute?.amenities?.filter((fac) =>
                  facilityIds().includes(fac.id)
                );

                if (selectedFacilities.length === 0) {
                  return (
                    <Typography color='#999' fontStyle='italic'>
                      Chưa có tiện ích nào được thiết lập
                    </Typography>
                  );
                }

                return (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                    {selectedFacilities.map((fac) => (
                      <Box
                        key={fac.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          bgcolor: "#f8f9fa",
                          border: "1px solid #98B720",
                          borderRadius: 3,
                          px: 1.5,
                          py: 1,

                        }}>
                        <Box
                          component='img'
                          src={fac.icon}
                          alt={fac.name.vi}
                          sx={{ objectFit: "contain" }}
                        />
                        <Typography fontWeight={500} color="#98B720" fontSize='0.95rem'>
                          {fac.name.vi}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                );
              })()}
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

            <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
              {/* Theo giờ */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #DCEFD8",
                    flex: 1,           // ← quan trọng: giãn full height
                    display: 'flex',   // để CardContent có thể giãn
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        background: "#E8F5E9",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#2E7D32",
                        display: "inline-block",
                      }}
                    >
                      Theo giờ
                    </Box>
                    <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>
                      <Box>
                        <Typography fontWeight={600}>Giá 2 giờ đầu</Typography>
                        <Typography color='#82B440' fontWeight={700} fontSize='1.2rem'>
                          {formatPrice(room.price_hourly)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontWeight={600}>Giá giờ thêm</Typography>
                        <Typography color='#82B440' fontWeight={700} fontSize='1.2rem'>
                          {formatPrice(room.price_hourly_increment)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography fontSize={13} mt='auto' color='#666'>
                      ✓ Cho phép khách đặt tối đa thêm giờ tùy theo quy định
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Qua đêm */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #D4E4FB",
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        background: "#E3F2FD",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#1976D2",
                        display: "inline-block",
                      }}
                    >
                      Qua đêm
                    </Box>
                    <Box sx={{}}>
                      <Typography fontWeight={600}>Giá 1 đêm</Typography>
                      <Typography color='#1565C0' fontWeight={700} fontSize='1.4rem'>
                        {formatPrice(room.price_overnight)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Theo ngày */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #FFF3C4",
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        background: "#FFFDE7",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#DAA200",
                        display: "inline-block",
                      }}
                    >
                      Theo ngày
                    </Box>
                    <Box sx={{}}>
                      <Typography fontWeight={600}>Giá 1 ngày</Typography>
                      <Typography color='#DAA200' fontWeight={700} fontSize='1.4rem'>
                        {formatPrice(room.price_daily)}
                      </Typography>
                    </Box>
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
