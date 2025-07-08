import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaLeftLong } from "react-icons/fa6";

const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const onSubmit = (data) => {
    console.log("OTP Entered:", data);
    // Perform OTP verification API call
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResendOtp = () => {
    if (resendEnabled) {
      console.log("Resend OTP triggered");
      setTimer(60);
      setResendEnabled(false);
      // Call resend OTP API here
    }
  };

  // Handle input change to auto-focus next field
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
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

  return (
    <div className="grid grid-cols-7 min-h-screen">
      {/* Left Side */}
      <div className="col-span-3 bg-[#F5F4F0] flex items-center p-8">
        <div className="flex flex-col">
          <h2 className="text-black text-4xl font-bold leading-normal">
            Verify Your Email to <br /> Activate Your AI Account
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-3">
            We’ve sent a verification code to your email — enter it below to continue.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 flex items-center justify-center p-8">
        <div className="max-w-xl w-full bg-white border border-blue-200 rounded-xl shadow-md p-20 relative">
          <h2 className="text-2xl font-bold text-center mb-2">
            Verify Your E-mail
          </h2>
          <p className="text-center text-sm mb-6">
            We have sent a 6-digit verification code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-4 justify-center">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <input
                  key={index}
                  {...register(`otp${index}`, { required: true, maxLength: 1 })}
                  type="text"
                  maxLength="1"
                  name={`otp${index}`} // Added name attribute for querySelector
                  className="w-12 h-12 text-center border border-base-300 bg-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ACACAC] text-lg"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm text-center">
                Please fill all OTP fields
              </p>
            )}

            {/* Resend OTP with Timer */}
            <p className="text-center text-sm mt-6">
              {resendEnabled ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#ACACAC] hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend OTP in {timer}s
                </span>
              )}
            </p>

            <button
              type="submit"
              className="w-full bg-black hover:bg-slate-600 cursor-pointer  text-white font-semibold py-2 rounded-md"
            >
              Verify OTP
            </button>
          </form>
          {/* Back Button */}
          <div className="flex items-center justify-center text-[#ACACAC] mt-4 hover:underline">
            <button
              onClick={() => window.history.back()}
              className="flex items-center"
            >
              <FaLeftLong className="mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;