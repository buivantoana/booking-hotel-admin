import React, { useEffect, useState } from "react";
import ManagerHotelView from "./ManagerHotelView";
import { getHotels } from "../../service/hotel";

type Props = {};

const ManagerHotelController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    getDataHotels();
  }, []);
  const getDataHotels = async () => {
    try {
      let result = await getHotels();
      if (result?.hotels) {
        setHotels(result?.hotels);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return <ManagerHotelView hotels={hotels} getDataHotels={getDataHotels} />;
};

export default ManagerHotelController;
