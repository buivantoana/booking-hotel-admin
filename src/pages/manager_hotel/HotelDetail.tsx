import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowBackIosNew, ArrowForwardIos, Edit as EditIcon, Star } from "@mui/icons-material";
import { Grid, Paper, Stack, Divider } from "@mui/material";
import ManagerRooms from "./ManagerRooms";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotel } from "../../service/hotel";
import Slider from "react-slick";
import { facilities } from "../../utils/utils";

export default function HotelDetail({
  setAction,
  setRoom,
  detailHotel,
  getHotelDetail,
  room,
  setCancelDialogOpen,
  locations,
  setApproveDialogOpen,
  setCancelDialogOpenRoom,
  setApproveDialogOpenRoom,
}) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HotelHeader
        detailHotel={detailHotel}
        setCancelDialogOpen={setCancelDialogOpen}
        setApproveDialogOpen={setApproveDialogOpen}
        setAction={setAction}
      />
      <HotelInfoDetail
        detailHotel={detailHotel}
        onNext={setAction}
        getHotelDetail={getHotelDetail}
        setRoom={setRoom}
        room={room}
        locations={locations}
        setCancelDialogOpenRoom={setCancelDialogOpenRoom}
        setApproveDialogOpenRoom={setApproveDialogOpenRoom}
      />
    </Box>
  );
}

function HotelHeader({
  setAction,
  detailHotel,
  setCancelDialogOpen,
  setApproveDialogOpen,
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
  const { status } = detailHotel;
  const renderStatusChip = (status) => {
    const map = {
      active: {
        label: "Đang hoạt động",
        sx: { bgcolor: "#98B720", color: "white" },
      },
      paused: {
        label: "Tạm dừng",
        sx: { bgcolor: "#FFB020", color: "white" },
      },
      pending: {
        label: "Chờ duyệt",
        sx: { bgcolor: "#1976D2", color: "white" },
      },
      terminated: {
        label: "Đã chấm dứt",
        sx: { bgcolor: "#D32F2F", color: "white" },
      },
      rejected: {
        label: "Bị từ chối ",
        sx: { bgcolor: "#a5a5a5", color: "white" },
      },
    };

    const config = map[status];

    return (
      <Chip
        label={config?.label || "Không xác định"}
        size='small'
        sx={config?.sx || { bgcolor: "#9E9E9E", color: "white" }}
      />
    );
  };
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

        {renderStatusChip(status)}
      </Box>
      {status != "rejected"&&
      <Box>
        {status=="pending"?<Box display={"flex"} gap={"10px"}>
            <Button
              variant='contained'
              onClick={() => setCancelDialogOpen(true)}
              sx={{
                bgcolor: "#F0F1F3",
                color: "black",
                fontWeight: 600,
                fontSize: 15,
                px: 4,
                py: 1,
                borderRadius: "50px",
                textTransform: "none",
                boxShadow: "none",
              }}>
              Từ chối
            </Button>
            <Button
              variant='contained'
              onClick={() => setApproveDialogOpen(true)}
              sx={{
                bgcolor: "#98B720",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
                px: 4,
                py: 1,
                borderRadius: "50px",
                textTransform: "none",
                boxShadow: "none",
              }}>
              Phê duyệt
            </Button>
          </Box>:
        <Button
          variant='outlined'
          onClick={() => {
            if (status === "active" || status === "paused") {
              setCancelDialogOpen(true);
            } else {
              setApproveDialogOpen(true);
            }
          }}
          sx={{
            borderRadius: "24px",
            height: 40,
            minWidth: 120,
            border: "1px solid rgba(208, 211, 217, 1)",
            background: "rgba(240, 241, 243, 1)",
            color: "black",
          }}>
          {status === "active" || status === "paused"
            ? "Ngừng kinh doanh"
            : "Tiếp tục kinh doanh"}
        </Button>}
      </Box>}
    </Box>
  );
}

function HotelInfoDetail({
  onNext,
  setRoom,
  detailHotel,
  getHotelDetail,
  room,
  locations,
  setCancelDialogOpenRoom,
  setApproveDialogOpenRoom,
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
  const imagesVerify = detailHotel.verify_images ? JSON.parse(detailHotel.verify_images) : [];
  const thumbImages = Array.from(new Set([...images, ...imagesVerify]));
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);

  const sliderMain = useRef();
  const sliderThumb = useRef();

  const settingsMain = {
    asNavFor: navThumb,
    arrows: false,
    infinite: true,
  };

  const settingsThumb = {
    asNavFor: navMain,
    slidesToShow: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: false,
  };
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
      </Box>

      {action === "rooms" && (
        <ManagerRooms
          onNext={onNext}
          setRoom={setRoom}
          detailHotel={detailHotel}
          getHotelDetail={getHotelDetail}
          room={room}
          setCancelDialogOpenRoom={setCancelDialogOpenRoom}
          setApproveDialogOpenRoom={setApproveDialogOpenRoom}
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

              <Box mb={1} position={"relative"}>
              <Slider
                {...settingsMain}
                ref={(slider) => {
                  sliderMain.current = slider;
                  setNavMain(slider);
                }}>
                {thumbImages.map((img, i) => (
                  <Box height={"360px !important"}>
                    <img
                      key={i}
                      src={img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                  </Box>
                ))}
              </Slider>

              {/* CUSTOM ARROWS */}
              <IconButton
                onClick={() => sliderMain.current?.slickPrev()}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  bgcolor: "white",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  transform: "translateY(-50%)",
                  boxShadow: 2,
                  transition: "all 0.3s ease", // mượt khi hover

                  // Hover effect
                  "&:hover": {
                    bgcolor: "#98b720", // nền chuyển xanh
                    boxShadow: 6, // bóng đậm hơn tí

                    "& .MuiSvgIcon-root": {
                      // đổi màu icon khi hover
                      color: "white !important",
                    },
                  },

                  // Icon mặc định
                  "& .MuiSvgIcon-root": {
                    fontSize: 16,
                    color: "#333",
                    transition: "color 0.3s ease",
                  },
                }}>
                <ArrowBackIosNew sx={{ fontSize: 16 }} />
              </IconButton>

              <IconButton
                onClick={() => sliderMain.current?.slickNext()}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "white",
                  boxShadow: 2,
                  transform: "translateY(-50%)",
                  transition: "all 0.3s ease", // mượt khi hover

                  // Hover effect
                  "&:hover": {
                    bgcolor: "#98b720", // nền chuyển xanh
                    boxShadow: 6, // bóng đậm hơn tí

                    "& .MuiSvgIcon-root": {
                      // đổi màu icon khi hover
                      color: "white !important",
                    },
                  },

                  // Icon mặc định
                  "& .MuiSvgIcon-root": {
                    fontSize: 16,
                    color: "#333",
                    transition: "color 0.3s ease",
                  },
                }}>
                <ArrowForwardIos />
              </IconButton>
            </Box>

            {/* Thumbnail */}
            <Box
              sx={{
                ".slick-current img": {
                  outline: "2px solid #98b720",
                  outlineOffset: "-2px", // kéo viền vào trong đúng 2px → trông như border trong
                  opacity: 1,
                  // optional: thêm viền ngoài nếu muốn đậm hơn
                },
                // Đảm bảo tất cả ảnh đều có kích thước cố định và không bị co giãn do border/outline
                img: {
                  display: "block",
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: 1,
                  opacity: 0.6,
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                },
              }}>
              <Slider
                {...settingsThumb}
                ref={(slider) => {
                  sliderThumb.current = slider;
                  setNavThumb(slider);
                }}>
                {thumbImages.map((img, i) => (
                  <Box width={"95% !important"} height={"100px"}>
                    <img key={i} src={img} />
                  </Box>
                ))}
              </Slider>
            </Box>
            </Grid>

            {/* Cột 2: Thông tin chính */}
            <Grid item xs={12} md={4}>
              <Typography fontSize={16} fontWeight={600} color='#333'>
                Tên khách sạn
              </Typography>
              <Typography fontSize={15} color='#333' mb={2}>
                {hotelName}
              </Typography>

              <Stack spacing={2.5}>
               

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
                    Qua số điện thoại
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Tỉnh thành/ Quận
                  </Typography>
                  <Typography fontSize={15} color='#333'>
                  {locations?.find(item=> item?.id == detailHotel?.city)?.name?.vi }
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
                    {hotelDescription}
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
                  <Typography fontSize={15} color='#333'>
                    Listing
                  </Typography>
                </Box>
                <Box>
                  <Typography fontSize={14} color='black' fontWeight={600}>
                    Tiện ích khách sạn
                  </Typography>
                  {(() => {
                    // Parse facilities từ DB (là JSON string dạng array id)
                    const facilityIds = () => {
                      if (!detailHotel?.amenities) return [];
                      try {
                        const parsed =
                          typeof detailHotel.amenities === "string"
                            ? JSON.parse(detailHotel.amenities)
                            : Array.isArray(detailHotel.amenities)
                              ? detailHotel.amenities
                              : [];
                        return Array.isArray(parsed) ? parsed : [];
                      } catch (e) {
                        console.warn("Parse facilities error:", e);
                        return [];
                      }
                    };

                    // Map id → object đầy đủ (label + icon)
                    const selectedFacilities = facilities.filter((fac) =>
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
                        sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                        {selectedFacilities.map((fac) => (
                          <Box
                            key={fac.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              bgcolor: "#f8f9fa",
                              border: "1px solid #e9ecef",
                              borderRadius: 3,
                              px: 1,
                              py: .5,
                              minWidth: 140,
                            }}>
                            <Box
                              component='img'
                              src={fac.icon}
                              alt={fac.name.vi}
                              sx={{ width: 20, height: 20, objectFit: "contain" }}
                            />
                            <Typography fontWeight={500} fontSize='0.85rem'>
                              {fac.name.vi}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })()}
                </Box>
               
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}
