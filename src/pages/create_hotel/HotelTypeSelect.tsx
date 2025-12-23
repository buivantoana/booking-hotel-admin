import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  useMediaQuery,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const listingFeatures = [
  "Đăng ký online dễ dàng, không cần ký hợp đồng ràng buộc",
  "Khách sạn hiển thị trên ứng dụng Hotel Booking không tốn chi phí hoa hồng",
  "Tăng hiển diện thương hiệu đến người dùng Hotel Booking",
  "Khách sạn nhận đặt phòng qua điện thoại: Chủ động nhận và tư chối khách",
  "Khách sạn nhận đặt phòng qua điện thoại: Chủ động nhận và tư chối khách",
  "Khách hàng có thể dễ dàng tìm kiếm, xem mô tả chi tiết và hình ảnh phòng",
];

const contractFeatures = [
  "Tối ưu công suất phòng trống với đặt phòng Theo giờ, Qua đêm, Ngày đêm...",
  "Ưu tiên xuất hiện trong tìm kiếm, gợi ý, flash sale",
  "Tăng uy tín và nhận diện thương hiệu nhờ hệ thống đánh giá và xếp hạng",
  "Dễ dàng quản lý lịch đặt phòng và báo cáo doanh thu ngay trên nền tảng Hotel Booking",
  "Được hỗ trợ quảng bá thương hiệu miễn phí trên các kênh truyền thông của Hotel Booking",
  "Có đội ngũ CSKH hỗ trợ 24/7, xử lý mọi sự cố nhanh chóng",
  "Hotel Booking hỗ trợ đề xuất giá bán phù hợp, tư vấn chiến lược bán phòng, nâng thứ hạng",
];

export default function HotelTypeSelect({ onSelect,typeHotel }) {
  const isMobile = useMediaQuery("(max-width:768px)");

 

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      gap={3}
      width="100%"
    >
      {renderCard("Khách sạn Listing", listingFeatures, "Chọn Listing",false,onSelect,typeHotel)}
      {renderCard("Khách sạn Contract", contractFeatures, "Chọn Contract", true,onSelect,typeHotel)}
    </Box>
  );
}

const renderCard = (title, features, buttonText, showBadge = false,onSelect,typeHotel) => (
    <Card
      sx={{
        p: 4,
        borderRadius: 4,
        width: "100%",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      {/* Badge góc phải */}
      {showBadge && (
        <Chip
          icon={<FlightTakeoffIcon color="#5A8DEE" />}
          label="Đối tác chính thức"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#EEF4FF",
            color: "#5A8DEE",
            fontWeight: 600,
          }}
        />
      )}

      {/* Tiêu đề */}
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        color="#333"
        textAlign="left"
      >
        {title}
      </Typography>

      {/* Danh sách */}
      <Box display="flex" flexDirection="column" gap={2.5}>
        {features.map((item, i) => (
          <Box key={i} display="flex" alignItems="center" gap={1.2}>
            <CheckCircleIcon sx={{ fontSize: 20, color: "#8BC34A" }} />
            <Typography fontSize={15} color="#333">
              {item}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={()=>onSelect(title)}
        sx={{
          mt:!showBadge?0: 3,
          background:typeHotel == title? "#8BC34A" : "transparent",
          color: typeHotel == title?"white":"#5D6679",
          py: 1.4,
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 3,
          position:!showBadge?"absolute":"unset",
          bottom:!showBadge?32:"unset",
          width:!showBadge?"calc(100% - 64px)":"100%",
          textTransform: "none",
          "&:hover": {
            background: "#7CB342",
          },
        }}
      >
        {buttonText}
      </Button>
    </Card>
  );