// ManagerBookingController.tsx
import React, { useEffect, useState } from "react";
import ManagerAttributeView from "./ManagerAttributeView";
import { getAttribute, getHotelReview, getHotels } from "../../service/hotel";
import { listBooking } from "../../service/booking";
import dayjs from "dayjs";
import { getAccounts, getStaffs } from "../../service/account";

const ManagerAttributeController = () => {
  const [attribute, setAttribute] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  
  const fetchAttribute = async () => {
    setLoading(true);
    try {
      const result = await getAttribute();

      setAttribute(result);
    
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setAttribute([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn khách sạn mới
  useEffect(() => {
    fetchAttribute();
  }, []);


  // Xử lý khi dateRange thay đổi

  return (
    <ManagerAttributeView
    attribute={attribute}
      loading={loading}
      fetchAttribute={fetchAttribute}
    />
  );
};

export default ManagerAttributeController;
