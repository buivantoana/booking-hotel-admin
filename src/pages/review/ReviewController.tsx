import React, { useEffect, useState } from "react";
import ReviewView from "./ReviewView";
import { getHotelReview, getHotels } from "../../service/hotel";

type Props = {};

const ReviewController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  const [value, setValue] = React.useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 2,
    total: 0,
    total_pages: 0,
  });
  useEffect(() => {
    getListHotel()
  }, [])

  useEffect(() => {
    if (idHotel) {
      getReview(1,value)
    }
  }, [idHotel,value])
  
  const getReview = async (page: number = 1, filter = "all") => {
    try {
      let query = {
        page,
        limit: pagination.limit
      }
      if (filter) {
        query.rate = filter
      }
      const queryString = new URLSearchParams(query).toString();
      let result = await getHotelReview(idHotel, queryString)
      if (result?.reviews) {
        setReviews(result?.reviews)
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
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (idHotel) {
      
      getReview(newPage,value);
    }
  };
  console.log("AAAA pagination",pagination)
  return <ReviewView
    hotels={hotels}
    idHotel={idHotel}
    setIdHotel={setIdHotel}
    reviews={reviews}
    getReview={getReview}
    pagination={pagination}
    setValue={setValue}
    onPageChange={handlePageChange}
    value={value}
   
  />;
};

export default ReviewController;
