import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials:true
});

api.interceptors.response.use(
  (response) => response, // success mah yoh wala CB run huncha
  async (error) => {
    // error mah yoh wala CB run huncha
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const originalErrorResponse = error.response?.data;

      console.log("Inside Interceptor");
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/user/refresh",
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        console.log("refresh token error", refreshError);

        // It's time to remove the cookies , since the refresh token is also expired , So lets call the logoutHandler at this point
        return Promise.reject({
          refreshTokenError: refreshError,
          originalErrorResponse,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
