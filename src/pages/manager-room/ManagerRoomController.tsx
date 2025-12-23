import React, { useEffect, useState } from "react";
import ManagerRoomView from "./ManagerRoomView";
import dayjs from "dayjs";
import {
  getHotels,
  getInventoryHotelDaily,
  getInventoryHotelHourly,
  getInventoryHotelOvernight,
} from "../../service/hotel";
import { formatDateWithTimezone } from "../../utils/utils";

type Props = {};

const ManagerRoomController = (props: Props) => {
  const [active, setActive] = useState("hourly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs(),
    checkOut: dayjs().add(1, "day"),
  });

  useEffect(() => {
    if(idHotel){
      getData();

    }
  }, [dateRange,active,idHotel]);
  const getData = async () => {
    setLoading(true);
    try {
      let result;
      let params = new URLSearchParams({
        start_time: dateRange.checkIn.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRange.checkOut.format("YYYY-MM-DDTHH:mm:ssZ"),
      });

      if (active == "hourly") {
        result = await getInventoryHotelHourly(idHotel, params);
      }
      if (active == "daily") {
        result = await getInventoryHotelDaily(idHotel, params);
      }
      if (active == "overnight") {
        result = await getInventoryHotelOvernight(idHotel, params);
      }
      setData(result);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getListHotel()
  }, [])
  const getListHotel = async () => {
    try {
      let result = await getHotels();
      if (result?.hotels) {
        setIdHotel(localStorage.getItem("hotel_id") ? result?.hotels.some((item)=>item.id == localStorage.getItem("hotel_id"))?localStorage.getItem("hotel_id"): result?.hotels[0]?.id:  result?.hotels[0]?.id)
        setHotels(result?.hotels)
      }
    } catch (error) {

    }
  }
  console.log("AAAA data",data)
  return (
    <ManagerRoomView
      setActive={setActive}
      active={active}
      dateRange={dateRange}
      setDateRange={setDateRange}
      loading={loading}
      data={data}
      hotels={hotels}
      idHotel={idHotel}
      setIdHotel={setIdHotel}
      setData={setData}
    />
  );
};

export default ManagerRoomController;
