import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../components/axiosinstance";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../../components/authContext";
const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assuming useAuth is imported from authContext

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setApiError(null); // Reset any previous errors
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      role: "user", // Hardcoded as per API requirement
    };
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("api/auth/sign-up/", payload);
      console.log("Signup successful:", response.data);
      // Redirect to OTP page after successful signup

      if (response.status === 201) {
        navigate("/otp", { state: { user_id: response.data.user_id } });
      }
    } catch (error) {
      // Handle API errors
      if (error.response) {
        setApiError(
          error.response.data.message || "Signup failed. Please try again."
        );
      } else {
        setApiError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goolelogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      localStorage.setItem("gmail_access_token", access_token);

      try {
        const googleUser = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const { name, email, sub: google_id } = googleUser.data;

        const response = await axiosInstance.post("/api/auth/google-login/", {
          name,
          email,
          picture: googleUser.data.picture,
          google_id,
          access_token,
        });

        // Login and redirect
        if (response.status === 200) {
          login(
            response.data.access_token,
            response.data.email_address,
            response.data.profile.first_name,
            response.data.refresh_token
          );
          navigate("/");
        }
      } catch (err) {
        console.error("Google login error", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      if (error.error === "popup_closed_by_user") {
        console.log("User closed the Google login popup");
      } else {
        console.error("Google login failed:", error);
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="sm:grid flex flex-col grid-cols-7 min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8">
        <div className="flex flex-col">
          <h2 className="text-black text-4xl font-bold leading-normal">
            Welcome Back! Verify Your <br /> Email to Access Your <br />{" "}
            Learning Portal!
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            Join us to access personalized AI solutions built for productivity
            and simplicity.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-blue-200 shadow-md p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Sign Up Account
          </h2>
          <p className="text-center text-sm mb-6">
            Already have an Account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    placeholder="First name"
                    className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaUser className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    placeholder="Last name"
                    className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaUser className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Email Address"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaMailBulk className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
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
                  placeholder="Enter your Password"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-between items-start mt-2 text-sm">
              <div className="flex items-center opacity-75">
                <input
                  type="checkbox"
                  {...register("terms", {
                    required: "You must agree to the terms and conditions",
                  })}
                  className="mr-2"
                />
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-500 ps-1 hover:underline">
                  Terms and Conditions
                </Link>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black hover:bg-slate-600 cursor-pointer text-white font-semibold py-2 rounded-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">Or Sign Up with</div>
          {/* Social SignUp */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                goolelogin();
                setIsLoading(true);
              }}
              disabled={isLoading}
              className={`flex-1 cursor-pointer flex items-center justify-center border border-base-300 rounded-md py-2 hover:bg-gray-100 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
          </div>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
