import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

const ForgetEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Form Data:", data);
      // Simulate API call to send OTP
      // Replace with your actual API call, e.g.:
      // await api.sendOtp(data.email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      // Store email in localStorage or pass via state for OTP verification
      localStorage.setItem("resetEmail", data.email);
      // Navigate to OTP verification page
      navigate("/otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Handle error (e.g., show error message to user)
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-7 min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8">
        <div className="absolute top-10">
          <img src={logo} alt="Logo" />
        </div>
        <div>
          <h2 className="text-black text-4xl font-bold leading-tight">
            Reset Your Password
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            Enter your email to receive a 6-digit OTP and regain access to your AI workspace.
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
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-600 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetEmail;