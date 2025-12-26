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
  Pagination,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  PauseCircleOutline as PauseCircleIcon,
  Close,
  HighlightOff,
  CheckCircle,
  Description,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import HotelDetail from "./HotelDetail";

import RoomDetail from "./RoomDetail";
import { getHotel, toggleHotels, updateHotelStatus, updateRoomStatus } from "../../service/hotel";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { parseRoomName } from "../../utils/utils";

// Component menu thao tác
function ActionMenu({ setAction, setDeleteDialogOpen, setIdHotel, hotel, setCancelDialogOpen,activeTab }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        {/* Chi tiết */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel)
            if(activeTab == "rooms"){
              setAction("detail");
              navigate(`/approval?tab=all`);
            }else{
              setAction("edit_detail");
              navigate(`/approval?id=${hotel.id}`);
            }
            
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#424242" }} // Màu xám đậm nhẹ
        >
          <Description fontSize='small' />
          Chi tiết
        </MenuItem>

        {/* Phê duyệt khách sạn */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel)
            setDeleteDialogOpen(true)
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#2e7d32" }} // Màu xanh lá đậm (success)
        >
          <CheckCircle fontSize='small' />
          Phê duyệt khách sạn
        </MenuItem>

        {/* Từ chối khách sạn */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel)
            setCancelDialogOpen(true)
          }}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }} // Màu đỏ (error)
        >
          <HighlightOff fontSize='small' />
          Từ chối khách sạn
        </MenuItem>

        {/* Hủy đặt phòng - giữ nguyên như code cũ của bạn */}
      </Menu>
    </>
  );
}

export default function ApprovalView({ hotels, getDataHotels, pagination,
  getDataRooms,
  onPageChange, paginationRooms,
  onPageChangeRooms,
  rooms, }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [action, setAction] = useState("manager");
  const [activeTab, setActiveTab] = useState("manager");
  const [idHotel, setIdHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const total = hotels.length;
  const navigate = useNavigate();
  const active = hotels.filter((h) => h.status === "active").length;
  const inactive = total - active;
  const [detailHotel, setDetailHotel] = useState({});
  const [searchParams] = useSearchParams();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (searchParams.get("id")) {
      getHotelDetail();
    }
  }, [searchParams]);
  const getHotelDetail = async () => {
    try {
      let result = await getHotel(searchParams.get("id"));
      if (result?.id) {
        setDetailHotel(result);
        if (room.id) {
          setRoom(result?.room_types.find((item) => item.id == room.id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleStatusHotel = async (status) => {
    try {
      let result
      if (status == "reject") {
        if(activeTab=="manager"){
          result = await updateHotelStatus(idHotel.id, {
            action: "reject",
            reason
          })
        }else{
          result = await updateRoomStatus(room.id, {
            action: "reject",
            reason
          })
        }
       
        setCancelDialogOpen(false)
      }
      if (status == "approve") {
        if(activeTab=="manager"){
          result = await updateHotelStatus(idHotel.id, {
            action: "approve"
          })
        }else{
          result = await updateRoomStatus(room.id, {
            action: "approve"
          })
        }
        setDeleteDialogOpen(false)
      }
      if (result?.message && !result?.code) {
        setReason("")
        toast.success(result?.message);
        if(activeTab=="manager"){
          getDataHotels()
        }else{
          getDataRooms()
        }
      } else {
        toast.error(result?.message);
      }
      console.log("AAA result", result)
    } catch (error) {
      console.log(error)
    }
  }
  const formatPrice = (price: number | null | undefined): string => {
    if (!price || price === 0) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };
  const handleRoomClick = (room) => {
    setRoom(room);
    setAction("detail");
    navigate(`/approval?tab=all`);
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      {action == "detail" && (
        <RoomDetail
          getHotelDetail={getHotelDetail}
          detailHotel={detailHotel}
          room={room}
          onNext={setAction}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setCancelDialogOpen={setCancelDialogOpen}
        />
      )}

      {action == "edit_detail" && (
        <HotelDetail
          detailHotel={detailHotel}
          getHotelDetail={getHotelDetail}
          setRoom={setRoom}
          setAction={setAction}
          handleStatusHotel={handleStatusHotel}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setCancelDialogOpen={setCancelDialogOpen}
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
              Phê duyệt
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
              Danh sách phê duyệt
            </Typography>
            <Box sx={{ display: "flex", gap: 4, my: 3 }}>
              <Typography
                fontSize={16}
                fontWeight={600}
                onClick={() => setActiveTab("manager")}
                color={activeTab == "manager" ? "#98B720" : "#999"}
                sx={{
                  borderBottom:
                    activeTab == "manager" ? "3px solid #98B720" : "none",
                  pb: 0.5,
                  cursor: "pointer",
                }}>
                Khách sạn
              </Typography>
              <Typography
                fontSize={16}
                fontWeight={600}
                onClick={() => setActiveTab("rooms")}
                color={activeTab == "rooms" ? "#98B720" : "#999"}
                sx={{
                  borderBottom:
                    activeTab == "rooms" ? "3px solid #98B720" : "none",
                  cursor: "pointer",
                }}>
                Loại phòng
              </Typography>
            </Box>

            {activeTab == "manager"&&

            <>
            <Box sx={{ mb: 3 }}>
              <Stack direction='row' spacing={4} color='#555' fontSize={14}>
                <Box>
                  Phê duyệt <strong>{total}</strong>
                </Box>
                <Box>
                  Đã duyệt <strong>{active}</strong>
                </Box>
                <Box>
                  Bị từ chối <strong>{inactive}</strong>
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
                      "Mail",
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
                  {hotels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align='center'>
                        <Typography>Không có dữ liệu</Typography>
                      </TableCell>
                    </TableRow>
                  ) :
                    <>
                      {hotels?.map((hotel, index) => (
                        <TableRow hover key={hotel.id}>
                          <TableCell>{index + 1}</TableCell>

                          <TableCell
                            onClick={() => {
                              setIdHotel(hotel)
                              navigate(`/approval?id=${hotel.id}`);
                              setAction("edit_detail");
                            }}
                            sx={{ fontWeight: 500, cursor: "pointer" }}>
                            {parseLang(hotel.name)}
                          </TableCell>

                          <TableCell>
                            {renderCooperationChip(hotel.cooperation_type)}
                          </TableCell>

                          <TableCell >{renderStatusChip(hotel.status)}</TableCell>

                          <TableCell sx={{ maxWidth: 280 }}>
                            {parseLang(hotel.address)}
                          </TableCell>

                          <TableCell>{hotel.commission_rate}%</TableCell>

                          <TableCell>
                            {hotel.cooperation_type === "listing"
                              ? "Online"
                              : "Cả hai"}
                          </TableCell>

                          <TableCell>
                            <ActionMenu
                              hotel={hotel}
                              setIdHotel={setIdHotel}
                              setAction={setAction}
                              setDeleteDialogOpen={setDeleteDialogOpen}
                              setCancelDialogOpen={setCancelDialogOpen}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>}
                </TableBody>
              </Table>
            </TableContainer>
            {hotels.length !== 0 && <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
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
            </Stack>}
            
            </>}
            {activeTab == "rooms"&&
            <>
            <Box sx={{ mb: 3 }}>
              <Stack direction='row' spacing={4} color='#555' fontSize={14}>
                <Box>
                  Phê duyệt <strong>{total}</strong>
                </Box>
                <Box>
                  Đã duyệt <strong>{active}</strong>
                </Box>
                <Box>
                  Bị từ chối <strong>{inactive}</strong>
                </Box>
              </Stack>
            </Box>
             <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                {[
                  "Tên loại phòng",
                  "Trang thái",
                  "Giá theo giờ",
                  "Giá qua đêm",
                  "Giá qua ngày",
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
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='#999'>Chưa có loại phòng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room: any) => (
                  <TableRow key={room.id} hover>
                    {/* Tên loại phòng */}
                    <TableCell
                      onClick={() => handleRoomClick(room)}
                      sx={{
                        fontWeight: 500,
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#98B720",
                        },
                      }}>
                      {parseRoomName(room.name) || "Không có tên"}
                    </TableCell>

                    {/* Trang thái */}
                    <TableCell>
                     {renderStatusChip(room.status)}
                    </TableCell>

                  

                    {/* Giá theo giờ */}
                    <TableCell>{formatPrice(room.price_hourly)}</TableCell>

                    {/* Giá qua đêm */}
                    <TableCell>{formatPrice(room.price_overnight)}</TableCell>

                    {/* Giá qua ngày */}
                    <TableCell>{formatPrice(room.price_daily)}</TableCell>

                    {/* Thao tác */}
                    <TableCell align='right'>
                      <ActionMenu hotel={room}
                      activeTab={activeTab}
                              setIdHotel={setRoom}
                              setAction={setAction}  setDeleteDialogOpen={setDeleteDialogOpen}
                              setCancelDialogOpen={setCancelDialogOpen} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {rooms.length !== 0 && <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
              <Pagination
                key={paginationRooms.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
                count={paginationRooms.total_pages}
                page={paginationRooms.page}
                onChange={onPageChangeRooms}
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
            </Stack>}
            </>
            }

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
                src={success}
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
              {activeTab=="manager"?" Xác nhận phê duyệt khách sạn":" Xác nhận phê duyệt loại phòng"}
           

          </Typography>
          <Typography fontSize='14px' color='#666'>
          {activeTab=="manager"?` Hãy đảm bảo đầy đủ thông tin, giá và tình trạng sãn sàng trước khi duyệt khách sạn để tránh sai sót trong quá trình đặt phòng.`:` Hãy đảm bảo đầy đủ thông tin, giá và tình trạng sãn sàng trước khi duyệt phòng để tránh sai sót trong quá trình đặt phòng.`}
           

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
              handleStatusHotel("approve")
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
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ textAlign: "left", p: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Typography fontWeight={600} fontSize='20px' mb={1}>
            {activeTab=="manager"?`Từ chối khách sạn`:`Từ chối phòng`} 
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

            Từ chối kinh doanh khách sạn. Bạn có thể mở kinh doanh lại trong tương lai.
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
              handleStatusHotel("reject")
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
      sx: { bgcolor: "#FEF7F2", color: "#EA6A00" },
    },
    terminated: {
      label: "Đã kết thúc",
      sx: { bgcolor: "#D32F2F", color: "white" },
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
