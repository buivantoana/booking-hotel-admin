import api from "../core/api";

export async function Login(body: any) {
  try {
    const response = await api.post(`/partner/login`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function LoginGoogle(body: any) {
  try {
    const response = await api.post(`/user/login-google`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function checkUser(body: any) {
  try {
    const response = await api.post(`/user/check`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function register(body: any) {
  try {
    const response = await api.post(`/partner/register`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function verifyOtp(body: any) {
  try {
    const response = await api.post(`/user/verify-otp`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}

export async function userUpdate(body: any, accessToken) {
  try {
    if (!accessToken) {
      accessToken = localStorage.getItem("access_token");
    }
    const response = await api.put(`/partner/update`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return error.response.data; // You can return this to handle error responses
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up request:", error.message);
    }
  }
}
