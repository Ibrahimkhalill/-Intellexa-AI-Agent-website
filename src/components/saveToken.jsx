import { requestForToken } from "../firebase";
import axiosInstance from "./axiosinstance";

const saveToken = async () => {
  const token = await requestForToken();
  console.log("token", token);
  if (token) {
    // send token to backend for this user
    await axiosInstance.post(
      "api/notification/save-fcm-token/",

      { fcm_token: token }
    );
  }
};

export default saveToken;
