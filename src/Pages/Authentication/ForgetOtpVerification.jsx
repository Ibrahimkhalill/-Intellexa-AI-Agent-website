import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaLeftLong } from "react-icons/fa6";
import axiosInstance from "../../components/axiosinstance";
import OtpInputs from "../../components/OtpInputs";
import { getApiErrorMessage, otpFromForm } from "../../utils/validation";

const OTP_TIMER_SECONDS = 120;

const ForgetOtpVerification = ({ user_id, email, onSuccess, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resendEnabled = timer <= 0;

  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axiosInstance.post("api/auth/reset/otp-verify/", {
        otp: otpFromForm(data),
        user_id,
      });
      onSuccess(response.data.user_id, response.data.secret_key);
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Invalid OTP. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!resendEnabled) return;
    setIsLoading(true);
    setApiError(null);
    try {
      // Password reset OTPs come from the reset endpoint (otp/create is for
      // unverified sign ups and rejects verified accounts)
      await axiosInstance.post("api/auth/password-reset-otp/", { email });
      setTimer(OTP_TIMER_SECONDS);
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Failed to resend OTP. Try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:grid grid-cols-7 min-h-screen">
      {/* Left Side */}
      <div className="sm:col-span-3   bg-[#F5F4F0] flex items-center p-8">
        <div className="flex flex-col">
          <h2 className="text-black text-4xl font-bold leading-normal">
            Verify It&apos;s You to <br /> Reset Your Password
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            We’ve sent a verification code to {email || "your email"} — enter
            it below to continue.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="sm:col-span-4  flex items-center justify-center p-8">
        <div className="sm:max-w-xl w-full bg-white border border-blue-200 rounded-xl shadow-md p-20 relative">
          <h2 className="text-2xl font-bold text-center mb-2">
            Enter Verification Code
          </h2>
          <p className="text-center text-sm mb-6">
            We have sent a 6-digit verification code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}
            <OtpInputs
              register={register}
              setValue={setValue}
              trigger={trigger}
              setApiError={setApiError}
              onPasteComplete={handleSubmit(onSubmit)}
            />
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
              type="button"
              onClick={onBack}
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
