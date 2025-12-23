import { ArrowBackIos, CheckCircle, Edit, Star, StarBorder } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Rating,
  Divider,
  styled,
  ClickAwayListener,
  Popper,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AccessTime from "@mui/icons-material/AccessTime";
import Bed from "@mui/icons-material/Bed";
import Close from "@mui/icons-material/Close";
import HotelSelect from "../../components/HotelSelect";
import start from "../../images/star.svg"; // giữ nguyên icon sao
import { replyReviewHotels } from "../../service/hotel";
import { toast } from "react-toastify";
import edit from "../../images/brush-square.png"
const ReviewView = ({ hotels, idHotel, setIdHotel, reviews = [], getReview, value, setValue, pagination, onPageChange }) => {
  const [detailReview, setDetailReview] = useState(null);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Review
        detailReview={detailReview}
        hotels={hotels}
        idHotel={idHotel}
        setIdHotel={setIdHotel}
        reviews={reviews}
        setDetailReview={setDetailReview}
      />

      <HotelReview reviews={reviews} getReview={getReview} pagination={pagination}
        setValue={setValue}
        onPageChange={onPageChange}
        value={value} setDetailReview={setDetailReview} />
    </Box>
  );
};

export default ReviewView;

// ==================== Tổng quan đánh giá ====================
const Review = ({ reviews, hotels, idHotel, setIdHotel }) => {
  const renderStars = (rating: number) => {
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

  const avgRate = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rate, 0) / reviews.length).toFixed(1)
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map((star) =>
    reviews.filter((r) => r.rate === star).length
  );

  // Tính phần trăm cho progress bar (tối đa 100%)
  const maxCount = Math.max(...starCounts, 1);
  const percentages = starCounts.map((count) => (count / maxCount) * 100);

  return (
    <Stack spacing={4}>
      <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
        <Typography variant='h5' fontWeight='bold'>
          Tổng quan Đánh giá
        </Typography>

        <Box ml={0.5}>
          <HotelSelect
            value={idHotel}
            hotelsData={hotels}
            onChange={(id) => {
              setIdHotel(id);
            }}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, p: 4 }}>
        <Paper elevation={0} sx={{ borderRadius: "16px", py: 3, px: 0 }}>
          <Grid container alignItems="start">
            <Grid item xs={12} md={6}>
              <Box display={"flex"} gap={4}>
                <Box
                  sx={{
                    bgcolor: "#98b720",
                    color: "white",
                    borderRadius: "12px",
                    px: 5,
                    py: 2.5,
                    fontSize: "2rem",
                    fontWeight: 700,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h2">{avgRate}</Typography>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                  <Typography fontWeight={600} fontSize="1.7rem" color="#98b720">
                    Xuất sắc
                  </Typography>
                  <Typography fontSize="1.1rem" color="#2b2f38">
                    Từ {reviews.length} đánh giá
                  </Typography>
                  <Typography fontSize="0.9rem" color="#999">
                    Bởi người dùng trong Booking Hotel
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {[5, 4, 3, 2, 1].map((star, idx) => (
                  <Stack key={star} direction="row" alignItems="center" spacing={2}>
                    <Typography
                      width={40}
                      fontSize="0.9rem"
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                      color="#666"
                    >
                      {star} <img src={start} alt="" />
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentages[idx]}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#98b720",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography fontWeight={600} fontSize="0.9rem" color="#98b720">
                      {starCounts[idx]}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Card>
    </Stack>
  );
};

// ==================== Danh sách đánh giá ====================
function HotelReview({ reviews, getReview, value, setValue, pagination, onPageChange }: any) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const theme = useTheme();
  const [isEdit, setIsEdit] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Lọc theo tab
  const currentReviews = tab === 1
    ? reviews.filter(r => !r.owner_reply)
    : tab === 2
      ? reviews.filter(r => !!r.owner_reply)
      : reviews;

  // Format ngày giờ giống hệt gốc
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const formatDateModal = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${hours}:${day}/${month}`;
  };

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const OPTIONS = [
    { value: "all", label: "Tất cả điểm" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "lte2", label: "≤ 2" },
    { value: "lte3", label: "≤ 3" },
    { value: "lte4", label: "≤ 4" },
    { value: "gte4", label: "≥ 4" },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  const openFilter = Boolean(anchorEl);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSelect = (val: string) => {
    setValue(val);
    setAnchorEl(null);

    // 🔥 SỰ KIỆN Ở ĐÂY
    console.log("Selected rating:", val);
    // gọi API / set filter ở đây
  };
  return (
    <Box>
      <Box
        my={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant='h6' fontWeight='bold'>
          Danh sách đánh giá
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 3, p: 4 }}>
        {/* Tabs + Sort button - giữ nguyên 100% */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant='fullWidth'
            sx={{
              width: "50%",
              "& .MuiTabs-flexContainer": { gap: 1 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                borderRadius: 5,
                color: "#999",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(240, 241, 243, 1)",
                color: "rgba(43, 47, 56, 1) !important",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": { display: "none" },
            }}>
            <Tab label='Tất cả' />
            <Tab label='Chưa phản hồi' />
            <Tab label='Đã phản hồi' />
          </Tabs>
          <>
            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              onClick={handleToggle}
              sx={{
                borderRadius: 20,
                textTransform: "none",
                borderColor: "#ddd",
                color: "#666",
                fontSize: "14px",
              }}
            >
              {OPTIONS.find((item) => item.value == value)?.label}
            </Button>

            <Popper open={openFilter} anchorEl={anchorEl} placement="bottom-start">
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Paper
                  sx={{
                    mt: 1,
                    width: 220,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <List dense>
                    {OPTIONS.map((item) => (
                      <ListItemButton
                        key={item.value}
                        onClick={() => handleSelect(item.value)}
                        sx={{ px: 2 }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography
                                sx={{
                                  color:
                                    item.value === "all" ? "#8bc34a" : "#333",
                                  fontWeight:
                                    item.value === "all" ? 600 : 400,
                                }}
                              >
                                {item.label}
                              </Typography>

                              {item.value !== "all" && (
                                <Star sx={{ fontSize: 16, color: "#FFC107" }} />
                              )}
                            </Box>
                          }
                        />

                        <Radio
                          checked={value === item.value}
                          sx={{
                            color: "#c4c4c4",
                            "&.Mui-checked": {
                              color: "#8bc34a",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </>
        </Box>

        {/* Review List */}
        {currentReviews.length === 0 ? (
          <EmptyCard sx={{ mt: 3 }} elevation={0}>
            Người dùng không có nhận xét về phòng này
          </EmptyCard>
        ) : (
          currentReviews.map((review, index) => (
            <ReviewCardDetail
              sx={{
                padding: 0,
                py: 2,
                borderBottom:
                  index == currentReviews.length - 1
                    ? "none"
                    : "2px solid rgba(208, 211, 217, 1)",
              }}
              key={review.id}
              elevation={0}>
              {/* Header: Mã đặt phòng + chip */}
              <Box pb={2}>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={2}
                  flexWrap='wrap'>
                  {review.booking_code && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      fontSize='14px'>
                      Mã đặt phòng: {review.booking_code}
                    </Typography>
                  )}
                  {review.rent_type === "hourly" && (
                    <Chip
                      icon={<AccessTime sx={{ fontSize: 16 }} />}
                      label='Theo giờ'
                      size='small'
                      sx={{
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        fontSize: "13px",
                        height: 26,
                      }}
                    />
                  )}
                  {/* Bạn có thể thêm chip loại phòng nếu cần */}
                </Stack>
              </Box>

              <ReviewContent sx={{ justifyContent: "space-between" }}>
                <Box width={"26%"}>
                  <Stack direction='row' spacing={2}>
                    <Avatar
                      src={review.avatar || undefined}
                      sx={{
                        bgcolor: review.avatar ? undefined : "#ffb74d",
                        width: 44,
                        height: 44,
                        fontWeight: "bold",
                      }}>
                      {review.user_name?.[0] || "U"}
                    </Avatar>
                    <Stack direction='column' mb={0.5}>
                      <Typography fontWeight={600} fontSize='15px'>
                        {review.user_name || "Người dùng"}
                      </Typography>
                      <Box display='flex'>
                        {[...Array(5)].map((_, i) =>
                          i < review.rate ? (
                            <Star
                              key={i}
                              sx={{ color: "#ffb400", fontSize: 20 }}
                            />
                          ) : (
                            <StarBorder
                              key={i}
                              sx={{ color: "#e0e0e0", fontSize: 20 }}
                            />
                          )
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    mt={1}
                    variant='body2'
                    color='text.secondary'
                    fontSize='13px'>
                    Đánh giá lúc {formatDate(review.created_at)}
                  </Typography>
                </Box>

                <Box width={"70%"}>
                  <Typography
                    variant='body1'
                    mt={2}
                    mb={2}
                    fontSize='15px'
                    sx={{
                      width: "100%",
                      p: 3,
                      background: "rgba(240, 241, 243, 1)",
                      borderRadius: 1,
                    }}
                    fontWeight={500}>
                    {review.comment}
                  </Typography>

                  {/* Ảnh + video đính kèm */}
                  {review.attachments && review.attachments.length > 0 && (
                    <Stack direction='row' spacing={1.5} mt={1} flexWrap="wrap">
                      {review.attachments.map((att, i) => (
                        att.type === "image" ? (
                          <Box
                            key={i}
                            component='img'
                            src={att.url.startsWith("http") ? att.url : `https://res.dev.zeezoo.mobi${att.url}`}
                            alt='review'
                            sx={{
                              width: { xs: "48%", sm: 100 },
                              height: 100,
                              borderRadius: 1,
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : att.type === "video" ? (
                          <Box
                            key={i}
                            component='video'
                            controls
                            src={att.url.startsWith("http") ? att.url : `https://res.dev.zeezoo.mobi${att.url}`}
                            sx={{
                              width: { xs: "48%", sm: 100 },
                              height: 100,
                              borderRadius: 1,
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : null
                      ))}
                    </Stack>
                  )}

                  {/* Phản hồi của chủ (nếu có) */}
                  {review.owner_reply && (
                    <Box mt={2} p={2} bgcolor="#f8fcf8" borderRadius={1} border="1px solid #98b720">
                      <Typography fontWeight={600} fontSize="14px" color="#98b720">
                        Phản hồi từ chủ:
                      </Typography>
                      <Typography fontSize="14px">{review.owner_reply}</Typography>
                    </Box>
                  )}

                  {/* Nút Trả lời - chỉ hiện khi chưa có phản hồi */}
                  {!review.owner_reply ? (
                    <Box textAlign='right' mt={2}>
                      <ReplyButton onClick={() => openReplyModal(review)}>
                        Trả lời
                      </ReplyButton>
                    </Box>
                  ) :
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography fontSize={"15px"} mt={2}>
                        Đã trả lời lúc {formatDate(review.owner_reply_at)}
                      </Typography>
                      <Typography onClick={() => {
                        setIsEdit(true)
                        openReplyModal(review)
                      }} sx={{ cursor: "pointer" }} fontWeight={"500"} color="#98B720" mt={2}>
                        Xem chi tiết
                      </Typography>
                    </Box>
                  }
                </Box>
              </ReviewContent>
            </ReviewCardDetail>
          ))
        )}
        {currentReviews.length !== 0 && <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Pagination
            key={pagination?.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
            count={pagination?.total_pages}
            page={pagination?.page}
            onChange={onPageChange}
            siblingCount={1}
            boundaryCount={1}
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              // Tùy chỉnh trang active
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#98b720 !important", // Màu xanh lá bạn đang dùng trong app
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(139,195,74,0.4)",
                "&:hover": {
                  backgroundColor: "#7cb342 !important",
                },
              },
              // Tùy chỉnh các trang thường (nếu muốn)
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                margin: "0 4px",
                "&:hover": {
                  backgroundColor: "#e8f5e9",
                },
              },
              // Tùy chỉnh nút ellipsis (...) nếu cần
              "& .MuiPaginationItem-ellipsis": {
                color: "#666",
              },
            }}

          />

        </Stack>}
      </Card>

      {/* Modal chi tiết - giữ nguyên 100% UI gốc */}
      <ReviewDetailModal isEdit={isEdit} open={open} setOpen={setOpen} setIsEdit={setIsEdit} getReview={getReview} review={selectedReview} />
    </Box>
  );
}

// Styled components giữ nguyên y hệt
const ReviewCardDetail = styled(Paper)(({ theme }) => ({
  borderRadius: 0,
  overflow: "hidden",
  boxShadow: 0,
}));

const ReviewContent = styled(Box)({
  borderRadius: "0 0 16px 16px",
  display: "flex",
});

const ReplyButton = styled(Button)({
  backgroundColor: "rgba(152, 183, 32, 1)",
  color: "white",
  borderRadius: 15,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "15px",
  padding: "10px 32px",
  boxShadow: "0 2px 4px rgba(102,187,106,0.3)",
  "&:hover": {
    backgroundColor: "#57a05a",
  },
});

const EmptyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: "#f9f9f9",
  borderRadius: 16,
  color: "#999",
  fontSize: "15px",
}));

const StyledModal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    maxWidth: 620,
    width: "95%",
    margin: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
}));

const ReplyButtonModal = styled(Button)({
  backgroundColor: "rgba(152, 183, 32, 1)",
  color: "white",
  borderRadius: 30,
  textTransform: "none",
  width: "100%",
  fontWeight: 600,
  fontSize: "16px",
  padding: "12px 40px",
  boxShadow: "none",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "rgba(152, 183, 32, 1)",
  },
});

function ReviewDetailModal({ open, setOpen, review, getReview, isEdit, setIsEdit }) {
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false); // trạng thái chỉnh sửa

  // Load reply hiện tại khi mở modal hoặc review thay đổi
  useEffect(() => {
    if (review?.owner_reply) {
      setReplyText(review.owner_reply);
    } else {
      setReplyText("");
    }
    setIsEditing(false); // luôn reset về không edit khi mở lại
  }, [review, open]);

  if (!review) return null;

  // Format thời gian
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDayMonth = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    try {
      const payload = { reply: replyText.trim() || null };
      const result = await replyReviewHotels(review.id, payload);

      if (result?.success || result?.owner_reply !== undefined) {
        toast.success(
          review.owner_reply ? "Cập nhật phản hồi thành công" : "Gửi phản hồi thành công"
        );
        await getReview();
        setOpen(false);
      } else {
        toast.error(result?.message || "Thao tác thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa phản hồi này?")) return;

    try {
      const result = await replyReviewHotels(review.id, { reply: null });
      if (result?.success || result?.owner_reply === null) {
        toast.success("Đã xóa phản hồi");
        await getReview();
        setOpen(false);
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const hasReply = !!review.owner_reply;
  return (
    <StyledModal open={open} onClose={() => {
      setIsEdit(false)
      setOpen(false)
    }}>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {/* Header xanh + điểm + nút đóng */}
        <Box
          sx={{
            p: 2,
            position: "relative",
          }}>
          <IconButton
            onClick={() => {
              setIsEdit(false)
              setOpen(false)
            }}
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <Close />
          </IconButton>

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
              Chi tiết đánh giá
            </Typography>
          </Stack>
        </Box>

        {/* Thông tin đặt phòng */}
        <Box px={3} pt={3}>

          <Stack direction='row' alignItems='center' spacing={2} mb={2} flexWrap="wrap">

            <Typography variant='body2' color='text.secondary'>
              Mã đặt phòng: {review.booking_code}
            </Typography>

            {/* Bạn có thể thêm chip loại phòng nếu có dữ liệu room_type */}
            <Chip
              icon={<Bed sx={{ fontSize: 16 }} />}
              label='Phòng luxury'
              size='small'
              sx={{ bgcolor: "#fff3e0", color: "#ef6c00", fontSize: 13 }}
            />
          </Stack>


          {/* Chip Theo giờ + thời gian - chỉ hiển thị nếu là thuê theo giờ */}

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f8fcf8",
              borderRadius: "12px",
              p: 1.5,
              border: "1px solid #98b720",
              textAlign: "center",
              mb: 2,
            }}>
            <Stack
              direction='row'
              spacing={0.5}
              alignItems='center'
              justifyContent='start'
              mb={1}>
              <CheckCircle sx={{ fontSize: 16, color: "#98b720" }} />
              <Typography fontSize='0.75rem' color='#98b720' fontWeight={600}>
                Theo giờ
              </Typography>
            </Stack>
            <Divider />
            <Grid container spacing={0.5} mt={1} fontSize='0.7rem'>
              <Grid item xs={4}>
                <Typography color='#888' fontSize='0.75rem'>
                  Nhận phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  {review.check_in
                    ? `${formatTime(review.check_in)}, ${formatDayMonth(review.check_in)}`
                    : "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                <Typography color='#888' fontSize='0.75rem'>
                  Trả phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  {review.check_out
                    ? `${formatTime(review.check_out)}, ${formatDayMonth(review.check_out)}`
                    : "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                <Typography color='#888' fontSize='0.75rem'>
                  Số giờ
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  {review.rent_duration > 0 ? `${review.rent_duration} giờ` : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>


          {/* Người đánh giá */}
          <Stack direction='row' spacing={2} alignItems='flex-start'>
            <Avatar sx={{ bgcolor: "#ffb74d", width: 48, height: 48 }}>
              {review.user_name?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box flex={1}>
              <Stack>
                <Typography fontWeight={600}>
                  {review.user_name || "Người dùng"}
                </Typography>
                <Rating value={review.rate || 0} readOnly size='small' />
              </Stack>
            </Box>
          </Stack>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography mt={2} variant='body2' color='text.secondary'>
              Đánh giá lúc {formatFullDate(review.created_at)}
            </Typography>
            {hasReply && !isEditing && (
              <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ ml: 1 }}>
                <img src={edit} />
              </IconButton>
            )}
          </Box>


          <Typography
            variant='body1'
            mt={2}
            mb={2}
            fontSize='15px'
            sx={{
              width: "calc(100% - 40px)",
              p: "20px",
              background: "rgba(240, 241, 243, 1)",
              borderRadius: 1,
            }}
            fontWeight={500}>
            {review.comment || ""}
          </Typography>

          {hasReply && !isEditing && (
            <Box mb={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>

                  <TextField
                    multiline
                    disabled
                    rows={4}
                    placeholder='Trả lời cho đánh giá này...'
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    variant='outlined'
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        
                        borderRadius: 1,
  
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#cddc39", // Border mặc định
                          borderWidth: "1px",     // Tăng độ dày nếu muốn nổi bật hơn
                        },
                        "&:hover fieldset": {
                          borderColor: "#c0ca33", // Hover: đậm hơn một chút (tùy chọn)
                          borderWidth: "1px",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#cddc39 !important", // QUAN TRỌNG: Khi focus vẫn giữ màu này
                          borderWidth: "1px",
                          boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)", // Hiệu ứng glow nhẹ (tùy chọn)
                        },
                        // Tắt màu legend primary khi focus (nếu có label)
                        "&.Mui-focused .MuiInputLabel-root": {
                          color: "#666",
                        },
                      },
                    }}
                  />
                  <Typography mt={2} variant="body2" color="text.secondary" gutterBottom>
                    Đã trả lời lúc: {formatFullDate(review.owner_reply_at)}
                  </Typography>
                </Box>

              </Stack>
            </Box>
          )}

          {(isEditing || !hasReply) && (
            <>
              <TextField
                multiline
                rows={4}
                placeholder='Trả lời cho đánh giá này...'
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                variant='outlined'
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                        
                    borderRadius: 1,

                    backgroundColor: "#fff",
                    "& fieldset": {
                      borderColor: "#cddc39", // Border mặc định
                      borderWidth: "1px",     // Tăng độ dày nếu muốn nổi bật hơn
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0ca33", // Hover: đậm hơn một chút (tùy chọn)
                      borderWidth: "1px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#cddc39 !important", // QUAN TRỌNG: Khi focus vẫn giữ màu này
                      borderWidth: "1px",
                      boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)", // Hiệu ứng glow nhẹ (tùy chọn)
                    },
                    // Tắt màu legend primary khi focus (nếu có label)
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#666",
                    },
                  },
                }}
              />

              {/* Nút hành động */}
              {isEditing ? (
                <Stack direction="row" mt={3} spacing={2}>
                  <Button sx={{

                    color: "black",
                    borderRadius: 30,
                    textTransform: "none",
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "12px 40px",
                    boxShadow: "none",
                    marginTop: "20px",
                    background: "#F0F1F3"

                  }} onClick={handleDelete}>Xóa phản hồi </Button>
                  <ReplyButtonModal onClick={handleSubmit}>Gửi lại trả lời</ReplyButtonModal>
                </Stack>
              ) : (
                <ReplyButtonModal onClick={handleSubmit}>Gửi trả lời</ReplyButtonModal>
              )}
            </>
          )}

        </Box>
      </DialogContent>
    </StyledModal>
  );
}