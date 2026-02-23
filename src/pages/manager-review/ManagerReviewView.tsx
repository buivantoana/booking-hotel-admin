import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Pagination,
  IconButton,
  useMediaQuery,
  useTheme,
  Popper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  Menu,
  MenuItem,
  styled,
  DialogContent,
  Divider,
  Grid,
  Avatar,
  Rating,
  Dialog,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  Description,
  Close,
  Bed,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDetailReview, toggleVisibility } from "../../service/hotel";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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

function ActionMenu({
  setVisibleDialogOpen, setHiddenDialogOpen, review, setDetailDialogOpen, setReview }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setReview(review)
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };


  const handleDetail = (e) => {
    e.stopPropagation();
    setDetailDialogOpen(true)
  };
  const handleVisible = (e) => {
    e.stopPropagation();
    setVisibleDialogOpen(true)
  };
  const handleHidden = (e) => {
    e.stopPropagation();

    setHiddenDialogOpen(true)
  };




  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": { borderColor: "#bbb" },
        }}
      >
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
            padding: 0,
          },
        }}
      >
        {/* Luôn có: Chi tiết */}
        <MenuItem
          onClick={handleDetail}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }}
        >
          <Description fontSize="small" />
          Chi tiết
        </MenuItem>

       {!review?.disabled? <MenuItem
          onClick={handleHidden}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }}
        >
          <VisibilityOffIcon fontSize="small" />
          Ẩn đánh giá
        </MenuItem>:

        <MenuItem
          onClick={handleVisible}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }}
        >
          <VisibilityIcon fontSize="small" />
          Hiện đánh giá
        </MenuItem>}

        {/* Trường hợp pending: Phê duyệt / Từ chối */}



      </Menu>
    </>
  );
}

export default function ManagerReviewView({
  Reviews = [],
  pagination = { page: 1, total_pages: 1 },
  loading = false,
  onPageChange,
  filters,
  onFilterChange,
  onResetFilter,
  fetchReviews
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [localFilters, setLocalFilters] = useState({
    rate: "",
    hotel_name: "",
    content: "",
    user_name: "",
    disabled:false
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [review, setReview] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [visibleDialogOpen, setVisibleDialogOpen] = useState(false);
  const [hiddenDialogOpen, setHiddenDialogOpen] = useState(false);
  const openFilter = Boolean(anchorEl);

  useEffect(() => {
    if (filters) {
      setLocalFilters({
        rate: filters.rate || "",
        hotel_name: filters.hotel_name || "",
        content: filters.content || "",
        user_name: filters.user_name || "",
        disabled:filters.disabled
      });
    }
  }, [filters]);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSelect = (val: string) => {
    setLocalFilters({ ...localFilters, rate: val });
    setAnchorEl(null);
  };

  const handleSearch = () => {
    onFilterChange({ ...localFilters });
  };

  const handleReset = () => {
    setLocalFilters({
      rate: "",
      hotel_name: "",
      content: "",
      user_name: "",
      disabled:false
    });
    onResetFilter();
  };

  const handleTabChange = (tab: string) => {
    const isDisabled = tab === "true";  // true cho "Đã ẩn", false cho "Hiện thị"
    setLocalFilters({ ...localFilters, disabled: isDisabled });
    fetchReviews(1, { ...localFilters, disabled: isDisabled });
  };

  const tabs = [
    { label: "Hiển thị", value: "false" },
    { label: "Đã ẩn", value: "true" },
  ];

  // Hàm lấy tên khách sạn từ JSON
  const getHotelName = (hotel_name: string) => {
    try {
      const parsed = JSON.parse(hotel_name);
      return parsed.vi || parsed.en || "Không rõ";
    } catch {
      return hotel_name || "Không rõ";
    }
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Render sao
  const renderStars = (rate: number) => {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="body2" fontWeight="medium">
          {rate.toFixed(1)}
        </Typography>
        <StarIcon sx={{ fontSize: 18, color: "#FFC107" }} />
      </Stack>
    );
  };
  const handleRowClick = (review) => {
    setReview(review);
    setDetailDialogOpen(true);
  };
  const handleVisibleAndHidden =async () => {
    try {
      let result = await toggleVisibility(review.id,{disabled:!review.disabled})
      if(result?.review_id){
        toast.success("Ẩn đánh giá thành công")
        setDetailDialogOpen(false)
        if(localFilters.disabled){
          fetchReviews("",localFilters)
        }else{

          fetchReviews()
        }
        if(review?.disabled){
          setVisibleDialogOpen(false)
        }else{
          setHiddenDialogOpen(false)
        }
        return true
      }else{
        return false
        toast.error(result?.message)
      }
    } catch (error) {
      return false
      console.log(error)
    }
  }


  // Desktop: Bảng gốc (giữ nguyên 100%)
  const renderDesktop = () => (
    <TableContainer sx={{ mt: 5, width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell><strong>#</strong></TableCell>
            <TableCell><strong>Tên khách sạn</strong></TableCell>
            <TableCell><strong>Người đánh giá</strong></TableCell>
            <TableCell><strong>Số điểm đánh giá</strong></TableCell>
            <TableCell><strong>Nội dung</strong></TableCell>
            <TableCell><strong>Thời gian</strong></TableCell>
            <TableCell align="center"><strong></strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>Đang tải...</Typography>
              </TableCell>
            </TableRow>
          ) : Reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>Không có dữ liệu đánh giá</Typography>
              </TableCell>
            </TableRow>
          ) : (
            Reviews.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ color: "#98B720" }}>
                  {getHotelName(row.hotel_name)}
                </TableCell>
                <TableCell>{row.user_name || "Khách"}</TableCell>
                <TableCell>{renderStars(row.rate)}</TableCell>
                <TableCell>
                  {row.comment || "Không có nội dung"}
                </TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell align="center">
                  <ActionMenu
                    setReview={setReview}
                    review={row}
                    setDetailDialogOpen={setDetailDialogOpen}
                    setHiddenDialogOpen={setHiddenDialogOpen}
                    setVisibleDialogOpen={setVisibleDialogOpen}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile: Card dọc (thiết kế đẹp, chuyên nghiệp)
  const renderMobile = () => (
    <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 3 }}>
      {loading ? (
        <Typography align="center">Đang tải...</Typography>
      ) : Reviews.length === 0 ? (
        <Typography align="center" color="#999" py={6}>
          Không có dữ liệu đánh giá
        </Typography>
      ) : (
        Reviews.map((row, index) => (
          <Paper
            key={row.id}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #eee",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
            }}
          
          >
            {/* Header card */}
            <Box
              onClick={() => handleRowClick(row)}
              sx={{
                p: 2,
                bgcolor: "#f8f9fa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  #{index + 1}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600" color="#98B720">
                  {getHotelName(row.hotel_name)}
                </Typography>
              </Stack>

              {renderStars(row.rate)}
            </Box>

            <Divider />

            {/* Nội dung chính */}
            <Box sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Người đánh giá
                  </Typography>
                  <Typography fontWeight="500">
                    {row.user_name || "Khách"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian
                  </Typography>
                  <Typography color="#616161">
                    {formatDate(row.created_at)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nội dung
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {row.comment || "Không có nội dung"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Thao tác */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#fafafa",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ActionMenu
                setReview={setReview}
                review={row}
                setDetailDialogOpen={setDetailDialogOpen}
                setHiddenDialogOpen={setHiddenDialogOpen}
                setVisibleDialogOpen={setVisibleDialogOpen}
              />
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Quản lý đánh giá
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={4}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              flexWrap="wrap"
              alignItems={{xs:"start",md:"end"}}
            >
              {/* Tên khách sạn */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Tên khách sạn</Typography>
                <TextField
                  placeholder="Tìm kiếm"
                  value={localFilters.hotel_name}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, hotel_name: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: {xs:"100%",md:200},
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",
                      bgcolor: "#fff",
                      "& fieldset": { borderColor: "#cddc39" },
                      "&:hover fieldset": { borderColor: "#c0ca33" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#cddc39 !important",
                        boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Tên người dùng */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Tên người dùng</Typography>
                <TextField
                  placeholder="Tìm kiếm"
                  value={localFilters.user_name}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, user_name: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: {xs:"100%",md:200},
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",
                      bgcolor: "#fff",
                      "& fieldset": { borderColor: "#cddc39" },
                      "&:hover fieldset": { borderColor: "#c0ca33" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#cddc39 !important",
                        boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Nội dung */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Nội dung</Typography>
                <TextField
                  placeholder="Tìm kiếm"
                  value={localFilters.content}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, content: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: {xs:"100%",md:200},
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",
                      bgcolor: "#fff",
                      "& fieldset": { borderColor: "#cddc39" },
                      "&:hover fieldset": { borderColor: "#c0ca33" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#cddc39 !important",
                        boxShadow: "0 0 0 3px rgba(205, 220, 57, 0.2)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Điểm đánh giá */}
              <Box width={{xs:"100%",md:"unset"}}>
                <Typography sx={{ mb: 1.5 }}>Điểm đánh giá</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<KeyboardArrowDown />}
                  onClick={handleToggle}
                  sx={{
                    width: {xs:"100%",md:"max-content"},
                    borderRadius: 20,
                    textTransform: "none",
                    borderColor: "#ddd",
                    color: "#666",
                    fontSize: "14px",
                    height: 40,
                  }}
                >
                  {OPTIONS.find((item) => item.value === localFilters.rate)?.label ||
                    "Chọn số điểm"}
                  <StarIcon sx={{ fontSize: 16, color: "#FFC107", ml: 1 }} />
                </Button>

                <Popper open={openFilter} anchorEl={anchorEl} placement="bottom-start">
                  <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <Paper sx={{ mt: 1, width: 220, borderRadius: 2, boxShadow: 3 }}>
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
                                      color: item.value === "all" ? "#8bc34a" : "#333",
                                      fontWeight: item.value === "all" ? 600 : 400,
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                  {item.value !== "all" && (
                                    <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
                                  )}
                                </Box>
                              }
                            />
                            <Radio
                              checked={localFilters.rate === item.value}
                              sx={{
                                color: "#c4c4c4",
                                "&.Mui-checked": { color: "#8bc34a" },
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>

              {/* Nút tìm kiếm */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    borderRadius: "24px",
                    bgcolor: "#98b720",
                    height: 40,
                    minWidth: 120,
                  }}
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    borderRadius: "24px",
                    height: 40,
                    minWidth: 120,
                    border: "1px solid #d0d3d9",
                    bgcolor: "#f0f1f3",
                    color: "black",
                  }}
                >
                  Xóa tìm kiếm
                </Button>
              </Stack>
            </Stack>

            {/* Tabs */}
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {tabs.map((tab, i) => (
                <Chip
                  key={tab.value}
                  label={tab.label}
                  onClick={() => handleTabChange(tab.value)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    height: 36,
                    bgcolor: String(localFilters.disabled) == tab.value ? "#F0F1F3" : "transparent",
                    color:  "#555",
                    // border: String(localFilters.disabled) == tab.value ? "none" : "1px solid #e0e0e0",
                    fontWeight: String(localFilters.disabled) == tab.value ? "bold" : "normal",
                    "&:hover": {
                      bgcolor: String(localFilters.disabled) == tab.value ? "transparent" : "#F0F1F3",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Bảng dữ liệu */}
          {isMobile ? renderMobile() : renderDesktop()}

          {/* Pagination */}
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              count={pagination.total_pages || 1}
              page={pagination.page || 1}
              onChange={onPageChange}
              siblingCount={1}
              boundaryCount={1}
              size={isMobile ? "medium" : "large"}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#98b720 !important",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(139,195,74,0.4)",
                },
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                  margin: "0 4px",
                },
              }}
            />
          </Stack>
        </Paper>
      </Box>
      <ReviewDetailModal handleVisibleAndHidden={handleVisibleAndHidden} setHiddenDialogOpen={setHiddenDialogOpen} open={detailDialogOpen} setOpen={setDetailDialogOpen} review={review} />
      <Dialog open={hiddenDialogOpen} onClose={() => setHiddenDialogOpen(false)}>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>

          <Typography variant="h6" fontWeight={600}>Bạn Chắc chứ?</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>


            Ẩn đánh giá này khách sẽ không nhìn thấy đánh giá nữa.
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
            onClick={async () => {
              handleVisibleAndHidden()
            }}

            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>

            Xác nhận Ẩn đánh giá

          </Button>
          <Button
            onClick={() => setHiddenDialogOpen(false)}
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
      <Dialog open={visibleDialogOpen} onClose={() => setVisibleDialogOpen(false)}>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>

          <Typography variant="h6" fontWeight={600}>Bạn Chắc chứ?</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>

            Hiện đánh giá này khách sẽ nhìn thấy lại đánh giá.

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
            onClick={async () => {
              handleVisibleAndHidden()
            }}

            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>

            Xác nhận hiện đánh giá

          </Button>
          <Button
            onClick={() => setVisibleDialogOpen(false)}
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
    </LocalizationProvider>
  );
}




const StyledModal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    maxWidth: 620,
    width: "95%",
    margin: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
}));

function ReviewDetailModal({ open, setOpen, review, handleVisibleAndHidden,setHiddenDialogOpen }) {

  const [detail, setDetail] = useState({}); // ← Đây là nguồn dữ liệu chính để hiển thị
  const [loading, setLoading] = useState(false);
  const getReviewDetail = async () => {
    try {
      if (!review?.id) return;
      let result = await getDetailReview(review.id);
      console.log("AAA result ", result);
      setDetail(result || {}); // bảo vệ trường hợp null/undefined
    } catch (error) {
      console.log(error);
      setDetail({});
    }
  };

  // Load reply hiện tại khi mở modal hoặc review thay đổi
  useEffect(() => {
    if (review?.id && open) {
      getReviewDetail();
    }
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

  
  // Thêm hàm tính số giờ (đặt bên trong component, trước return)
  const calculateRentDuration = () => {
    const checkIn = detail.booking?.check_in;
    const checkOut = detail.booking?.check_out;
    const rentType = detail.booking?.rent_type;

    if (!checkIn || !checkOut) return null;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    // Tính chênh lệch theo giờ (làm tròn lên nếu cần)
    const diffMs = outDate - inDate;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // làm tròn lên

    // Nếu là daily → thường không hiển thị số giờ, hoặc cố định 1 đêm
    if (rentType === "daily") {
      return null; // hoặc return 24 nếu muốn hiển thị 24 giờ
    }

    // Nếu là hourly hoặc overnight → hiển thị số giờ thực tế
    if (rentType === "hourly" || rentType === "overnight") {
      return diffHours > 0 ? diffHours : null;
    }

    // Fallback: nếu không có rent_type → tự đoán dựa trên thời gian
    if (diffHours <= 12 && diffHours > 0) {
      return diffHours; // có vẻ là hourly/overnight
    }

    return null;
  };

  // Sau đó dùng trong phần hiển thị "Số giờ"
  const rentDuration = calculateRentDuration();
  return (
    <StyledModal open={open} onClose={() => {

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
                {detail.booking?.rent_type === "hourly"
                  ? "Theo giờ"
                  : detail.booking?.rent_type === "overnight"
                    ? "Qua đêm"
                    : detail.booking?.rent_type === "daily"
                      ? "Theo ngày"
                      : "Thuê phòng"}{" "}
                {/* fallback nếu rent_type không có */}
              </Typography>
            </Stack>
            <Divider />
            <Grid container spacing={0.5} mt={1} fontSize='0.7rem'>
              <Grid item xs={detail.booking?.rent_type !== "hourly" ? 6 : 4}>
                <Typography color='#888' fontSize='0.75rem'>
                  Nhận phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  {detail.booking?.check_in
                    ? `${formatTime(detail.booking.check_in)}, ${formatDayMonth(
                      detail.booking.check_in
                    )}`
                    : "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={detail.booking?.rent_type !== "hourly" ? 6 : 4}
                sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                <Typography color='#888' fontSize='0.75rem'>
                  Trả phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  {detail.booking?.check_out
                    ? `${formatTime(
                      detail.booking.check_out
                    )}, ${formatDayMonth(detail.booking.check_out)}`
                    : "-"}
                </Typography>
              </Grid>
              {detail.booking?.rent_type === "hourly" && (
                <Grid
                  item
                  xs={4}
                  sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                  <Typography color='#888' fontSize='0.75rem'>
                    Số giờ
                  </Typography>
                  <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                    {rentDuration}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Stack direction='row' spacing={2} alignItems='flex-start'>
            <Avatar sx={{ bgcolor: "#ffb74d", width: 48, height: 48 }}>
              {detail.user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box flex={1}>
              <Stack>
                <Typography fontWeight={600}>
                  {detail.user?.name || "Người dùng"}
                </Typography>
                <Rating value={detail.rate || 0} readOnly size='small' />
              </Stack>
            </Box>
          </Stack>

          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography mt={2} variant='body2' color='text.secondary'>
              Đánh giá lúc {formatFullDate(detail.created_at)}
            </Typography>

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
            {detail.comment || ""}
          </Typography>
          
          <Button 
          
          onClick={async()=>{
            setHiddenDialogOpen(true)
            // setLoading(true)
            // let result = await setHiddenDialogOpen()
            // if(result){
            //   setOpen(false)
            // }
            // setLoading(false)
          }}
          disabled={loading}
          sx={{
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

          }} >  {loading && <CircularProgress size={15} sx={{fontSize:"10px",mr:"10px",color:"#98B720"}} />}<>{!review?.disabled?"Ẩn đánh giá" :"Hiện đánh giá"}</></Button>
        </Box>
      </DialogContent>
    </StyledModal>
  );
}