import React, { useEffect, useState } from "react";
import ReconciliationView from "./ReconciliationView";
import { getHotels, getMySettlements } from "../../service/hotel";

type Props = {};

const ReconciliationController = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [dataSettlement, setDataSettlement] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [idHotel, setIdHotel] = useState(null);
  const [filters, setFilters] = useState({
    hotel_name: "",
    period_month: "",
    status: "all", // "" = all, or 'draft', 'pending', 'confirmed', 'paid'
  });
  useEffect(() => {
    fetchSettlements(1); // Reset về trang 1 khi đổi khách sạn
  }, []);

  const fetchSettlements = async (page: number = 1, filterParams = filters) => {
    setLoading(true);
    try {
      let query: any = {
        page,
        limit: pagination.limit,
      };

      if (filterParams.hotel_name) {
        query.hotel_name = filterParams.hotel_name;
      }
      if (filterParams.period_month) {
        query.period_month = filterParams.period_month;
      }
      if (filterParams.status&& filterParams.status !== "all") {
        query.status = filterParams.status;
      }

      const queryString = new URLSearchParams(query).toString();
      const result = await getMySettlements(queryString);

      setDataSettlement(result.settlements || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách settlements:", error);
      setDataSettlement([]);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchSettlements(newPage);
  };
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchSettlements(1, newFilters);
  };

  const handleResetFilter = () => {
    const resetFilters = { hotel_name: "", period_month: "", status: "draft" };
    setFilters(resetFilters);
    fetchSettlements(1, resetFilters);
  };
  return (
    <ReconciliationView
      dataSettlement={dataSettlement}
      pagination={pagination}
      loading={loading}
      settlement={settlement}
      setSettlement={setSettlement}
      onPageChange={handlePageChange}
      fetchSettlements={fetchSettlements}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilter={handleResetFilter}
    />
  );
};

export default ReconciliationController;
