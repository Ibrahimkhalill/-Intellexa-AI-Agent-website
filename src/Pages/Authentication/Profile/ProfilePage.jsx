import { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Phone,
  Mail,
  MapPin,
  Lock,
  Check,
  Calendar,
  EyeOff,
  Eye,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../components/axiosinstance";

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange", // Validate on change to show errors immediately
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileData, setProfileData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    company_name: "",
    profile_picture: null,
    email_address: "",
    google_profile_picture: null,
  });
  const [billingData, setBillingData] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [plans, setPlans] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Update previewUrl when profile_picture changes
  useEffect(() => {
    if (profileData.profile_picture instanceof File) {
      const url = URL.createObjectURL(profileData.profile_picture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (profileData.profile_picture) {
      setPreviewUrl(
        `${import.meta.env.VITE_REACT_BASE_URL}${profileData.profile_picture}`
      );
    } else if (profileData.google_profile_picture) {
      setPreviewUrl(profileData.google_profile_picture);
    } else {
      setPreviewUrl(
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
      );
    }
  }, [profileData.profile_picture, profileData.google_profile_picture]);

  // Fetch profile and billing data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("api/auth/profile/");
        const { id, user_profile, email_address, is_subscribed } =
          response.data;
        setIsSubscribed(is_subscribed);
        setProfileData({
          id,
          first_name: user_profile.first_name || "",
          last_name: user_profile.last_name || "",
          phone_number: user_profile.phone_number || "",
          address: user_profile.address || "",
          company_name: user_profile.company_name || "",
          profile_picture: user_profile.profile_picture || null,
          google_profile_picture: user_profile.google_profile_picture || null,
          email_address,
        });
      } catch (error) {
        setApiError(
          error.response?.data?.message || "Failed to load profile data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("api/payment/all-plan/");
        const plans = response.data[0] || [];
        console.log("Plans fetched:", plans);
        setPlans(plans);
      } catch (error) {
        setApiError(error.response?.data?.message || "Failed to load plans.");
      }
    };

    const fetchBilling = async () => {
      try {
        const response = await axiosInstance.get("api/payment/me/");
        setBillingData(response.data.invoices || []);
      } catch (error) {
        setApiError(
          error.response?.data?.message || "Failed to load billing data."
        );
      }
    };

    fetchProfile();
    fetchBilling();
    fetchPlans();
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handlePasswordUpdate = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await axiosInstance.post("api/auth/password-change/", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      setShowPasswordModal(false);
      reset(); // Reset form fields
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to update password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("first_name", profileData.first_name);
      formData.append("last_name", profileData.last_name);
      formData.append("phone_number", profileData.phone_number);
      formData.append("address", profileData.address);
      formData.append("company_name", profileData.company_name);
      if (profileData.profile_picture instanceof File) {
        formData.append("profile_picture", profileData.profile_picture);
      }

      await axiosInstance.put("api/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false);
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (key, label, icon) => (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        {isEditing ? (
          <input
            type="text"
            value={profileData[key]}
            onChange={(e) =>
              setProfileData({ ...profileData, [key]: e.target.value })
            }
            className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
          />
        ) : (
          <p className="text-sm font-medium text-gray-900">
            {profileData[key] || "Not set"}
          </p>
        )}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "api/payment/create-checkout-session/",
        {
          price_id: plans.price_id || import.meta.env.VITE_PRICE_ID,
        }
      );

      if (response.status === 200) {
        window.location.href = response.data.checkout_url;
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {apiError && (
        <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
      )}
      {isLoading && (
        <p className="text-gray-500 text-sm text-center mb-4">Loading...</p>
      )}
      <div className="grid grid-cols-7 gap-6">
        {/* Profile Section */}
        <div className="col-span-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-16 h-16 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (
                        file &&
                        file.size < 5 * 1024 * 1024 &&
                        file.type.startsWith("image/")
                      ) {
                        setProfileData((prev) => ({
                          ...prev,
                          profile_picture: file,
                        }));
                      } else {
                        setApiError(
                          "Image must be less than 5MB and an image file."
                        );
                      }
                    }}
                  />
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          first_name: e.target.value,
                        })
                      }
                      className="text-2xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          last_name: e.target.value,
                        })
                      }
                      className="text-2xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {profileData.first_name} {profileData.last_name}
                  </h2>
                )}
                <p className="text-gray-500">{profileData.email_address}</p>
              </div>
            </div>
            <button
              onClick={() =>
                isEditing ? handleProfileUpdate() : setIsEditing(true)
              }
              disabled={isLoading}
              className={`flex items-center space-x-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg p-1 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              <Edit size={14} />
              <span className="text-sm ps-1">
                {isEditing ? "Save Info" : "Edit Profile"}
              </span>
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {renderInput(
                  "phone_number",
                  "Phone number",
                  <Phone className="text-gray-400" size={20} />
                )}
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profileData.email_address}
                    </p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
                {renderInput(
                  "company_name",
                  "Company Name",
                  <Calendar className="text-gray-400" size={20} />
                )}
              </div>
              <div className="space-y-6">
                {renderInput(
                  "address",
                  "Address",
                  <MapPin className="text-gray-400" size={20} />
                )}
                <div
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center space-x-3 cursor-pointer hover:underline">
                  <Lock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Change Password
                    </p>
                    <p className="text-xs text-gray-500">Privacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="col-span-2">
          <div className="bg-gray-900 rounded-lg p-6 text-white">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-1">
                {billingData[0]?.plan || "Monthly"}
              </h3>
              <p className="text-xs text-gray-400">
                Your plan is getting started with automation
              </p>
            </div>
            <div className="mb-6 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">
                {plans.amount}
              </span>
              <span className="text-gray-400 line-through text-xs">$120</span>
            </div>
            <div className="space-y-3 mb-6">
              {plans?.descriptions?.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Check size={16} className="text-green-400" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || isSubscribed}
              className={`w-full text-white font-semibold py-3 rounded-lg transition 
    ${
      isLoading || isSubscribed
        ? "bg-slate-400 cursor-not-allowed"
        : "bg-slate-500 hover:bg-blue-600"
    }`}>
              {isLoading
                ? "Processing..."
                : isSubscribed
                ? "Already Subscribed"
                : "Upgrade Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg p-6 mt-10 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Billing History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Plan", "Issue", "Expire", "Amount", "Download"].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left py-3 px-4 font-medium text-gray-900">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {billingData.length > 0 ? (
                billingData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {item.plan}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {item.issue_date}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={
                          new Date(item.expire_date) < new Date()
                            ? "text-red-500"
                            : "text-gray-600"
                        }>
                        {item.expire_date}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {item.amount}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={item.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download PDF
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-4 text-sm text-gray-600 text-center">
                    No billing history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="relative w-full">
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="text-sm mb-3 text-gray-500 mt-1">
                  Update your account password
                </p>
                {apiError && (
                  <p className="absolute top-14 w-full text-red-500 text-sm text-center mb-4">
                    {apiError}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  reset();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handlePasswordUpdate)}
              className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    {...register("currentPassword", {
                      required: "Current Password is required",
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword", {
                      required: "New Password is required",
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Confirm New Password is required",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Passwords do not match",
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    reset();
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0}
                  className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
                    isLoading || Object.keys(errors).length > 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}>
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
