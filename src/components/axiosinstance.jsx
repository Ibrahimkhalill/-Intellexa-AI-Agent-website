import axios from "axios";

export const AUTH_LOGOUT_EVENT = "auth:logout";
export const AUTH_USER_KEY = "authUser";

// Auth tokens live in httpOnly cookies set by the backend - JavaScript never
// sees them. We only keep non-sensitive user info to know who is logged in.
export const isLoggedIn = () => {
  try {
    return Boolean(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return false;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_BASE_URL,
  withCredentials: true, // send the auth cookies
  headers: {
    // Required by the backend for cookie-authenticated writes (CSRF defence)
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Share one refresh request between all requests that fail at the same time
let refreshPromise = null;

const refreshAccessToken = () =>
  axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/auth/refresh/`, null, {
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });

const isAuthEndpoint = (url = "") =>
  ["api/auth/sign-in/", "api/auth/refresh/", "api/auth/logout/"].some((path) =>
    url.includes(path)
  );

// Handle 401: refresh the access cookie once, then retry the request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url) &&
      isLoggedIn()
    ) {
      originalRequest._retry = true;

      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Session is over - log the user out everywhere in the app
        console.error("Error refreshing access token:", refreshError);
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
