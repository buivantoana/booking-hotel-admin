import api from "../core/api";

export async function createHotel(body: any) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/partner/hotel/create`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function createRoomHotel(id, body: any) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(
      `/partner/hotel/${id}/room-type/create`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getInventoryHotelHourly(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(
      `/partner/hotel/${id}/inventory/hourly?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function getInventoryHotelOvernight(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(
      `/partner/hotel/${id}/inventory/overnight?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getInventoryHotelDaily(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(
      `/partner/hotel/${id}/inventory/daily?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getGeneralStats(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/stats/${id}/general?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getGeneralWeek(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/stats/${id}/revenue?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getGeneralWeekRoomType(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/stats/${id}/revenue?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getEventMonth(id, params) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/stats/${id}/events?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function getReviewstats(id) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/stats/${id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function getHotels(query) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/admin/hotel/all-hotels?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getHotel(id) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/admin/hotel/${id}/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function updateHotelStatus(id, body) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/admin/hotel/${id}/status`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function listPayment( query) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/admin/payment/all-payments?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function updateRoom(id, idRoom, body) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(
      `/partner/hotel/${id}/room-type/${idRoom}/update`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function toggleHotels(id) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/partner/hotel/${id}/toggle-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function addBankHotels(body) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/partner/settlement/banks`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function updateBankHotels(id, body) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.put(`/partner/settlement/banks/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function confirmHotelsSettlement(id) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/partner/settlement/${id}/confirm`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
export async function getHotelReview(id,query) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(`/partner/review/hotel/${id}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function replyReviewHotels(id, body) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.post(`/partner/review/reply/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function getMySettlements(query) {
  try {
    let token = localStorage.getItem("access_token");
    const response = await api.get(
      `/partner/settlement/my-settlements?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}
