import React, { useEffect, useState } from "react";
import HomeView from "./HomeView";
import dayjs from "dayjs";
import { getEventMonth, getGeneralStats, getGeneralWeek, getGeneralWeekRoomType, getHotels, getReviewstats } from "../../service/hotel";

type Props = {};

const HomeController = (props: Props) => {
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs(),
    checkOut: dayjs().add(1, "day"),
  });
  const [dateRangeRevenueMethod, setDateRangeRevenueMethod] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });
  const [dateRangeRevenueEvent, setDateRangeRevenueEvent] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });
  const [dateRangeRevenueEventView, setDateRangeRevenueEventView] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });
  const [roomTypeGeneral, setRoomTypeGeneral] = useState('all');
  const [roomTypeBooking, setRoomTypeBooking] = useState('all');
  const [roomTypeCheckin, setRoomTypeCheckin] = useState('all');
  const [dataGeneral, setDataGeneral] = useState({});
  const [dataGeneralMethod, setDataGeneralMethod] = useState([]);
  const [dataGeneralRoomType, setDataGeneralRoomType] = useState({});
  const [dataEventVisit, setDataEventVisit] = useState({});
  const [dataEventView, setDataEventView] = useState({});
  const [dataEventBooked, setDataEventBooked] = useState({});
  const [dataEventCheckin, setDataEventCheckin] = useState({});
  const [dataReview, setDataReview] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  
  useEffect(() => {
    if (idHotel)
      getGeneral();
  }, [dateRange, idHotel]);
  useEffect(() => {
    if (idHotel)
      getGeneralMethod();
  }, [dateRangeRevenueMethod, idHotel]);
  useEffect(() => {
    if (idHotel)
      getGeneralRoomTypeWeek();
  }, [roomTypeGeneral, idHotel]);
  useEffect(() => {
    if (idHotel)
      getEnventVisitMonth();
  }, [dateRangeRevenueEvent, idHotel]);
  useEffect(() => {
    if (idHotel)
      getEnventViewMonth();
  }, [dateRangeRevenueEventView, idHotel]);
  useEffect(() => {
    if (idHotel)
      getGeneralRoomTypeBooking();
  }, [roomTypeBooking, idHotel]);
  useEffect(() => {
    if (idHotel)
      getGeneralRoomTypeCheckin();
  }, [roomTypeCheckin, idHotel]);
  const getGeneral = async () => {
    try {
      let params = new URLSearchParams({
        start_time: dateRange.checkIn
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRange.checkOut
          .hour(23)
          .minute(59)
          .second(59)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        room_type_id: "lD49C0cWJAUw",
      });

      let result = await getGeneralStats(idHotel, params);
      if (result?.hourly) {
        setDataGeneral(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralMethod = async () => {
    try {
      let params = new URLSearchParams({
        start_time: dateRangeRevenueMethod.checkIn
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRangeRevenueMethod.checkOut
          .hour(23)
          .minute(59)
          .second(59)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: "all",
      });

      let result = await getGeneralWeek(idHotel, params);
      if (result?.revenue_by_method) {
        setDataGeneralMethod(result?.revenue_by_method);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralRoomTypeWeek = async () => {
    try {
      let result = {
        start: [],
        end: []
      }
      const startOfLastWeek = dayjs().subtract(1, 'week').startOf('isoWeek'); // Thứ 2 tuần trước
      const endOfLastWeek = dayjs().subtract(1, 'week').endOf('isoWeek');     // Chủ nhật tuần trước

      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeGeneral,
      });

      // === TUẦN NÀY ===
      const startOfThisWeek = dayjs().startOf('isoWeek'); // Thứ 2 tuần này
      const endOfThisWeek = dayjs().endOf('isoWeek');     // Chủ nhật tuần này
      // Nếu muốn chỉ lấy đến ngày hiện tại (thay vì cả chủ nhật tương lai), dùng dòng dưới:
      // const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeGeneral,
      });

      let result_start = await getGeneralWeekRoomType(idHotel, params_start);
      if (result_start?.revenue_by_day) {
        result.start = (result_start?.revenue_by_day);
      }
      let result_end = await getGeneralWeekRoomType(idHotel, params_end);
      if (result_end?.revenue_by_day) {
        result.end = result_end?.revenue_by_day;
      }
      setDataGeneralRoomType(result)
    } catch (error) {
      console.log(error);
    }
  };

  const getGeneralRoomTypeBooking = async () => {
    try {
      let result = {
        start: [],
        end: []
      }
      const startOfLastWeek = dayjs().subtract(1, 'week').startOf('isoWeek'); // Thứ 2 tuần trước
      const endOfLastWeek = dayjs().subtract(1, 'week').endOf('isoWeek');     // Chủ nhật tuần trước

      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeBooking,
        event_type: "booked"
      });

      // === TUẦN NÀY ===
      const startOfThisWeek = dayjs().startOf('isoWeek'); // Thứ 2 tuần này
      const endOfThisWeek = dayjs().endOf('isoWeek');     // Chủ nhật tuần này
      // Nếu muốn chỉ lấy đến ngày hiện tại (thay vì cả chủ nhật tương lai), dùng dòng dưới:
      // const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeBooking,
        event_type: "booked"
      });

      let result_start = await getEventMonth(idHotel, params_start);
      if (result_start?.revenue_by_day) {
        result.start = (result_start?.revenue_by_day);
      }
      let result_end = await getEventMonth(idHotel, params_end);
      if (result_end?.revenue_by_day) {
        result.end = result_end?.revenue_by_day;
      }
      setDataEventBooked(result)
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralRoomTypeCheckin = async () => {
    try {
      let result = {
        start: [],
        end: []
      }
      const startOfLastWeek = dayjs().subtract(1, 'week').startOf('isoWeek'); // Thứ 2 tuần trước
      const endOfLastWeek = dayjs().subtract(1, 'week').endOf('isoWeek');     // Chủ nhật tuần trước

      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "checked_in"
      });

      // === TUẦN NÀY ===
      const startOfThisWeek = dayjs().startOf('isoWeek'); // Thứ 2 tuần này
      const endOfThisWeek = dayjs().endOf('isoWeek');     // Chủ nhật tuần này
      // Nếu muốn chỉ lấy đến ngày hiện tại (thay vì cả chủ nhật tương lai), dùng dòng dưới:
      // const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "checked_in"
      });

      let result_start = await getEventMonth(idHotel, params_start);
      if (result_start?.revenue_by_day) {
        result.start = (result_start?.revenue_by_day);
      }
      let result_end = await getEventMonth(idHotel, params_end);
      if (result_end?.revenue_by_day) {
        result.end = result_end?.revenue_by_day;
      }
      setDataEventCheckin(result)
    } catch (error) {
      console.log(error);
    }
  };
  const getEnventVisitMonth = async () => {
    try {
      let result = { start: [], end: [] };

      const { mode, checkIn, checkOut } = dateRangeRevenueEvent;

      let startPrev, endPrev, startCurrent, endCurrent;

      if (mode === "week") {
        startCurrent = checkIn.startOf("isoWeek");
        endCurrent = checkOut.endOf("isoWeek");

        startPrev = startCurrent.subtract(1, "week");
        endPrev = endCurrent.subtract(1, "week");
      }

      if (mode === "month") {
        startCurrent = checkIn.startOf("month");
        endCurrent = checkOut.endOf("month");

        startPrev = startCurrent.subtract(1, "month");
        endPrev = endCurrent.subtract(1, "month");
      }

      const params_start = new URLSearchParams({
        start_time: startPrev.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });

      const params_end = new URLSearchParams({
        start_time: startCurrent.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });

      const result_start = await getEventMonth(idHotel, params_start);
      if (result_start?.daily) result.start = result_start.daily;

      const result_end = await getEventMonth(idHotel, params_end);
      if (result_end?.daily) result.end = result_end.daily;

      setDataEventVisit(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getEnventViewMonth = async () => {
    try {
      let result = { start: [], end: [] };

      const { mode, checkIn, checkOut } = dateRangeRevenueEventView;

      let startPrev, endPrev, startCurrent, endCurrent;

      if (mode === "week") {
        startCurrent = checkIn.startOf("isoWeek");
        endCurrent = checkOut.endOf("isoWeek");

        startPrev = startCurrent.subtract(1, "week");
        endPrev = endCurrent.subtract(1, "week");
      }

      if (mode === "month") {
        startCurrent = checkIn.startOf("month");
        endCurrent = checkOut.endOf("month");

        startPrev = startCurrent.subtract(1, "month");
        endPrev = endCurrent.subtract(1, "month");
      }

      const params_start = new URLSearchParams({
        start_time: startPrev.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "view",
      });

      const params_end = new URLSearchParams({
        start_time: startCurrent.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "view",
      });

      const result_start = await getEventMonth(idHotel, params_start);
      if (result_start?.daily) result.start = result_start.daily;

      const result_end = await getEventMonth(idHotel, params_end);
      if (result_end?.daily) result.end = result_end.daily;

      setDataEventView(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (idHotel)
      getDataReview()
  }, [idHotel])
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
  const getDataReview = async () => {
    try {
      let result = await getReviewstats(idHotel);
      if (Object.keys(result)?.length > 0) {
        setDataReview(result);
      }
      console.log("AAAA result review", result)


    } catch (error) {
      console.log(error);
    }
  };

  console.log("AAAA dateRangeRevenueMethod", dateRangeRevenueMethod)
  console.log("AAA dataGeneralMethod", dataGeneralMethod)
  console.log("AAA dataGeneralRoomType", dataGeneralRoomType)
  console.log("AAA dataEventVisit", dataEventVisit)
  return (
    <HomeView
      setDateRange={setDateRange}
      dataGeneral={dataGeneral}
      dateRange={dateRange}
      setDateRangeRevenueMethod={setDateRangeRevenueMethod}
      dateRangeRevenueMethod={dateRangeRevenueMethod}
      dataGeneralMethod={dataGeneralMethod}
      setRoomTypeGeneral={setRoomTypeGeneral}
      roomTypeGeneral={roomTypeGeneral}
      setRoomTypeBooking={setRoomTypeBooking}
      roomTypeBooking={roomTypeBooking}
      setRoomTypeCheckin={setRoomTypeCheckin}
      roomTypeCheckin={roomTypeCheckin}
      dataGeneralRoomType={dataGeneralRoomType}
      setDateRangeRevenueEvent={setDateRangeRevenueEvent}
      dateRangeRevenueEvent={dateRangeRevenueEvent}
      setDateRangeRevenueEventView={setDateRangeRevenueEventView}
      dateRangeRevenueEventView={dateRangeRevenueEventView}
      dataEventView={dataEventView}
      dataEventVisit={dataEventVisit}
      dataEventBooked={dataEventBooked}
      dataEventCheckin={dataEventCheckin}
      dataReview={dataReview}
      hotels={hotels}
      idHotel={idHotel}
      setIdHotel={setIdHotel}

    />
  );
};

export default HomeController;
