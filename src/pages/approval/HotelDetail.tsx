import { Box, Typography, Button, Chip } from "@mui/material";
import { ArrowBackIos, Edit as EditIcon, Star } from "@mui/icons-material";
import { Grid, Paper, Stack, Divider } from "@mui/material";
import ManagerRooms from "./ManagerRooms";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotel } from "../../service/hotel";

export default function HotelDetail({
  setAction,
  setRoom,
  detailHotel,
  getHotelDetail,
  setDeleteDialogOpen,
  setCancelDialogOpen,
  room,
}) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HotelHeader
        detailHotel={detailHotel}
        setAction={setAction}
        setDeleteDialogOpen={setDeleteDialogOpen}
        setCancelDialogOpen={setCancelDialogOpen}
      />
      <HotelInfoDetail
        detailHotel={detailHotel}
        room={room}
        onNext={setAction}
        setDeleteDialogOpen={setDeleteDialogOpen}
        setCancelDialogOpen={setCancelDialogOpen}
        getHotelDetail={getHotelDetail}
        setRoom={setRoom}
      />
    </Box>
  );
}

function HotelHeader({
  setAction,
  detailHotel,
  setDeleteDialogOpen,
  setCancelDialogOpen,
}) {
  const parseVi = (str) => {
    if (!str) return "";
    try {
      const parsed = JSON.parse(str);
      return parsed.vi || "";
    } catch {
      return str;
    }
  };

  const hotelName = parseVi(detailHotel.name) || "Khách sạn";

  return (
    <Box
      sx={{
        py: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        pt: 0,
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ArrowBackIos
          sx={{
            fontSize: 20,
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "#333" },
          }}
          onClick={() => setAction("manager")}
        />

        <Box>
          <Typography
            fontSize={22}
            fontWeight={700}
            color='#222'
            sx={{ lineHeight: 1.2 }}>
            {hotelName}
          </Typography>
        </Box>

        <Chip
          label='Đang hoạt động'
          size='small'
          sx={{
            bgcolor: "#98B720",
            color: "white",
            fontWeight: 600,
            fontSize: 13,
            height: 28,
            borderRadius: "16px",
          }}
        />
      </Box>
      <Box />
    </Box>
  );
}

function HotelInfoDetail({
  onNext,
  setRoom,
  room,
  detailHotel,
  getHotelDetail,
  setDeleteDialogOpen,
  setCancelDialogOpen,
}) {
  const [action, setAction] = useState("manager");
  const parseVi = (str) => {
    if (!str) return "";
    try {
      const parsed = JSON.parse(str);
      return parsed.vi || "";
    } catch {
      return str;
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("manager_room") == "true") {
      searchParams.delete("manager_room");
      setAction("rooms");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);
  const hotelName = parseVi(detailHotel.name);
  const hotelAddress = parseVi(detailHotel.address);
  const hotelDescription = parseVi(detailHotel.description);
  const phone = detailHotel.phone || "0123456789";
  const rentTypes = detailHotel.rent_types
    ? JSON.parse(detailHotel.rent_types)
    : {};
  const rentStr = `08:00 ~ 22:00 / ${rentTypes.overnight?.from || "22:00"} ~ ${
    rentTypes.overnight?.to || "08:00"
  } / ${rentTypes.daily?.from || "14:00"} ~ ${rentTypes.daily?.to || "12:00"}`;

  const images = detailHotel.images ? JSON.parse(detailHotel.images) : [];
  const mainImage = images[0] || null;
  const thumbImages = images.slice(0, 3);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #eee",
        bgcolor: "#fff",
        p: { xs: 2, sm: 3, md: 4 },
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography
            fontSize={16}
            fontWeight={600}
            onClick={() => setAction("manager")}
            color={action == "manager" ? "#98B720" : "#999"}
            sx={{
              borderBottom: action == "manager" ? "3px solid #98B720" : "none",
              pb: 1,
              cursor: "pointer",
            }}>
            Thông tin chung
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={600}
            onClick={() => setAction("rooms")}
            color={action == "rooms" ? "#98B720" : "#999"}
            sx={{
              borderBottom: action == "rooms" ? "3px solid #98B720" : "none",
              cursor: "pointer",
            }}>
            Loại phòng
          </Typography>
        </Box>

        {action != "rooms" && (
          <Box display={"flex"} gap={"10px"}>
            <Button
              variant='contained'
              onClick={() => setCancelDialogOpen(true)}
              sx={{
                bgcolor: "#F0F1F3",
                color: "black",
                fontWeight: 600,
                fontSize: 15,
                px: 4,
                py: 1.4,
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
                px: 4,
                py: 1.4,
                borderRadius: "50px",
                textTransform: "none",
                boxShadow: "none",
              }}>
              Phê duyệt
            </Button>
          </Box>
        )}
      </Box>

      {action === "rooms" && (
        <ManagerRooms
          onNext={onNext}
          setRoom={setRoom}
          detailHotel={detailHotel}
          getHotelDetail={getHotelDetail}
          room={room}
        />
      )}

      {action === "manager" && (
        <>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* Cột 1: Hình ảnh khách sạn */}
            <Grid item xs={12} md={4}>
              <Typography fontSize={16} fontWeight={600} color='#333' mb={2}>
                Hình ảnh khách sạn
              </Typography>

              {mainImage ? (
                <Box
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    mb: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}>
                  <img
                    src={mainImage}
                    alt='Khách sạn chính'
                    style={{ width: "100%", display: "block" }}
                  />
                </Box>
              ) : null}

              <Stack direction='row' spacing={1}>
                {thumbImages.map((img, i) => (
                  <Box
                    key={i}
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      flex: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}>
                    <img
                      src={img}
                      alt={`Ảnh ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Cột 2: Thông tin chính */}
            <Grid item xs={12} md={4}>
              <Typography fontSize={16} fontWeight={600} color='#333' mb={2}>
                Tên khách sạn/ Mã
              </Typography>
              <Typography fontSize={18} fontWeight={700} color='#222' mb={3}>
                {hotelName} ({detailHotel.id || "ABC_123456"})
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Email
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    ABC@gmail.com
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Số điện thoại
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    {phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Theo giờ/ Qua đêm/ Theo ngày
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    {rentStr}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Nhận thông báo đặt phòng
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Tin nhắn/ Email/ Ứng dụng Hotel Booking
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Phương thức thanh toán
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Trả trước/ Trả tại khách sạn
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Tỉnh thành/ Quận
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Bắc Từ Liêm/ TP.Hà Nội
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Địa chỉ
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    {hotelAddress || "Kinh Van, Bắc Từ Liêm, Việt Nam"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Cột 3: Thông tin phụ + đánh giá */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Mô tả
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    {hotelDescription ? "Có" : "Không"}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Chính sách khách sạn
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Không
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Tình trạng hợp tác
                  </Typography>
                  <Chip
                    label='Listing'
                    size='small'
                    sx={{
                      bgcolor: "#f3e5f5",
                      color: "#7b1fa2",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Loại khách sạn
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Du lịch
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Có phòng
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                    Có
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}
