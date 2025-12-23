import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import add from "../../images/gallery-add.png";

export default function HotelImageUpload({
  hotelData,
  onNewImagesChange,
  isPadding = true,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");

  // Ảnh mới upload (File objects)
  const [newHotelImages, setNewHotelImages] = useState([]);
  const [newVerifyImages, setNewVerifyImages] = useState([]);

  // Ảnh cũ từ server (chỉ để hiển thị)
  const [existingHotelImages, setExistingHotelImages] = useState([]);
  const [existingVerifyImages, setExistingVerifyImages] = useState([]);

  useEffect(() => {
    if (hotelData) {
      if (hotelData.images) {
        try {
          const urls = JSON.parse(hotelData.images);
          setExistingHotelImages(
            urls.map((url) => ({ url, isExisting: true }))
          );
        } catch (e) {}
      }
      if (hotelData.verify_images) {
        try {
          const urls = JSON.parse(hotelData.verify_images);
          setExistingVerifyImages(
            urls.map((url) => ({ url, isExisting: true }))
          );
        } catch (e) {}
      }
    }
  }, [hotelData]);

  // Báo cho parent biết ảnh mới thay đổi
  useEffect(() => {
    onNewImagesChange?.({
      images: newHotelImages.map((img) => img.file),
      verify_images: newVerifyImages.map((img) => img.file),
    });
  }, [newHotelImages, newVerifyImages, onNewImagesChange]);

  const handleUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    const newImgs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setter((prev) => [...prev, ...newImgs]);
  };

  const handleDelete = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const UploadBox = ({ onSelect }) => (
    <label
      style={{
        border: "2px dashed #ccc",
        borderRadius: 12,
        width: 120,
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}>
      <input type='file' hidden multiple onChange={onSelect} />
      <img src={add} alt='add' />
    </label>
  );

  const ImagePreview = ({ img, index, setter }) => (
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}>
      <img
        src={img.url}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        alt='preview'
      />
      {/* Chỉ cho xóa ảnh mới */}
      {!img.isExisting && setter && (
        <IconButton
          size='small'
          onClick={() => handleDelete(index, setter)}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "rgba(0,0,0,0.5)",
            color: "white",
          }}>
          <DeleteIcon fontSize='small' />
        </IconButton>
      )}
    </Box>
  );

  const Section = ({
    title,
    desc,
    existing = [],
    newImgs = [],
    setNewImgs,
  }) => (
    <Box sx={{ mb: 4 }}>
      <Typography fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={2}>
        {desc}
      </Typography>

      <Grid container spacing={2}>
        {/* Ảnh cũ */}
        {existing.map((img, i) => (
          <Grid item key={`exist-${i}`}>
            <ImagePreview img={img} />
          </Grid>
        ))}

        {/* Ảnh mới */}
        {newImgs.map((img, i) => (
          <Grid item key={`new-${i}`}>
            <ImagePreview img={img} index={i} setter={setNewImgs} />
          </Grid>
        ))}

        {/* Nút upload */}
        <Grid item>
          <UploadBox onSelect={(e) => handleUpload(e, setNewImgs)} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box
      sx={{
        p: isPadding ? 0 : isMobile ? 2 : 4,
        background: "white",
        borderRadius: 2,
      }}>
      <Section
        title='Ảnh chụp biển hiệu khách sạn từ bên ngoài'
        desc='Tải lên ít nhất 1 ảnh rõ nét về mặt tiền hoặc biển hiệu khách sạn. Ảnh này chỉ dùng để kiểm duyệt, không hiển thị trên Hotel Booking.'
        existing={existingVerifyImages}
        newImgs={newVerifyImages}
        setNewImgs={setNewVerifyImages}
      />

      <Section
        title='Ảnh khách sạn'
        desc='Tải lên ít nhất 5 ảnh chụp từ nhiều góc độ khác nhau (sảnh, hành lang, khu vực chung, phòng, v.v.). Các ảnh này sẽ được hiển thị trên Hotel Booking.'
        existing={existingHotelImages}
        newImgs={newHotelImages}
        setNewImgs={setNewHotelImages}
      />
    </Box>
  );
}
