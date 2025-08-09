import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/axiosinstance";

const ForgetOtpVerification = ({ user_id, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();
  const [timer, setTimer] = useState(120);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve user_id from location state or localStorage
  const userId = user_id;

  useEffect(() => {
    // If userId comes from location, store in localStorage
    if (userId) {
      localStorage.setItem("otp_user_id", userId);
    }

    const storedUserId = localStorage.getItem("otp_user_id");

    if (!storedUserId) {
      navigate("/signup");
    }

    const storedTimer = localStorage.getItem("otp_timer");
    if (storedTimer) {
      setTimer(parseInt(storedTimer));
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          localStorage.setItem("otp_timer", prev - 1); // Save timer in localStorage
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
      localStorage.removeItem("otp_timer"); // Clean up after timer ends
    }
  }, [timer]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    // Concatenate OTP digits into a single string
    const otp = Object.values(data).join("");
    const payload = {
      otp,
      user_id: userId,
    };

    try {
      const response = await axiosInstance.post(
        "api/auth/reset/otp-verify/",
        payload
      );
      console.log("OTP Verification successful:", response.data);

      localStorage.removeItem("otp_user_id");
      onSuccess(response.data.user_id, response.data.secret_key);
    } catch (error) {
      if (error.response) {
        setApiError(
          error.response.data.message || "Invalid OTP. Please try again."
        );
      } else {
        setApiError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendEnabled) {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await axiosInstance.post("api/auth/otp/create/", {
          user_id: userId,
        });
        console.log("OTP Resent:", response.data);
        setTimer(120);
        setResendEnabled(false);
        setApiError(null);
      } catch (error) {
        if (error.response) {
          setApiError(
            error.response.data.message || "Failed to resend OTP. Try again."
          );
        } else {
          setApiError("Network error. Please check your connection.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle input change to auto-focus next field
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value) && index < 5 && value.length === 1) {
      const nextInput = document.querySelector(`input[name="otp${index + 1}"]`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle keydown for backspace to move to previous field
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      const prevInput = document.querySelector(`input[name="otp${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event for the first input
  const handlePaste = async (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      // Populate all OTP fields
      pastedData.split("").forEach((char, index) => {
        setValue(`otp${index}`, char);
      });
      // Trigger form validation
      const isValid = await trigger();
      if (isValid) {
        // Programmatically submit the form
        handleSubmit(onSubmit)();
      } else {
        setApiError("Please enter a valid 6-digit OTP");
      }
    } else {
      setApiError("Pasted OTP must be 6 digits");
    }
  };

  return (
    <div className="flex flex-col sm:grid grid-cols-7 min-h-screen">
      {/* Left Side */}
      <div className="sm:col-span-3   bg-[#F5F4F0] flex items-center p-8">
        <div className="flex flex-col">
          <h2 className="text-black text-4xl font-bold leading-normal">
            Verify Your Email to <br /> Activate Your AI Account
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            We’ve sent a verification code to your email — enter it below to
            continue.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="sm:col-span-4  flex items-center justify-center p-8">
        <div className="sm:max-w-xl w-full bg-white border border-blue-200 rounded-xl shadow-md p-20 relative">
          <h2 className="text-2xl font-bold text-center mb-2">
            Verify Your E-mail
          </h2>
          <p className="text-center text-sm mb-6">
            We have sent a 6-digit verification code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}
            <div className="flex sm:space-x-4 space-x-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  {...register(`otp${index}`, {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]$/,
                      message: "Must be a digit",
                    },
                  })}
                  type="text"
                  maxLength="1"
                  name={`otp${index}`}
                  className="w-12 h-12 text-center border border-base-300 bg-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ACACAC] text-lg"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined} // Paste only on first input
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm text-center">
                Please enter a valid 6-digit OTP
              </p>
            )}

            {/* Resend OTP with Timer */}
            <p className="text-center text-sm mt-6">
              {resendEnabled ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className={`text-[#ACACAC] cursor-pointer hover:underline ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">Resend OTP in {timer}s</span>
              )}
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black hover:bg-slate-600 cursor-pointer text-white font-semibold py-2 rounded-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          {/* Back Button */}
          <div className="flex items-center justify-center text-[#ACACAC] mt-4 hover:underline">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center">
              <FaLeftLong className="mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetOtpVerification;
