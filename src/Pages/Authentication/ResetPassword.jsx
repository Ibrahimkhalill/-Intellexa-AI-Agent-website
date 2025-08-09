import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import axiosInstance from "../../components/axiosinstance";

const ResetPassword = ({ user_id, secret_key }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Retrieve user_id and secret_key from location state or localStorage
  const userId = user_id;
  const secretKey = secret_key;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (!userId || !secretKey) {
      setApiError("Missing user ID or secret key. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await axiosInstance.post(
        "api/auth/password-reset/confirm/",
        {
          user_id: userId,
          secret_key: secretKey,
          new_password: data.newPassword,
        }
      );
      console.log("Password reset successful:", response.data);
      // Clear stored data
      localStorage.removeItem("user_id");
      localStorage.removeItem("secret_key");
      localStorage.removeItem("resetEmail");
      // Navigate to sign-in page
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        setApiError(
          error.response.data.message ||
            "Failed to reset password. Please try again."
        );
      } else {
        setApiError("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch newPassword for confirm password validation
  const newPassword = watch("newPassword");

  return (
    <div className="grid grid-cols-7 min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8 relative">
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </div>
        <div>
          <h2 className="text-black text-4xl font-bold leading-tight">
            Set a New Password
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            Create a new password for your AI workspace to regain access.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-blue-200 shadow-md p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Reset Your Password
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
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must include uppercase, lowercase, number, and special character",
                    },
                  })}
                  placeholder="Enter your new password"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  placeholder="Confirm your new password"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
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
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
