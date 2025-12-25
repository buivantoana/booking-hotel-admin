import React, { useEffect, useState } from "react";
import ManagerHotelView from "./ManagerHotelView";
import { getHotels } from "../../service/hotel";

type Props = {};

const ManagerHotelController = (props: Props) => {
  const [hotels,setHotels] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  useEffect(()=>{
    getDataHotels(1)
  },[])
  const getDataHotels =async (page) => {
    try {
      let query: any = {
        page: page || pagination.page,
        limit: pagination.limit
      };
      const params1 = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params1.append(key, String(value));
        }
      });
      const queryString1 = params1.toString();
      let result = await getHotels(queryString1);


      if(result?.hotels){
        setHotels(result?.hotels)
        setPagination({
          page: result.page || 1,
          limit: result.limit || 10,
          total: result.total || 0,
          total_pages: result.total_pages || 1,
        });
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
   
    getDataHotels( newPage);
    
  };
  return <ManagerHotelView hotels={hotels}  pagination={pagination}
  onPageChange={handlePageChange}
  getDataHotels={getDataHotels} />;
};

export default ManagerHotelController;
