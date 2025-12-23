import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import HotelImageUpload from "./HotelImageUpload";
import { ArrowBackIos } from "@mui/icons-material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotel, updateHotel } from "../../service/hotel";
import { toast } from "react-toastify";

export default function HotelEditFormExact({ setAction, setRoom }) {
  const [center, setCenter] = useState({ lat: 21.0285, lng: 105.8542 });
  const mapRef = useRef(null);
  const [hotel, setHotel] = useState(null); // dữ liệu hotel đã parse
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const containerStyle = { width: "100%", height: "50vh" };

  // State cho các field (controlled)
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    city: "hanoi",
    cooperation_type: "listing",
    rent_types: {
      daily: { from: "14:00", to: "12:00" },
      overnight: { from: "21:00", to: "08:00" },
    },
  });

  // Ref để lưu ảnh mới upload (được HotelImageUpload cập nhật)
  const newImagesRef = useRef({ images: [], verify_images: [] });

  useEffect(() => {
    if (searchParams.get("id")) {
      (async () => {
        try {
          const result = await getHotel(searchParams.get("id"));
          if (result?.id) {
            setHotel(result);

            // Parse các trường JSON string
            const parsedName = JSON.parse(result.name || '{"vi":""}').vi || "";
            const parsedAddress =
              JSON.parse(result.address || '{"vi":""}').vi || "";
            const parsedDesc =
              JSON.parse(result.description || '{"vi":""}').vi || "";
            const parsedRentTypes = result.rent_types
              ? JSON.parse(result.rent_types)
              : {};

            setFormValues({
              name: parsedName,
              phone: result.phone || "",
              address: parsedAddress,
              description: parsedDesc,
              city: result.city || "hanoi",
              cooperation_type: result.cooperation_type || "listing",
              rent_types: parsedRentTypes,
            });

            // Cập nhật center bản đồ
            setCenter({
              lat: result.latitude || 21.0285,
              lng: result.longitude || 105.8542,
            });
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [searchParams]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onIdle = () => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    if (
      Math.abs(center.lat - lat) < 0.000001 &&
      Math.abs(center.lng - lng) < 0.000001
    )
      return;

    setCenter({ lat, lng });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!hotel) return;

    const formData = new FormData();

    // Các field text
    formData.append("name", JSON.stringify({ vi: formValues.name }));
    formData.append("address", JSON.stringify({ vi: formValues.address }));
    formData.append(
      "description",
      JSON.stringify({ vi: formValues.description })
    );
    formData.append("city", formValues.city);
    formData.append("phone", formValues.phone);
    formData.append("lat", center.lat);
    formData.append("lng", center.lng);
    formData.append("rent_types", JSON.stringify(formValues.rent_types));

    // Chỉ append ảnh mới upload
    newImagesRef.current.images.forEach((file) => {
      formData.append("images", file);
    });
    newImagesRef.current.verify_images.forEach((file) => {
      formData.append("verify_images", file);
    });

    // Gửi request (ví dụ)
    try {
      const response = await updateHotel(searchParams.get("id"), formData);
      console.log("Update success", response);
      if (response?.hotel_id) {
        toast.success(response?.message);
        setAction("edit_detail");
      } else {
        toast.success(response?.message);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <ArrowBackIos
          sx={{
            fontSize: 20,
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "#333" },
          }}
          onClick={() => setAction("edit_detail")}
        />
        <Typography fontSize={22} fontWeight={700} color='#222'>
          Cập nhật thông tin
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #eee",
          overflow: "hidden",
          bgcolor: "#fff",
        }}>
        <Box sx={{ p: { xs: 3, sm: 4, md: 3 } }}>
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            {/* Cột trái */}
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Thông tin khách sạn</Typography>
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3.5}>
                {/* Tên khách sạn */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Tên khách sạn
                  </Typography>
                  <TextField
                    fullWidth
                    value={formValues.name}
                    onChange={(e) =>
                      setFormValues({ ...formValues, name: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Điện thoại */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Điện thoại
                  </Typography>
                  <TextField
                    fullWidth
                    value={formValues.phone}
                    onChange={(e) =>
                      setFormValues({ ...formValues, phone: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Tình trạng hợp tác */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Tình trạng hợp tác
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formValues.cooperation_type}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          cooperation_type: e.target.value,
                        })
                      }
                      sx={{
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      }}>
                      <MenuItem value='listing'>Listing</MenuItem>
                      <MenuItem value='contract'>Contract</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Bản đồ */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Vị trí
                  </Typography>
                  <Box
                    sx={{
                      height: 280,
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
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
                        }}
                      />
                    </LoadScript>
                  </Box>
                </Box>

                {/* Địa chỉ */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Địa chỉ
                  </Typography>
                  <TextField
                    fullWidth
                    value={formValues.address}
                    onChange={(e) =>
                      setFormValues({ ...formValues, address: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Quận + Thành phố (giả sử chỉ có city) */}
                <Grid container justifyContent={"space-between"}>
                  <Grid item xs={5.8}>
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      color='#333'
                      mb={1.2}>
                      Tỉnh/Thành phố
                    </Typography>
                    <TextField
                      fullWidth
                      value={
                        formValues.city === "hanoi" ? "Hà Nội" : formValues.city
                      }
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: "12px",
                          bgcolor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Mô tả */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1}>
                    Mô tả khách sạn
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={formValues.description}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        description: e.target.value,
                      })
                    }
                    placeholder='Nhập mô tả về khách sạn của bạn'
                    variant='outlined'
                    inputProps={{ maxLength: 3000 }}
                    helperText={`${formValues.description.length}/3000`}
                    FormHelperTextProps={{
                      sx: { textAlign: "right", marginRight: 2, color: "#999" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                        "& textarea": { lineHeight: 1.6 },
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Phần hình ảnh */}
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Hình ảnh</Typography>
              <Typography color='#5D6679'>
                Thiết lập các thông tin cơ bản của phòng
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <HotelImageUpload
                hotelData={hotel}
                onNewImagesChange={(newImages) => {
                  newImagesRef.current = newImages; // lưu ảnh mới để submit
                }}
              />
            </Grid>
          </Grid>

          <Box display={"flex"} justifyContent={"end"} gap={2} mt={4}>
            <Button
              sx={{
                background: "#F0F1F3",
                borderRadius: "30px",
                color: "black",
                padding: 1,
                px: 2,
              }}>
              Trở về
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: "#98B720",
                color: "white",
                borderRadius: "30px",
                padding: 1,
                px: 2,
              }}>
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                  Cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
