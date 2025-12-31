import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  TextField,
  InputAdornment,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  PauseCircleOutline as PauseCircleIcon,
  PlayCircleOutline as PlayCircleIcon,
  Close,
  HighlightOff,
  CheckCircle,
  Description,
  Search,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import HotelDetail from "./HotelDetail";
import RoomDetail from "./RoomDetail";
import { getHotel, toggleHotels, updateHotelStatus } from "../../service/hotel";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { parseRoomName } from "../../utils/utils";

// Component menu thao tác
function ActionMenu({
  hotel,
  setAction,
  setDeleteDialogOpen,
  setIdHotel,
  setApproveDialogOpen,
  setCancelDialogOpen,
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetail = () => {
    navigate(`/manager-hotel?id=${hotel.id}`);
    setAction("edit_detail");
    handleClose();
  };

  const handleApprove = () => {
    setIdHotel(hotel);
    setApproveDialogOpen(true);
  };

  const handleReject = () => {
    setIdHotel(hotel);
    setCancelDialogOpen(true);
  };

  const handleTogglePause = () => {
    setIdHotel(hotel);
    if (hotel?.status == "terminated") {
      setApproveDialogOpen(true);
    } else {
      setCancelDialogOpen(true);
    }
    handleClose();
  };

  const { status } = hotel;

  return (
    <>
      <Button
        variant='outlined'
        size='small'
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
            padding: 0,
          },
        }}>
        {/* Luôn có: Chi tiết */}
        <MenuItem
          onClick={handleViewDetail}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }}>
          <Description fontSize='small' />
          Chi tiết
        </MenuItem>

        {/* Trường hợp pending: Phê duyệt / Từ chối */}
        {status === "pending" && (
          <>
            <MenuItem
              onClick={handleApprove}
              sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }}>
              <CheckCircle fontSize='small' />
              Phê duyệt khách sạn
            </MenuItem>

            <MenuItem
              onClick={handleReject}
              sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
              <HighlightOff fontSize='small' />
              Từ chối khách sạn
            </MenuItem>
          </>
        )}

        {/* Các status khác: Ngừng hoặc Mở lại */}
        {status !== "pending" && (
          <>
            {status === "active" || status === "paused" ? (
              <MenuItem
                onClick={handleTogglePause}
                sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
                <PauseCircleIcon fontSize='small' />
                Ngừng kinh doanh
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleTogglePause}
                sx={{ gap: 1.5, fontSize: 14, color: "#98b720" }}>
                <PlayCircleIcon fontSize='small' />
                Mở lại kinh doanh
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
}

export default function ManagerHotelView({
  hotels,
  getDataHotels,
  pagination,
  locations,
  onPageChange,
  filters,
  onFilterChange,
  onResetFilter,
  loading
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [action, setAction] = useState("manager");
  const [idHotel, setIdHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const total = hotels.length;
  const navigate = useNavigate();
  const active = hotels.filter((h) => h.status === "active").length;
  const inactive = total - active;
  const [detailHotel, setDetailHotel] = useState({});
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reason, setReason] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    name: "",
    cooperation_type:"",
    city: "",
   
  });
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        name: filters.name || "",
        cooperation_type: filters.cooperation_type || "",
        city: filters.city || "",
      });
    }
  }, [filters]);
  const displayedHotels = hotels.filter((hotel) =>
  parseRoomName(hotel.name).toLowerCase().includes(localFilters.name.toLowerCase())
);



  useEffect(() => {
    if (searchParams.get("id")) {
      getHotelDetail();
    }
  }, [searchParams]);
  const handleSearch = () => {
    // Format dateRange thành chuỗi cho API
    const updatedFilters = {
      ...localFilters,
    };

    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      name: "",
    cooperation_type:"",
    city: "",
    });
    onResetFilter();
  };
  const getHotelDetail = async () => {
    try {
      let result = await getHotel(searchParams.get("id"));
      if (result?.id) {
        setDetailHotel(result);
        if (room?.id) {
          setRoom(result?.room_types.find((item) => item.id == room.id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleStatusHotel = async (status) => {
    try {
      let result;
      if (status == "reject") {
        result = await updateHotelStatus(detailHotel?.id || idHotel.id, {
          action: "terminate",
          reason,
        });
        setCancelDialogOpen(false);
      }
      if (status == "approve") {
        result = await updateHotelStatus(detailHotel?.id || idHotel.id, {
          action: "approve",
        });
        setApproveDialogOpen(false);
      }
      if (status == "paused") {
        result = await updateHotelStatus(detailHotel?.id || idHotel.id, {
          action: "approve",
        });
        setDeleteDialogOpen(false);
      }
      if (status == "active") {
        result = await updateHotelStatus(detailHotel?.id || idHotel.id, {
          action: "terminate",
        });
        setDeleteDialogOpen(false);
      }
      if (result?.message && !result?.code) {
        setReason("");
        toast.success(result?.message);
        getDataHotels();
        if (detailHotel?.id) {
          getHotelDetail();
        }
      } else {
        toast.error(result?.message);
      }
      console.log("AAA result", result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
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
              <img src={success} alt='' />
            </Box>
            <IconButton
              onClick={() => setApproveDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Xác nhận mở lại khách sạn
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Hãy đảm bảo đầy đủ thông tin, giá và tình trạng sãn sàng trước khi
            duyệt khách sạn để tránh sai sót trong quá trình đặt phòng.
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
              handleStatusHotel("approve");
            }}
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
            onClick={() => setApproveDialogOpen(false)}
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
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "left", p: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Typography fontWeight={600} fontSize='20px' mb={1}>
              Từ chối khách sạn
            </Typography>
            <IconButton
              onClick={() => setCancelDialogOpen(false)}
              sx={{ position: "absolute", top: -5, right: 0 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, padding: 1 }}>
          <Typography fontSize='14px' color='#666'>
            Từ chối kinh doanh khách sạn. Bạn có thể mở kinh doanh lại trong
            tương lai.
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder='Nhập nội dung từ chối loại phòng...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant='outlined'
            fullWidth
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,

                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#cddc39", // Border mặc định
                  borderWidth: "1px", // Tăng độ dày nếu muốn nổi bật hơn
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
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 4,
            gap: 2,
            flexDirection: "column",
          }}>
          <Button
            disabled={!reason}
            onClick={async () => {
              handleStatusHotel("reject");
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            Xác nhận từ chối kinh doanh
          </Button>
          <Button
            onClick={() => setCancelDialogOpen(false)}
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
      {action == "detail" && (
        <RoomDetail
          getHotelDetail={getHotelDetail}
          detailHotel={detailHotel}
          room={room}
          onNext={setAction}
        />
      )}

      {action == "edit_detail" && (
        <HotelDetail
          detailHotel={detailHotel}
          getHotelDetail={getHotelDetail}
          setRoom={setRoom}
          room={room}
          setAction={setAction}
          setCancelDialogOpen={setCancelDialogOpen}
          setApproveDialogOpen={setApproveDialogOpen}
        />
      )}
      {action == "manager" && (
        <>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}>
            <Typography variant='h5' fontWeight='bold'>
              Quản lý khách sạn
            </Typography>
          </Box>

          {/* Stats */}

          {/* Table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid #eee",
              padding: 3,
            }}>
            <Typography variant='h6' fontWeight='600'>
              Danh sách khách sạn
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              mb={4}
              spacing={2}
              alignItems='end'>
              {/* Tìm kiếm */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Tìm kiếm</Typography>
                <TextField
                  placeholder='Tên khách sạn'
                  value={localFilters.name}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      name: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 280,
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",

                      backgroundColor: "#fff",
                      "& fieldset": {
                        borderColor: "#cddc39", // Border mặc định
                        borderWidth: "1px", // Tăng độ dày nếu muốn nổi bật hơn
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
              </Box>
              <Box>
                <Typography sx={{ mb: 1.5 }}>Địa điểm</Typography>
                <Select
                  displayEmpty
                  defaultValue=''
                  value={localFilters.city}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      city: e.target.value,
                    })
                  }
                  sx={{
                    width: 200,
                    height: 40,

                    borderRadius: "24px",
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Màu đỏ mặc định (có thể dùng #f44336, #d32f2f...)
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Hover: đỏ đậm hơn
                      borderWidth: "1px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39 !important", // QUAN TRỌNG: Focus vẫn màu đỏ rực
                      borderWidth: "1px !important",
                    },
                    // Tùy chọn: đổi màu mũi tên dropdown cho đồng bộ
                    "& .MuiSelect-icon": {
                      color: "#cddc39",
                    },
                    // Nếu có label, giữ màu khi focus
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#cddc39",
                    },
                  }}>
                  <MenuItem value='' disabled>
                    Chọn địa điểm
                  </MenuItem>

                  {locations?.map((item)=>{
                    return <MenuItem value={item.id}>{item?.name?.vi}</MenuItem>
                  })}
                  
                  
                  {/* Nếu cần thêm */}
                </Select>
              </Box>

              {/* 2 ô DatePicker – ĐÃ FIX LỖI 100% */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Hình thức hợp tác</Typography>
                <Select
                  displayEmpty
                  defaultValue=''
                  value={localFilters.cooperation_type}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      cooperation_type: e.target.value,
                    })
                  }
                  sx={{
                    width: 200,
                    height: 40,
                    borderRadius: "24px",
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Màu đỏ mặc định (có thể dùng #f44336, #d32f2f...)
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39", // Hover: đỏ đậm hơn
                      borderWidth: "1px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cddc39 !important", // QUAN TRỌNG: Focus vẫn màu đỏ rực
                      borderWidth: "1px !important",
                    },
                    // Tùy chọn: đổi màu mũi tên dropdown cho đồng bộ
                    "& .MuiSelect-icon": {
                      color: "#cddc39",
                    },
                    // Nếu có label, giữ màu khi focus
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#cddc39",
                    },
                  }}>
                  <MenuItem value='' disabled>
                    Chọn tình trạng
                  </MenuItem>
                  <MenuItem value='listing'>Listing</MenuItem>
                  <MenuItem value='contract'>Contract</MenuItem>
                 
                  {/* Nếu cần thêm */}
                </Select>
              </Box>

              {/* Nút */}
              <Stack direction='row' alignItems={"end"} spacing={1}>
                <Button
                  variant='contained'
                  onClick={handleSearch}
                  sx={{
                    borderRadius: "24px",
                    bgcolor: "#98b720",
                    height: 40,
                    minWidth: 120,
                  }}>
                  Tìm kiếm
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleReset}
                  sx={{
                    borderRadius: "24px",
                    height: 40,
                    minWidth: 120,
                    border: "1px solid rgba(208, 211, 217, 1)",
                    background: "rgba(240, 241, 243, 1)",
                    color: "black",
                  }}>
                  Xóa tìm kiếm
                </Button>
              </Stack>
            </Stack>
            <Box sx={{ mb: 3 }}>
              <Stack direction='row' spacing={4} color='#555' fontSize={14}>
                <Box>
                  Tất cả <strong>{total}</strong>
                </Box>
                <Box>
                  Dạng hoạt động <strong>{active}</strong>
                </Box>
                <Box>
                  Ngừng kinh doanh <strong>{inactive}</strong>
                </Box>
              </Stack>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    {[
                      "#",
                      "Tên khách sạn",
                      "Hình thức",
                      "Tình trạng",
                      "Địa chỉ",
                     
                      "Số điện thoại",
                      "",
                    ].map((head) => (
                      <TableCell
                        key={head}
                        sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) :<>
                  {hotels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align='center'>
                        <Typography>Không có dữ liệu</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {displayedHotels?.map((hotel, index) => (
                        <TableRow hover key={hotel.id}>
                          <TableCell>{index + 1}</TableCell>

                          <TableCell
                            onClick={() => {
                              navigate(`/manager-hotel?id=${hotel.id}`);
                              setAction("edit_detail");
                            }}
                            sx={{ fontWeight: 500, cursor: "pointer" }}>
                            {parseLang(hotel.name)}
                          </TableCell>

                          <TableCell>
                            {renderCooperationChip(hotel.cooperation_type)}
                          </TableCell>

                          <TableCell>
                            {renderStatusChip(hotel.status)}
                          </TableCell>

                          <TableCell sx={{ maxWidth: 280 }}>
                            {parseLang(hotel.address)}
                          </TableCell>

                          {/* <TableCell>{hotel?.email}</TableCell> */}

                          <TableCell>
                            {hotel.phone }
                          </TableCell>

                          <TableCell>
                            {["pending", "active", "terminated"].includes(
                              hotel.status
                            ) && (
                              <ActionMenu
                                hotel={hotel}
                                setAction={setAction}
                                setIdHotel={setIdHotel}
                                setDeleteDialogOpen={setDeleteDialogOpen}
                                setApproveDialogOpen={setApproveDialogOpen}
                                setCancelDialogOpen={setCancelDialogOpen}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  
                  </>}
                </TableBody>
              </Table>
            </TableContainer>
            {hotels.length !== 0 && (
              <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
                <Pagination
                  key={pagination.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
                  count={pagination.total_pages}
                  page={pagination.page}
                  onChange={onPageChange}
                  siblingCount={1}
                  boundaryCount={1}
                  color='primary'
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
              </Stack>
            )}
          </Paper>
        </>
      )}
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
              <img
                src={idHotel?.status == "paused" ? success : remove}
                alt=''
              />
            </Box>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            {idHotel?.status == "paused"
              ? "Xác nhận mở lại kinh doanh"
              : "Cảnh báo"}
          </Typography>
          <Typography fontSize='14px' color='#666'>
            {idHotel?.status == "paused"
              ? "Hãy đảm bảo cập nhật đầu đủ thông tin, giá và tình trạng sãn sàng trước khi mở lại hoạt động kinh doanh để tránh sai sót trong quá trình đặt phòng."
              : " Khách sẽ không nhìn thấy khách sạn này sau khi bạn ngừng kinh doanh khách sạn. Bạn có thể mở kinh doanh lại loại phòng trong tương lai."}
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
              handleStatusHotel(
                idHotel?.status == "active" ? "active" : "paused"
              );
            }}
            variant='contained'
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              bgcolor: "#98b720",
              "&:hover": { bgcolor: "#8ab020" },
              width: "100%",
            }}>
            {idHotel?.status == "paused"
              ? "Gửi duyệt"
              : "Xác nhận ngừng kinh doanh"}
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
    </Box>
  );
}

const parseLang = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj.vi || obj.en || "";
  } catch {
    return "";
  }
};
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

const renderCooperationChip = (type) => {
  if (type === "listing") {
    return (
      <Chip
        label='Listing'
        size='small'
        sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
      />
    );
  }
  return <Chip label={type} size='small' />;
};
