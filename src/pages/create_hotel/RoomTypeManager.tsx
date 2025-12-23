// src/components/hotel/create/RoomTypeManager.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Autocomplete,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import BedIcon from "@mui/icons-material/Bed";
import CompassCalibrationIcon from "@mui/icons-material/CompassCalibration";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SearchIcon from "@mui/icons-material/Search";
import { useBookingContext } from "../../App"; // Điều chỉnh đường dẫn nếu cần

const bedTypes = [
  "1 giường đơn",
  "2 giường đơn",
  "1 giường đôi",
  "1 giường đôi lớn (Queen)",
  "1 giường king",
  "2 giường king",
];

const directions = ["Hướng Đông", "Hướng Tây", "Hướng Nam", "Hướng Bắc"];

interface Pricing {
  hourly: {
    enabled: boolean;
    firstHours: string;
    extraHour: string;
    maxHours: string;
  };
  overnight: {
    enabled: boolean;
    price: string;
  };
  daily: {
    enabled: boolean;
    price: string;
  };
}

interface RoomType {
  id: string;
  name: string;
  quantity: string;
  area: string;
  bedType: string;
  direction: string;
  description: string;
  images: File[];
  imagePreviews: string[];
  pricing: Pricing;
}

export default function RoomTypeManager({
  onTempChange,
  errors = {},
  touched = {},
  onFieldTouch,
}) {
  const context = useBookingContext();
  const dataRef = useRef<{ roomTypes: RoomType[]; activeTab: number }>({
    roomTypes: [],
    activeTab: 0,
  });

  // Khởi tạo từ context hoặc mặc định
  console.log("AAAA RoomTypeManager", context);
  const getInitialData = (): { roomTypes: RoomType[]; activeTab: number } => {
    const saved = context?.state?.create_hotel;
    if (
      saved?.roomTypes &&
      Array.isArray(saved.roomTypes) &&
      saved.roomTypes.length > 0
    ) {
      return {
        roomTypes: saved.roomTypes,
        activeTab: saved.activeRoomTab ?? 0,
      };
    }
    return {
      roomTypes: [
        {
          id: Date.now().toString(),
          name: "",
          quantity: "",
          area: "",
          bedType: "",
          direction: "",
          description: "",
          images: [],
          imagePreviews: [],
          pricing: {
            hourly: {
              enabled: true,
              firstHours: "",
              extraHour: "",
              maxHours: "12",
            },
            overnight: { enabled: true, price: "" },
            daily: { enabled: true, price: "" },
          },
        },
      ],
      activeTab: 0,
    };
  };

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(
    getInitialData().roomTypes
  );
  const [activeTab, setActiveTab] = useState<number>(
    getInitialData().activeTab
  );

  const current = roomTypes[activeTab];

  // Cập nhật dataRef mỗi khi có thay đổi

  useEffect(() => {
    const handler = setTimeout(() => {
      const newData = {
        roomTypes,
        activeTab,
      };

      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: newData,
        },
      });
    }, 300); // ⏱ 300ms sau lần change cuối
    const newData = {
      roomTypes,
      activeTab,
    };
    dataRef.current = newData;
    onTempChange?.(newData);
    return () => clearTimeout(handler);
  }, [roomTypes, activeTab]);

  // Lưu vào context khi unmount
  useEffect(() => {
    return () => {
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: { ...dataRef.current },
        },
      });
    };
  }, []);
  const handleTouch = (field: string) => {
    onFieldTouch?.(`room_${activeTab}_${field}`);
  };
  // Thêm loại phòng mới
  const addRoomType = () => {
    const newRoom: RoomType = {
      id: Date.now().toString(),
      name: "",
      quantity: "",
      area: "",
      bedType: "",
      direction: "",
      description: "",
      images: [],
      imagePreviews: [],
      pricing: {
        hourly: {
          enabled: true,
          firstHours: "",
          extraHour: "",
          maxHours: "12",
        },
        overnight: { enabled: true, price: "" },
        daily: { enabled: true, price: "" },
      },
    };
    setRoomTypes((prev) => [...prev, newRoom]);
    setActiveTab(roomTypes.length);
  };

  // Xóa loại phòng
  const removeRoomType = (index: number) => {
    if (roomTypes.length === 1) return;
    setRoomTypes((prev) => prev.filter((_, i) => i !== index));
    setActiveTab((prev) => (prev >= index ? Math.max(0, prev - 1) : prev));
  };

  // Cập nhật field
  const updateRoomField = <K extends keyof RoomType>(
    field: K,
    value: RoomType[K]
  ) => {
    setRoomTypes((prev) =>
      prev.map((room, i) =>
        i === activeTab ? { ...room, [field]: value } : room
      )
    );
  };

  const updatePricing = (newPricing: Pricing) => {
    updateRoomField("pricing", newPricing);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "white", borderRadius: 3 }}>
      {/* Tabs loại phòng */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
          pt: 2,
        }}>
        {roomTypes.map((_, index) => (
          <Chip
            key={index}
            label={`Phòng ${index + 1}`}
            onClick={() => setActiveTab(index)}
            onDelete={
              roomTypes.length > 1 ? () => removeRoomType(index) : undefined
            }
            deleteIcon={<CloseIcon />}
            sx={{
              bgcolor: activeTab === index ? "#fff" : "#f0f0f0",
              border:
                activeTab === index ? "2px solid #9AC33C" : "1px solid #ddd",
              color: activeTab === index ? "#9AC33C" : "#666",
              fontWeight: 600,
              height: 36,
              fontSize: "0.95rem",
              "& .MuiChip-deleteIcon": { color: "#999", fontSize: 18 },
            }}
          />
        ))}
        <Button
          variant='contained'
          startIcon={<AddCircleOutlineIcon />}
          onClick={addRoomType}
          sx={{
            bgcolor: "#fff8e1",
            color: "#ef6c00",
            fontWeight: 600,
            borderRadius: 20,
            textTransform: "none",
            height: 36,
            px: 3,
            boxShadow: "0 2px 8px rgba(239,108,0,0.2)",
            "&:hover": { bgcolor: "#ffe082" },
          }}>
          Thêm loại phòng
        </Button>
      </Box>

      {/* Thông tin phòng */}
      <Box sx={{ py: 2 }}>
        <Box display='flex' justifyContent='space-between' gap={4}>
          <Box width={{ xs: "100%", md: "30%" }}>
            <Typography variant='h6' fontWeight={600} gutterBottom>
              Thông tin phòng
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Thiết lập các thông tin cơ bản của phòng
            </Typography>
          </Box>

          <Box width={{ xs: "100%", md: "65%" }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Tên loại phòng
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Nhập tên loại phòng'
                  value={current?.name || ""}
                  onChange={(e) => {
                    updateRoomField("name", e.target.value);
                  }}
                  onBlur={() => {
                    handleTouch("name");
                  }}
                  error={
                    touched[`room_${activeTab}_name`] &&
                    !!errors[`room_${activeTab}_name`]
                  }
                  helperText={
                    touched[`room_${activeTab}_name`]
                      ? errors[`room_${activeTab}_name`]
                      : " "
                  }
                  variant='outlined'
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Số lượng phòng bán
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Nhập số phòng'
                  value={current?.quantity || ""}
                  onChange={(e) => {
                    updateRoomField("quantity", e.target.value);
                  }}
                  onBlur={() => {
                    handleTouch("quantity");
                  }}
                  error={
                    touched[`room_${activeTab}_quantity`] &&
                    !!errors[`room_${activeTab}_quantity`]
                  }
                  helperText={
                    touched[`room_${activeTab}_quantity`]
                      ? errors[`room_${activeTab}_quantity`]
                      : " "
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Diện tích phòng (m²)
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Nhập diện tích phòng'
                  value={current?.area || ""}
                  onChange={(e) => {
                    updateRoomField("area", e.target.value);
                  }}
                  onBlur={() => {
                    handleTouch("area");
                  }}
                  error={
                    touched[`room_${activeTab}_area`] &&
                    !!errors[`room_${activeTab}_area`]
                  }
                  helperText={
                    touched[`room_${activeTab}_area`]
                      ? errors[`room_${activeTab}_area`]
                      : " "
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>m²</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Loại giường
                </Typography>
                <Autocomplete
                  options={bedTypes}
                  value={current?.bedType || ""}
                  onChange={(_, v) => {
                    updateRoomField("bedType", v || "");
                  }}
                  onBlur={() => {
                    handleTouch("bedType");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Chọn loại giường'
                      error={
                        touched[`room_${activeTab}_bedType`] &&
                        !!errors[`room_${activeTab}_bedType`]
                      }
                      helperText={
                        touched[`room_${activeTab}_bedType`]
                          ? errors[`room_${activeTab}_bedType`]
                          : " "
                      }
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position='start'>
                            <BedIcon sx={{ color: "#999" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 1.5,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <BedIcon sx={{ mr: 2, color: "#999", fontSize: 20 }} />
                      {option}
                      {selected && (
                        <CheckIcon sx={{ ml: "auto", color: "#4caf50" }} />
                      )}
                    </li>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Hướng phòng
                </Typography>
                <Autocomplete
                  options={directions}
                  value={current?.direction || ""}
                  onChange={(_, v) => {
                    updateRoomField("direction", v || "");
                  }}
                  onBlur={() => {
                    handleTouch("direction");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Chọn hướng phòng'
                      error={
                        touched[`room_${activeTab}_direction`] &&
                        !!errors[`room_${activeTab}_direction`]
                      }
                      helperText={
                        touched[`room_${activeTab}_direction`]
                          ? errors[`room_${activeTab}_direction`]
                          : " "
                      }
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position='start'>
                            <CompassCalibrationIcon sx={{ color: "#999" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 1.5,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <CompassCalibrationIcon
                        sx={{ mr: 2, color: "#999", fontSize: 20 }}
                      />
                      {option}
                      {selected && (
                        <CheckIcon sx={{ ml: "auto", color: "#4caf50" }} />
                      )}
                    </li>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom>
                  Mô tả phòng (Không bắt buộc)
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  fontSize='0.875rem'
                  sx={{ mb: 1 }}>
                  Một đoạn giới thiệu ngắn gọn về loại phòng
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder='Nhập mô tả về loại phòng...'
                  value={current?.description || ""}
                  onChange={(e) => {
                    updateRoomField("description", e.target.value);
                  }}
                  onBlur={() => {
                    handleTouch("description");
                  }}
                  error={
                    touched[`room_${activeTab}_description`] &&
                    !!errors[`room_${activeTab}_description`]
                  }
                  helperText={
                    touched[`room_${activeTab}_description`]
                      ? errors[`room_${activeTab}_description`]
                      : " "
                  }
                  inputProps={{ maxLength: 3000 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                    },
                  }}
                />
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ float: "right", mt: 0.5 }}>
                  {(current?.description || "").length}/3000
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Upload ảnh */}
      <RoomImagesUpload
        previews={current?.imagePreviews || []}
        files={current?.images || []}
        onChange={(previews, files) => {
          setRoomTypes((prev) =>
            prev.map((r, i) =>
              i === activeTab
                ? { ...r, imagePreviews: previews, images: files }
                : r
            )
          );
        }}
      />

      <Divider sx={{ my: 4 }} />

      {/* Giá phòng */}
      <RoomPricingSection pricing={current?.pricing} onChange={updatePricing} />
    </Box>
  );
}

// Component Upload ảnh
function RoomImagesUpload({
  previews,
  files,
  onChange,
}: {
  previews: string[];
  files: File[];
  onChange: (p: string[], f: File[]) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(selected).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 3 * 1024 * 1024) {
        alert(`Ảnh "${file.name}" vượt quá 3MB!`);
        return;
      }
      if (files.length + newFiles.length >= 3) {
        alert("Chỉ được tải lên tối đa 3 ảnh!");
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newFiles.length > 0) {
      onChange([...previews, ...newPreviews], [...files, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(
      previews.filter((_, i) => i !== index),
      files.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box display='flex' justifyContent='space-between' gap={4}>
        <Box width={{ xs: "100%", md: "30%" }}>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Hình ảnh phòng
          </Typography>
        </Box>
        <Box width={{ xs: "100%", md: "65%" }}>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 3, fontSize: "0.875rem" }}>
            Tải lên ít nhất 3 ảnh phòng (phòng ngủ, phòng tắm, view). Tối đa
            3MB/ảnh.
          </Typography>

          <Grid container spacing={2}>
            {previews.map((src, i) => (
              <Grid item key={i}>
                <Box sx={{ position: "relative", width: 160, height: 160 }}>
                  <img
                    src={src}
                    alt={`preview ${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #eee",
                    }}
                  />
                  <IconButton
                    size='small'
                    onClick={() => removeImage(i)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                    }}>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            {previews.length < 3 && (
              <Grid item>
                <Button
                  variant='outlined'
                  component='label'
                  sx={{
                    width: 160,
                    height: 160,
                    border: "2px dashed #ccc",
                    borderRadius: 3,
                    bgcolor: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    color: "#999",
                    textTransform: "none",
                  }}>
                  <PhotoCamera sx={{ fontSize: 40, color: "#ddd" }} />
                  <Typography variant='body2'>Thêm ảnh</Typography>
                  <input
                    type='file'
                    hidden
                    multiple
                    accept='image/jpeg,image/png,image/jpg'
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            )}
          </Grid>

          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ mt: 2, display: "block" }}>
            Đã tải lên {previews.length}/3 ảnh
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Component Giá phòng
function RoomPricingSection({
  pricing,
  onChange,
}: {
  pricing?: Pricing;
  onChange: (p: Pricing) => void;
}) {
  if (!pricing) return null;

  const toggle = (key: keyof Pricing) => {
    onChange({
      ...pricing,
      [key]: { ...pricing[key], enabled: !pricing[key].enabled },
    });
  };

  const update = (key: keyof Pricing, field: string, value: any) => {
    onChange({
      ...pricing,
      [key]: { ...pricing[key], [field]: value },
    });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box display='flex' justifyContent='space-between' gap={4}>
        <Box width={{ xs: "100%", md: "30%" }}>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Giá phòng
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Thiết lập giá theo loại đặt phòng
          </Typography>
        </Box>

        <Box width={{ xs: "100%", md: "65%" }}>
          {/* Giá theo giờ */}
          <Paper variant='outlined' sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng theo giờ</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.hourly.enabled}
                    onChange={() => toggle("hourly")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>

            {pricing.hourly.enabled && (
              <>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom>
                      Số giờ đầu
                    </Typography>
                    <TextField
                      fullWidth
                      type='number'
                      placeholder='Nhập số tiền'
                      value={pricing.hourly.firstHours}
                      onChange={(e) =>
                        update("hourly", "firstHours", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            đồng/2 giờ
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 2,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom>
                      Giờ thêm
                    </Typography>
                    <TextField
                      fullWidth
                      type='number'
                      placeholder='Nhập số tiền'
                      value={pricing.hourly.extraHour}
                      onChange={(e) =>
                        update("hourly", "extraHour", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            đồng/1 giờ
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 2,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Số giờ tối đa
                </Typography>
                <Select
                  fullWidth
                  value={pricing.hourly.maxHours}
                  onChange={(e) => update("hourly", "maxHours", e.target.value)}
                  displayEmpty
                  sx={{
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#a0d468",
                      borderWidth: 2,
                    },
                  }}>
                  <MenuItem value='' disabled>
                    Chọn số giờ tối đa
                  </MenuItem>
                  {[6, 8, 10, 12, 18, 24].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h} giờ
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </Paper>

          {/* Qua đêm */}
          <Paper variant='outlined' sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng qua đêm</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.overnight.enabled}
                    onChange={() => toggle("overnight")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>
            {pricing.overnight.enabled && (
              <TextField
                fullWidth
                type='number'
                placeholder='Nhập số tiền'
                value={pricing.overnight.price}
                onChange={(e) => update("overnight", "price", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>đồng/đêm</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                  },
                }}
              />
            )}
          </Paper>

          {/* Theo ngày */}
          <Paper variant='outlined' sx={{ p: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng theo ngày</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.daily.enabled}
                    onChange={() => toggle("daily")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>
            {pricing.daily.enabled && (
              <TextField
                fullWidth
                type='number'
                placeholder='Nhập số tiền'
                value={pricing.daily.price}
                onChange={(e) => update("daily", "price", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>đồng/ngày</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                  },
                }}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
