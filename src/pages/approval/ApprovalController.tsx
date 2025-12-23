import React, { useEffect, useState } from "react";
import ApprovalView from "./ApprovalView";
import { getHotels } from "../../service/hotel";

type Props = {};

const ApprovalController = (props: Props) => {
  const [hotels,setHotels] = useState([])
  useEffect(()=>{
    getDataHotels()
  },[])
  const getDataHotels =async () => {
    try {
      let result = await getHotels();
      if(result?.hotels){
        setHotels(result?.hotels)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return <ApprovalView hotels={hotels} getDataHotels={getDataHotels} />;
};

export default ApprovalController;
