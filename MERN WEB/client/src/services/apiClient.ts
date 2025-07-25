import axios, { AxiosError } from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for cookies
});

export const setHeader = (accessToken: string) => {
  if (accessToken !== "") {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const result = await apiClient.post("/auth/refresh-token");
        const newAccessToken = result.data.accessToken;

        setHeader(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          window.location.href = "/login"; // Correct redirect
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
