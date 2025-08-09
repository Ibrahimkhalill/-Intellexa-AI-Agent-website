import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import axiosInstance from "../../components/axiosinstance";
import { useAuth } from "../../components/authContext";
import { useGoogleLogin } from "@react-oauth/google";

import axios from "axios";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming useAuth is imported from authContext
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axiosInstance.post("api/auth/sign-in/", payload);
      console.log("Login successful:", response.data);
      // Store token or user data if needed (e.g., localStorage.setItem("token", response.data.token))
      if (response.status === 200) {
        login(
          response.data.access_token,
          response.data.email_address,
          response.data.profile.first_name,
          response.data.refresh_token
        );
        navigate("/");
      }
    } catch (error) {
      console.log("Login error:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Invalid email or password."
        );
      } else {
        setApiError("Invalid email or password.");
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
    onError: () => setIsLoading(false),
  });

  return (
    <div className="sm:grid flex flex-col grid-cols-7 min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8 relative">
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </div>
        <div className="flex flex-col sm:mt-0 mt-8">
          <h2 className="text-black text-4xl font-bold leading-tight">
            Welcome Back to Your <br />
            Intelligent Workspace
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            Log in to manage your smart assistant and stay in control of your AI
            tools.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-blue-200 shadow-md p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Sign in to Your Account
          </h2>
          {apiError && (
            <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder="Enter your email"
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

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
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

              <div className="flex sm:flex-row flex-col-reverse justify-end sm:items-center items-start mt-2 text-sm">
                {/* <div className="flex items-center  opacity-75">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="mr-2"
                  />
                  Remember for 30 Days
                </div> */}
                <div className="w-full sm:w-auto my-2">
                  <Link
                    to="/forget-password"
                    className="float-right text-blue-500 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black hover:bg-slate-600 cursor-pointer text-white font-semibold py-2 rounded-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">Or Login with</div>
          {/* Social Login */}
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

          {/* Bottom Signup */}
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
