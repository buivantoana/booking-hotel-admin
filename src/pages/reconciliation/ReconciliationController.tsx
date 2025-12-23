import React, { useEffect, useState } from "react";
import ReconciliationView from "./ReconciliationView";
import { getHotels, getMySettlements } from "../../service/hotel";

type Props = {};

const ReconciliationController = (props: Props) => {
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

  useEffect(() => {
    fetchSettlements(1); // Reset về trang 1 khi đổi khách sạn
  }, []);

  const fetchSettlements = async (page: number = 1) => {
    try {
      const query = new URLSearchParams({ ...pagination, page }).toString();
      const result = await getMySettlements(query);
      // Giả sử API trả về cấu trúc như mẫu bạn cung cấp
      setDataSettlement(result.settlements || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setDataSettlement([]);
    } finally {
    }
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchSettlements(newPage);
  };

  return (
    <ReconciliationView
      hotels={hotels}
      idHotel={idHotel}
      dataSettlement={dataSettlement}
      pagination={pagination}
      setSettlement={setSettlement}
      settlement={settlement}
      onPageChange={handlePageChange}
      fetchSettlements={fetchSettlements}
      setIdHotel={setIdHotel}
    />
  );
};

export default ReconciliationController;
