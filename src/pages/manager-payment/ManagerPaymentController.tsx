// ManagerBookingController.tsx
import React, { useEffect, useState } from "react";
import ManagerPaymentView from "./ManagerPaymentView";
import { getHotels, listPayment } from "../../service/hotel";
import { listBooking } from "../../service/booking";
import dayjs from "dayjs";

const ManagerPaymentController = () => {
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs("2025-01-01T00:00:00"),
    checkOut: dayjs(),
  });

  // State cho booking và phân trang
  const [Payment, setPayment] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);

  // State cho filter
  const [filters, setFilters] = useState({
    booking_code: "",
    method: "all",
    status: "all",
    check_in_from: "",
    check_in_to: "",
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
  const fetchPayment = async (
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
      if (filterParams.booking_code) {
        query.booking_code = filterParams.booking_code;
      }

      if (filterParams.method && filterParams.method !== "all") {
        query.method = filterParams.method;
      }

      if (filterParams.status && filterParams.status !== "all") {
        query.status = filterParams.status;
      }

      if (filterParams.check_in_from) {
        query.start_time = filterParams.check_in_from;
      }

      if (filterParams.check_in_to) {
        query.end_time = filterParams.check_in_to;
      }

      // Debug chi tiết
      console.log("=== DEBUG FILTER PARAMS ===");
      console.log("Raw query params:", query);
      console.log("check_in_from value:", query.check_in_from);
      console.log("check_in_to value:", query.check_in_to);

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
      const result = await listPayment(queryString1);

      setPayment(result.payments || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setPayment([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn khách sạn mới
  useEffect(() => {

    const defaultFilters = {
      booking_code: "",
      method: "all",
      status: "all",
      check_in_from: formatDateForAPI(dateRange?.checkIn),
      check_in_to: formatDateForAPI(dateRange?.checkOut),
    };
    console.log("Initial filters:", defaultFilters);
    setFilters(defaultFilters);
    fetchPayment(1, defaultFilters);

  }, []);

  // Xử lý đổi trang
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {

    fetchPayment(newPage);

  };

  // Xử lý filter thay đổi
  const handleFilterChange = (newFilters: any) => {
    console.log("Filter changed to:", newFilters);
    setFilters(newFilters);

    fetchPayment(1, newFilters);

  };

  // Reset filter
  const handleResetFilter = () => {
    const resetDateRange = {
      checkIn: dayjs("2025-01-01T00:00:00"),
      checkOut: dayjs(),
    };

    const resetFilters = {
      booking_code: "",
      method: "all",
      status: "all",
      check_in_from: formatDateForAPI(dayjs("2025-01-01T00:00:00")),
      check_in_to: formatDateForAPI(dayjs()),
    };

    console.log("Reset filters:", resetFilters);
    setFilters(resetFilters);
    setDateRange(resetDateRange);


    fetchPayment(1, resetFilters);

  };

  // Xử lý khi dateRange thay đổi
  const handleDateRangeChange = (newDateRange: any) => {
    console.log("DateRange changed:", newDateRange);
    setDateRange(newDateRange);

    const updatedFilters = {
      ...filters,
      check_in_from: formatDateForAPI(newDateRange.checkIn),
      check_in_to: formatDateForAPI(newDateRange.checkOut),
    };

    console.log("Updated filters:", updatedFilters);
    setFilters(updatedFilters);

    // fetchPayment(1, updatedFilters);

  };

  return (
    <ManagerPaymentView
     
      Payment={Payment}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      fetchPayment={fetchPayment}
      dateRange={dateRange}
      setDateRange={handleDateRangeChange}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilter={handleResetFilter}
      formatDateForAPI={formatDateForAPI}
    />
  );
};

export default ManagerPaymentController;
