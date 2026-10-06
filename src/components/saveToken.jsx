import { requestForToken } from "../firebase";
import axiosInstance from "./axiosinstance";

const saveToken = async () => {
  try {
    const token = await requestForToken();
    if (token) {
      // send token to backend for this user
      await axiosInstance.post("api/notification/save-fcm-token/", {
        fcm_token: token,
      });
    }
  } catch (err) {
    // Push notifications are optional - never break the dashboard over them
    console.error("Failed to save FCM token:", err);
  }
};

export default saveToken;
