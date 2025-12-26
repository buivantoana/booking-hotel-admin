import React, { useEffect, useState } from "react";
import ApprovalView from "./ApprovalView";
import { getHotels, getRooms } from "../../service/hotel";

type Props = {};

const ApprovalController = (props: Props) => {
  const [hotels,setHotels] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [rooms,setRooms] = useState([])
  const [paginationRooms, setPaginationRooms] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  useEffect(()=>{
    getDataHotels(1)
    getDataRooms(1)
  },[])
  const getDataHotels =async (page) => {
    try {
      let query: any = {
        page: page || pagination.page,
        limit: pagination.limit,
        status:"pending"
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
  const getDataRooms =async (page) => {
    try {
      let query: any = {
        page: page || pagination.page,
        limit: pagination.limit,
        status:"pending"
      };
      const params1 = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params1.append(key, String(value));
        }
      });
      const queryString1 = params1.toString();
      let result = await getRooms(queryString1);


      if(result?.room_types){
        setRooms(result?.room_types)
        setPaginationRooms({
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
  const handlePageChangeRooms = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
   
    getDataRooms( newPage);
    
  };
  return <ApprovalView hotels={hotels}
  pagination={pagination}
  onPageChange={handlePageChange}
  paginationRooms={paginationRooms}
  onPageChangeRooms={handlePageChangeRooms}
  rooms={rooms}
  getDataRooms={getDataRooms}
  getDataHotels={getDataHotels} />;
};

export default ApprovalController;
