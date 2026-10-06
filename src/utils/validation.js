// Shared password rules - keep in sync across sign up, reset and change password
export const passwordRules = {
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    message:
      "Password must include uppercase, lowercase, number, and special character",
  },
};

// Read a user-friendly message from a backend error response
export const getApiErrorMessage = (error, fallback) => {
  if (!error?.response) return "Network error. Please check your connection.";
  const data = error.response.data || {};
  return data.message || data.error || fallback;
};

// Join the six OTP boxes (otp0..otp5) from react-hook-form data
export const otpFromForm = (data) =>
  Array.from({ length: 6 }, (_, i) => data[`otp${i}`] || "").join("");
