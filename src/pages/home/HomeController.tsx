import React, { useEffect, useState } from "react";
import HomeView from "./HomeView";
import dayjs from "dayjs";
import {
  getEventMonth,
  getGeneralStats,
  getGeneralWeek,
  getGeneralWeekRoomType,
  getHotels,
  getReviewstats,
} from "../../service/hotel";

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
  const [roomTypeGeneral, setRoomTypeGeneral] = useState("all");
  const [roomTypeBooking, setRoomTypeBooking] = useState("all");
  const [roomTypeCheckin, setRoomTypeCheckin] = useState("all");
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
    getGeneral();
  }, [dateRange]);
  useEffect(() => {
    getGeneralMethod();
  }, [dateRangeRevenueMethod]);
  useEffect(() => {
    getGeneralRoomTypeWeek();
  }, [roomTypeGeneral]);
  useEffect(() => {
    getEnventVisitMonth();
  }, [dateRangeRevenueEvent]);
  useEffect(() => {
    getEnventViewMonth();
  }, [dateRangeRevenueEventView]);
  useEffect(() => {
    getGeneralRoomTypeBooking();
  }, [roomTypeBooking]);
  useEffect(() => {
    getGeneralRoomTypeCheckin();
  }, [roomTypeCheckin]);
  const formatDateForAPI = (date: dayjs.Dayjs) => {
    if (!date) {
      return;
    }
    // Format: 2025-12-09T00:00:00+07:00 (ISO 8601 với timezone)
    return date.format("YYYY-MM-DDTHH:mm:ss+07:00");
  };

  // Hàm build query string thủ công để kiểm soát encoding

  const getGeneral = async () => {
    try {
      let params = {
        start_time: dateRange.checkIn
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),

        end_time: dateRange.checkOut
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
      };

      let result = await getGeneralStats(params);
      if (result?.hourly) {
        setDataGeneral(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralMethod = async () => {
    try {
      let params = {
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
      };

      let result = await getGeneralWeek(params);
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
        end: [],
      };
      const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      const startOfThisWeek = dayjs()
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // =========================
      // TUẦN TRƯỚC: trừ tiếp 7 ngày
      // =========================
      const endOfLastWeek = startOfThisWeek
        .subtract(1, "day")
        .hour(23)
        .minute(59)
        .second(59);

      const startOfLastWeek = endOfLastWeek
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // ===== params TUẦN TRƯỚC =====
      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
      });

      // ===== params TUẦN NÀY =====
      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
      });

      let result_start = await getGeneralWeekRoomType(params_start);
      if (result_start?.revenue_by_day) {
        result.start = result_start?.revenue_by_day;
      }
      let result_end = await getGeneralWeekRoomType(params_end);
      if (result_end?.revenue_by_day) {
        result.end = result_end?.revenue_by_day;
      }
      setDataGeneralRoomType(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeneralRoomTypeBooking = async () => {
    try {
      let result = {
        start: [],
        end: [],
      };
      const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      const startOfThisWeek = dayjs()
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // =========================
      // TUẦN TRƯỚC: trừ tiếp 7 ngày
      // =========================
      const endOfLastWeek = startOfThisWeek
        .subtract(1, "day")
        .hour(23)
        .minute(59)
        .second(59);

      const startOfLastWeek = endOfLastWeek
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // ===== params TUẦN TRƯỚC =====
      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "booked",
      });

      // ===== params TUẦN NÀY =====
      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "booked",
      });

      let result_start = await getEventMonth(params_start);
      if (result_start?.daily) {
        result.start = result_start?.daily;
      }
      let result_end = await getEventMonth(params_end);
      if (result_end?.daily) {
        result.end = result_end?.daily;
      }
      setDataEventBooked(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralRoomTypeCheckin = async () => {
    try {
      let result = {
        start: [],
        end: [],
      };
      const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

      const startOfThisWeek = dayjs()
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // =========================
      // TUẦN TRƯỚC: trừ tiếp 7 ngày
      // =========================
      const endOfLastWeek = startOfThisWeek
        .subtract(1, "day")
        .hour(23)
        .minute(59)
        .second(59);

      const startOfLastWeek = endOfLastWeek
        .subtract(6, "day")
        .hour(0)
        .minute(0)
        .second(0);

      // ===== params TUẦN TRƯỚC =====
      let params_start = new URLSearchParams({
        start_time: startOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfLastWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "checked_in",
      });

      // ===== params TUẦN NÀY =====
      let params_end = new URLSearchParams({
        start_time: startOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endOfThisWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        rent_type: roomTypeCheckin,
        event_type: "checked_in",
      });

      let result_start = await getEventMonth(params_start);
      if (result_start?.daily) {
        result.start = result_start?.daily;
      }
      let result_end = await getEventMonth(params_end);
      if (result_end?.daily) {
        result.end = result_end?.daily;
      }
      setDataEventCheckin(result);
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

      const params_start = {
        start_time: startPrev.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      };

      const params_end = {
        start_time: startCurrent.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      };

      const result_start = await getEventMonth(params_start);
      if (result_start?.daily) result.start = result_start.daily;

      const result_end = await getEventMonth(params_end);
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

      const params_start = {
        start_time: startPrev.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "view",
      };

      const params_end = {
        start_time: startCurrent.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "view",
      };

      const result_start = await getEventMonth(params_start);
      if (result_start?.daily) result.start = result_start.daily;

      const result_end = await getEventMonth(params_end);
      if (result_end?.daily) result.end = result_end.daily;

      setDataEventView(result);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getDataReview();
  // }, []);

  // const getDataReview = async () => {
  //   try {
  //     let result = await getReviewstats(idHotel);
  //     if (Object.keys(result)?.length > 0) {
  //       setDataReview(result);
  //     }
  //     console.log("AAAA result review", result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  console.log("AAAA dateRangeRevenueMethod", dateRangeRevenueMethod);
  console.log("AAA dataGeneralMethod", dataGeneralMethod);
  console.log("AAA dataGeneralRoomType", dataGeneralRoomType);
  console.log("AAA dataEventVisit", dataEventVisit);
  console.log("AAA dataEventBooked", dataEventBooked);
  console.log("AAA dataEventCheckin", dataEventCheckin);
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
