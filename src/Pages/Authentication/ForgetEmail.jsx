import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import axiosInstance from "../../components/axiosinstance";

const ForgetEmail = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await axiosInstance.post(
        "api/auth/password-reset-otp/",
        {
          email: data.email,
        }
      );
      console.log("OTP sent successfully:", response.data);
      // Store user_id or email for OTP verification
      const userId = response.data.user_id; // Adjust based on actual API response

      if (userId) {
        localStorage.setItem("user_id", userId);
      }
      // Navigate to OTP verification page

      onSuccess(userId);
    } catch (error) {
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to send OTP. Please try again."
        );
      } else {
        setApiError("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-7 min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8 relative">
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </div>
        <div>
          <h2 className="text-black text-4xl font-bold leading-tight">
            Reset Your Password
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            Enter your email to receive a 6-digit OTP and regain access to your
            AI workspace.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-blue-200 shadow-md p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Forgot Password
          </h2>
          <p className="text-center text-sm mb-6">
            Remember your account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <p className="text-red-500 text-sm text-center mb-4">
                {apiError}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email address"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaEnvelope className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-black text-white font-semibold py-2 rounded-md ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-600 cursor-pointer"
              }`}>
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetEmail;
