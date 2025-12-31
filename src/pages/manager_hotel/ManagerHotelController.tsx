import React, { useEffect, useState } from "react";
import ManagerHotelView from "./ManagerHotelView";
import { getHotels, getLocation } from "../../service/hotel";
import { useSearchParams } from "react-router-dom";

type Props = {};

const ManagerHotelController = (props: Props) => {
  const [hotels, setHotels] = useState([])
  const [locations, setLocations] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    cooperation_type: "",
    city: ""
  });
  useEffect(() => {
    const defaultFilters = {
      name: "",
      cooperation_type: "",
      city: ""
    };
    console.log("Initial filters:", defaultFilters);
    setFilters(defaultFilters);
    getDataHotels(1, defaultFilters)
    getLocations()
  }, [])

  const getLocations = async () => {
    try {
      let result = await getLocation()
      console.log("AAA getLocations", result)
      if (result?.locations) {
        setLocations(result?.locations)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getDataHotels = async (page, filterParams = filters) => {
    setLoading(true)
    try {
      let query: any = {
        page: page || pagination.page,
        limit: pagination.limit,
        partner_email: searchParams.get("email")
      };


      if (filterParams.name) {
        query.name = filterParams.name;
      }
      if (filterParams.city) {
        query.city = filterParams.city;
      }

      if (filterParams.cooperation_type) {
        query.cooperation_type = filterParams.cooperation_type;
      }
      const params1 = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params1.append(key, String(value));
        }
      });
      const queryString1 = params1.toString();
      let result = await getHotels(queryString1);


      if (result?.hotels) {
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
    setLoading(false)
  }

  const handleFilterChange = (newFilters: any) => {
    console.log("Filter changed to:", newFilters);
    setFilters(newFilters);

    getDataHotels(1, newFilters);

  };

  // Reset filter
  const handleResetFilter = () => {

    const resetFilters = {
      name: "",
      cooperation_type: "",
      city: ""
    };
    setFilters(resetFilters);
    getDataHotels(1, resetFilters);

  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {

    getDataHotels(newPage);

  };
  return <ManagerHotelView hotels={hotels} pagination={pagination}
    locations={locations}
    filters={filters}
    onFilterChange={handleFilterChange}
    onResetFilter={handleResetFilter}
    onPageChange={handlePageChange}
    loading={loading}
    getDataHotels={getDataHotels} />;
};

export default ManagerHotelController;
