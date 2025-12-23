import React from "react";
import CreateHotelView from "./CreateHotelView";
import { createHotel, createRoomHotel } from "../../service/hotel";

type Props = {};

const CreateHotelController = (props: Props) => {
  // src/utils/submitCreateHotel.ts

  const submitCreateHotel = async (contextData: any) => {
    if (!contextData) return;

    const {
      hotelName,
      phone,
      description = "",
      businessType,
      hourlyStart,
      hourlyEnd,
      overnightStart,
      overnightEnd,
      dailyStart,
      dailyEnd,
      outsideImages = [],
      hotelImages = [],
      selectedProvince,
      selectedDistrict,
      selectedWard,
      address,
      center,
      roomTypes = [],
    } = contextData;

    console.log("AAAA contextData ", contextData);
    // ================== 1. TẠO KHÁCH SẠN (hotel.create) ==================
    const hotelFormData = new FormData();
    hotelFormData.append("name", JSON.stringify({ vi: hotelName }) || "");
    hotelFormData.append("phone", phone || "");
    hotelFormData.append("description", JSON.stringify({ vi: description }));
    hotelFormData.append("city", selectedProvince || "");
    hotelFormData.append("address", JSON.stringify({ vi: address }) || "");
    hotelFormData.append("lat", center?.lat?.toString() || "");
    hotelFormData.append("lng", center?.lng?.toString() || "");

    // rent_types: format đúng như backend yêu cầu
    const rentTypesObj: any = {};

    if (dailyStart && dailyEnd) {
      rentTypesObj.daily = {
        from: dailyStart,
        to: dailyEnd,
      };
    }
    if (overnightStart && overnightEnd) {
      rentTypesObj.overnight = {
        from: overnightStart,
        to: overnightEnd,
      };
    }
    if (hourlyStart && hourlyEnd) {
      rentTypesObj.hourly = {
        from: hourlyStart,
        to: hourlyEnd,
      };
    }

    // Nếu có ít nhất 1 loại
    if (Object.keys(rentTypesObj).length > 0) {
      hotelFormData.append("rent_types", JSON.stringify(rentTypesObj));
    }
    // images: ảnh khách sạn (hiển thị)
    hotelImages.forEach((img: any) => {
      if (img.file) hotelFormData.append("verify_images", img.file);
    });

    // verify_images: ảnh biển hiệu bên ngoài (dùng duyệt)
    outsideImages.forEach((img: any) => {
      if (img.file) hotelFormData.append("images", img.file);
    });

    // Gọi API tạo khách sạn
    const hotelResponse = await createHotel(hotelFormData);

    if (!hotelResponse?.hotel_id) throw new Error("Tạo khách sạn thất bại");
    const hotelId = hotelResponse?.hotel_id;

    if (!hotelId) throw new Error("Không lấy được ID khách sạn");

    console.log("Tạo khách sạn thành công:", hotelId);

    // ================== 2. TẠO TỪNG LOẠI PHÒNG (hotel_roomtype_create) ==================
    for (const room of roomTypes) {
      const roomForm = new FormData();

      // Các trường bắt buộc phải là JSON string có key "vi"
      roomForm.append(
        "name",
        JSON.stringify({ vi: room.name || "Phòng tiêu chuẩn" })
      );
      roomForm.append(
        "description",
        JSON.stringify({ vi: room.description || "" })
      );

      // facilities: gom các thông tin lại thành object JSON
      const facilities = {
        bed: room.bedType || "",
        area: `${room.area || 0}m²`,
        max_guests: "2", // bạn có thể thêm field maxGuests vào form nếu muốn
        direction: room.direction || "",
      };
      roomForm.append("facilities", JSON.stringify(facilities));

      // Giá tiền
      roomForm.append(
        "price_hourly",
        room.pricing.hourly.enabled && room.pricing.hourly.firstHours
          ? room.pricing.hourly.firstHours
          : "0"
      );
      roomForm.append(
        "price_hourly_increment",
        room.pricing.hourly.enabled && room.pricing.hourly.extraHour
          ? room.pricing.hourly.extraHour
          : "0"
      );
      roomForm.append(
        "price_overnight",
        room.pricing.overnight.enabled && room.pricing.overnight.price
          ? room.pricing.overnight.price
          : "0"
      );
      roomForm.append(
        "price_daily",
        room.pricing.daily.enabled && room.pricing.daily.price
          ? room.pricing.daily.price
          : "0"
      );

      roomForm.append("currency", "VND");
      roomForm.append("number", room.quantity || "1");

      // Các field còn lại cũng phải JSON string có "vi"
      roomForm.append("bed_type", JSON.stringify({ vi: room.bedType || "" }));
      roomForm.append(
        "direction",
        JSON.stringify({ vi: room.direction || "" })
      );
      roomForm.append("area_m2", room.area || "0");
      roomForm.append("max_guests", "2");

      // Ảnh phòng (ít nhất 3 ảnh như bạn yêu cầu validate)
      room.images?.forEach((file: any) => {
        if (file instanceof File) {
          roomForm.append("images", file);
        }
      });
      // Gọi API tạo loại phòng
      const roomResponse = await createRoomHotel(hotelId, roomForm);

      if (!roomResponse.room_type_id) {
        throw new Error("Tạo phòng thất bại");
        // Có thể continue hoặc throw tùy bạn muốn
      }
    }

    return { success: true, hotelId };
  };
  return <CreateHotelView submitCreateHotel={submitCreateHotel} />;
};

export default CreateHotelController;
