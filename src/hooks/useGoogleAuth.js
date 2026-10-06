import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosinstance";
import { useAuth } from "../components/authContext";
import { getApiErrorMessage } from "../utils/validation";

// Google sign-in shared by the Sign In and Sign Up pages. The backend verifies
// the Google access token itself, so we only send the token.
const useGoogleAuth = ({ setIsLoading, setApiError }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setApiError(null);
      try {
        const response = await axiosInstance.post("api/auth/google-login/", {
          access_token,
        });
        login(response.data);
        navigate("/");
      } catch (err) {
        console.error("Google login error", err);
        setApiError(getApiErrorMessage(err, "Google login failed. Please try again."));
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      if (error?.error !== "popup_closed_by_user") {
        setApiError("Google login failed. Please try again.");
      }
      setIsLoading(false);
    },
    onNonOAuthError: () => setIsLoading(false), // popup closed or blocked
  });
};

export default useGoogleAuth;
