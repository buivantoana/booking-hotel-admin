// ManagerBookingController.tsx
import React, { useEffect, useState } from "react";
import ManagerReviewView from "./ManagerReviewView";
import { getHotelReview, getHotels } from "../../service/hotel";
import { listBooking } from "../../service/booking";
import dayjs from "dayjs";

const ManagerReviewController = () => {
  
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs("2025-01-01T00:00:00"),
    checkOut: dayjs(),
  });

  // State cho booking và phân trang
  const [Reviews, setReviews] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);

  // State cho filter
  const [filters, setFilters] = useState({
    rate: "",
    hotel_name: "",
    content: "",
    user_name: "",
    disabled:false
  });

  // Lấy danh sách khách sạn

  // Format date đúng chuẩn ISO 8601 cho parser.isoparse()
  // KHÔNG encode + tại đây, để URLSearchParams tự xử lý
  const formatDateForAPI = (date: dayjs.Dayjs) => {
    if (!date) {
      return;
    }
    // Format: 2025-12-09T00:00:00+07:00 (ISO 8601 với timezone)
    return date.format("YYYY-MM-DDTHH:mm:ss+07:00");
  };

  // Hàm build query string thủ công để kiểm soát encoding
  const buildQueryString = (params: any) => {
    const parts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // QUAN TRỌNG: Giữ nguyên giá trị date, chỉ encode key
        const encodedKey = encodeURIComponent(key);
        // KHÔNG encode value ở đây vì chúng ta muốn giữ + và :
        parts.push(`${encodedKey}=${value}`);
      }
    });

    return parts.join("&");
  };

  // Gọi API lấy booking với filter
  const fetchReviews = async (
    page: number,
    filterParams = filters
  ) => {
  
    setLoading(true);
    try {
      let query: any = {
        page: page || pagination.page,
        limit: pagination.limit,
        
      };

      // Thêm các filter nếu có giá trị
      if (filterParams.rate) {
        query.rate = filterParams.rate;
      }
      if (filterParams.hotel_name) {
        query.hotel_name = filterParams.hotel_name;
      }

      if (filterParams.user_name ) {
        query.user_name = filterParams.user_name;
      }

      if (filterParams.hotel_name) {
        query.hotel_name = filterParams.hotel_name;
      }

      if (filterParams.content) {
        query.content = filterParams.content;
      }
    query.disabled = filterParams.disabled;
      

      // Debug chi tiết
      console.log("=== DEBUG FILTER PARAMS ===");
      
     
      // THỬ CẢ 2 CÁCH để tìm ra cách đúng

      // Cách 1: Dùng URLSearchParams (sẽ auto encode)
      const params1 = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params1.append(key, String(value));
        }
      });
      const queryString1 = params1.toString();
      console.log("Cách 1 (URLSearchParams):", queryString1);

      // Cách 2: Build thủ công
      const queryString2 = buildQueryString(query);
      console.log("Cách 2 (Manual build):", queryString1);

      // Chọn cách 2 (manual build) để kiểm soát tốt hơn
      const result = await getHotelReview( queryString1);

      setReviews(result.reviews || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
      
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn khách sạn mới
  useEffect(() => {
   
      // Set default date range filter khi load lần đầu
      const defaultFilters = {
        rate: "",
    hotel_name: "",
    content: "",
    user_name: "",
    disabled:false
      };
      console.log("Initial filters:", defaultFilters);
      setFilters(defaultFilters);
      fetchReviews( 1, defaultFilters);
   
  }, []);

  // Xử lý đổi trang
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
   
      fetchReviews( newPage);
    
  };

  // Xử lý filter thay đổi
  const handleFilterChange = (newFilters: any) => {
    console.log("Filter changed to:", newFilters);
    setFilters(newFilters);
   
      fetchReviews( 1, newFilters);
    
  };

  // Reset filter
  const handleResetFilter = () => {
    

    const resetFilters = {
      rate: "",
      hotel_name: "",
      content: "",
      user_name: "",
      disabled:false
    };

    console.log("Reset filters:", resetFilters);
    setFilters(resetFilters);
    fetchReviews(1, resetFilters);
    
  };

  // Xử lý khi dateRange thay đổi
 

  return (
    <ManagerReviewView
     
      Reviews={Reviews}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      fetchReviews={fetchReviews}
      dateRange={dateRange}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilter={handleResetFilter}
      formatDateForAPI={formatDateForAPI}
      
    />
  );
};

export default ManagerReviewController;
