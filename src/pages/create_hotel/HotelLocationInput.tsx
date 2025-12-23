import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import MapIcon from "@mui/icons-material/Map";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useBookingContext } from "../../App";
// Dữ liệu địa chỉ Việt Nam (cập nhật 2025 - mẫu đầy đủ, bạn có thể mở rộng)
const vietnamData: Record<string, string[]> = {
  "Hà Nội": [
    "Ba Đình",
    "Hoàn Kiếm",
    "Đống Đa",
    "Cầu Giấy",
    "Hai Bà Trưng",
    "Thanh Xuân",
  ],
  "TP. Hồ Chí Minh": [
    "Quận 1",
    "Quận 3",
    "Quận 5",
    "Quận 10",
    "Bình Thạnh",
    "Gò Vấp",
    "Tân Bình",
    "Phú Nhuận",
  ],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn"],
  "Hải Phòng": ["Hồng Bàng", "Lê Chân", "Ngô Quyền", "Hải An"],
};
const wardsData: Record<string, string[]> = {
  "Đống Đa": ["Phường Phương Liên", "Phường Quốc Tử Giám", "Phường Trung Liệt"],
  "Ba Đình": ["Phường Ngọc Hà", "Phường Trúc Bạch"],
  "Hoàn Kiếm": ["Phường Hàng Buồm", "Phường Hàng Đào"],

  "Quận 1": ["Phường Bến Nghé", "Phường Nguyễn Thái Bình", "Phường Đa Kao"],
  "Quận 3": ["Phường 6", "Phường 7", "Phường 8"],
};

const provinces = Object.keys(vietnamData);

export default function HotelLocationInput({
  onTempChange,
  errors = {},
  touched = {},
  onFieldTouch,
}) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState({
    lat: 21.0285,
    lng: 105.8542,
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };
  const context = useBookingContext();

  const dataRef = useRef({});
  const mapRef = useRef(null);

  const [activeHotel, setActiveHotel] = useState(null);
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const newData = {
      selectedProvince,
      selectedDistrict,
      selectedWard,
      address,
      center,
    };
    dataRef.current = newData;

    onTempChange?.(newData);
  }, [selectedProvince, selectedDistrict, selectedWard, address, center]);
  const handleTouch = (field: string) => {
    onFieldTouch?.(field);
  };
  console.log("AAA dataCreateHotel", context?.state?.create_hotel);
  useEffect(() => {
    const saved = context?.state?.create_hotel;
    if (!saved) return;

    const {
      selectedProvince,
      selectedDistrict,
      selectedWard,
      address,
      center,
    } = saved;

    // 1. Load tỉnh trước
    if (selectedProvince && provinces.includes(selectedProvince)) {
      setSelectedProvince(selectedProvince);

      // Lấy danh sách quận/huyện tương ứng
      const newDistricts = vietnamData[selectedProvince] || [];
      setDistricts(newDistricts);

      // 2. Sau khi có districts → load district (dùng callback hoặc setTimeout nhỏ để đảm bảo state đã update)
      if (selectedDistrict && newDistricts.includes(selectedDistrict)) {
        // Dùng setTimeout 0 hoặc callback để chạy sau khi districts đã được set
        setTimeout(() => {
          setSelectedDistrict(selectedDistrict);

          const newWards = wardsData[selectedDistrict] || [];
          setWards(newWards);

          if (selectedWard && newWards.includes(selectedWard)) {
            setSelectedWard(selectedWard);
          }
        }, 0);
      }
    }

    if (address) setAddress(address);
    if (center?.lat && center?.lng) setCenter(center);
  }, [context?.state?.create_hotel]);

  // ⭐ LƯU DỮ LIỆU KHI UNMOUNT
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
  // Khi map dừng di chuyển (drag, zoom…)
  const onIdle = () => {
    if (!mapRef.current) return;

    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    // kiểm tra nếu giống nhau thì không update
    if (
      Math.abs(center.lat - lat) < 0.000001 &&
      Math.abs(center.lng - lng) < 0.000001
    ) {
      return;
    }

    setCenter({ lat, lng });
  };
  // Khi chọn tỉnh → load quận/huyện
  useEffect(() => {
    if (selectedProvince && vietnamData[selectedProvince]) {
      setDistricts(vietnamData[selectedProvince]);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  // Khi chọn quận → load phường/xã (giả lập)
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard(null);
      return;
    }

    const loadedWards = wardsData[selectedDistrict] || [];

    setWards(loadedWards);

    // nếu ward cũ không thuộc district mới => reset
    if (!loadedWards.includes(selectedWard)) {
      setSelectedWard(null);
    }
  }, [selectedDistrict]);
  console.log("AAA selectedDistrict", selectedDistrict);
  console.log("AAA wards", wards);
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "white", borderRadius: 3 }}>
      {/* Tiêu đề */}
      <Typography
        variant='subtitle1'
        fontWeight={600}
        color='text.primary'
        gutterBottom>
        Vị trí khách sạn trên bản đồ
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
        Giúp khách đặt phòng dễ dàng tìm đường tới khách sạn của bạn
      </Typography>

      {/* Ô tìm tỉnh/thành phố lớn */}
      <Autocomplete
        options={provinces}
        value={selectedProvince}
        onBlur={() => {
          handleTouch("selectedProvince");
        }}
        onChange={(_, newValue) => {
          setSelectedProvince(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='Tìm kiếm tỉnh/thành phố...'
            variant='outlined'
            fullWidth
            error={touched.selectedProvince && !!errors.selectedProvince}
            helperText={touched.selectedProvince && errors.selectedProvince}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "1.1rem",
                bgcolor: "white",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a0d468",
                  borderWidth: 2,
                },
              },
            }}
          />
        )}
        noOptionsText='Không tìm thấy tỉnh/thành phố'
      />

      {/* Form chi tiết khi đã chọn tỉnh */}
      {selectedProvince && (
        <Paper elevation={0} sx={{ padding: 0, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Địa chỉ chi tiết */}
            <Grid item xs={12}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Địa chỉ khách sạn
              </Typography>
              <TextField
                fullWidth
                placeholder='Nhập số nhà, tên đường...'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => handleTouch("address")}
                error={touched.address && !!errors.address}
                helperText={touched.address ? errors.address : " "}
                variant='outlined'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderColor: "#a0d468",
                    },
                  },
                }}
              />
            </Grid>

            {/* Thành phố/Tỉnh */}
            <Grid item xs={12} md={4}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Thành Phố/Tỉnh
              </Typography>
              <Autocomplete
                value={selectedProvince}
                options={provinces}
                disabled
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Chọn Thành Phố/Tỉnh'
                    variant='outlined'
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LocationOnIcon color='success' />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f7faf5",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#a0d468",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Quận/Huyện */}
            <Grid item xs={12} md={4}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Quận/Huyện
              </Typography>
              <Autocomplete
                options={districts}
                value={selectedDistrict}
                onBlur={() => {
                  handleTouch("selectedDistrict");
                }}
                onChange={(_, v) => {
                  setSelectedDistrict(v);
                }}
                disabled={!selectedProvince}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Chọn Quận/Huyện'
                    variant='outlined'
                    error={
                      touched.selectedDistrict && !!errors.selectedDistrict
                    }
                    helperText={
                      touched.selectedDistrict ? errors.selectedDistrict : " "
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#a0d468",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}>
                      {option}
                      {selected && (
                        <CheckIcon sx={{ ml: "auto", color: "#7cb342" }} />
                      )}
                    </Box>
                  </li>
                )}
              />
            </Grid>

            {/* Phường/Xã */}
            <Grid item xs={12} md={4}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Phường/Xã/Thị trấn
              </Typography>
              <Autocomplete
                options={wards}
                value={selectedWard}
                onChange={(_, v) => setSelectedWard(v)}
                disabled={!selectedDistrict}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Chọn Phường/Xã'
                    variant='outlined'
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LocationOnIcon
                            fontSize='small'
                            sx={{ color: "text.secondary" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#a0d468",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}>
                      {option}
                      {selected && (
                        <CheckIcon sx={{ ml: "auto", color: "#7cb342" }} />
                      )}
                    </Box>
                  </li>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Bản đồ */}
      <Box
        sx={{
          height: { xs: 320, md: 480 },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          position: "relative",
          bgcolor: "#f8f9fa",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
        <LoadScript googleMapsApiKey='AIzaSyASJk1hzLv6Xoj0fRsYnfuO6ptOXu0fZsc'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onIdle={onIdle}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}></GoogleMap>
        </LoadScript>
      </Box>
    </Box>
  );
}
