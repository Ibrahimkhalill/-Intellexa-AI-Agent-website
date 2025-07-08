import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png"
const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Perform login API call here
  };

  return (
    <div className="grid grid-cols-7 min-h-screen bg-base-200">

      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8">
        <div className="absolute top-10">
          <img src={logo} alt="" />
        </div>
        <div className="">

        <h2 className="text-black text-4xl font-bold leading-tight">
         Welcome Back to Your <br />Intelligent Workspace
        </h2>
        <p className="text-[#A1A1A1] text-sm mt-3">Log in to manage your smart assistant and stay in control of your AI tools.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center ">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-blue-200 shadow-md p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Sign in Account
          </h2>
          <p className="text-center text-sm mb-6">
            Don’t have an Account?{" "}
            <Link to='/signup' className="text-blue-500 hover:underline">
              Sign Up Free
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                User name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="Enter your user name"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaUser className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
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
                  placeholder="Enter your Password"
                  className="w-full border border-base-300 bg-base-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-center opacity-75">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="mr-2"
                  />
                  Remember for 30 Days
                </div>
                <a href="#" className="text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-slate-600 cursor-pointer text-white font-semibold py-2 rounded-md"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="divider">Or Login with</div>
          {/* Social Login */}
          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center border border-base-300 rounded-md py-2 hover:bg-gray-100">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center border border-base-300 rounded-md py-2 hover:bg-gray-100">
              <img
                src="https://www.svgrepo.com/show/452196/facebook-1.svg"
                alt="Facebook"
                className="w-5 h-5 mr-2"
              />
              Facebook
            </button>
          </div>

          {/* Bottom Signup */}
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to='/signup' className="text-blue-500 hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
