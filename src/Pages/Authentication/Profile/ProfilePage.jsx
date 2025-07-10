import { useState } from "react";
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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileData, setProfileData] = useState({
    name: "Mahdee Rashid",
    phone: "+880 1838-828200",
    address: "33 Pendergast Aven 6, GA, 30738",
    company: "Silver Fin",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  });

  const billingData = [
    {
      plan: "Monthly",
      issue: "12/06/2024",
      expire: "12/07/2024",
      amount: "$55",
      status: "active",
    },
    {
      plan: "Monthly",
      issue: "12/06/2024",
      expire: "12/07/2024",
      amount: "$55",
      status: "active",
    },
    {
      plan: "Monthly",
      issue: "12/06/2024",
      expire: "12/07/2024",
      amount: "$55",
      status: "active",
    },
    {
      plan: "Monthly",
      issue: "12/04/2023",
      expire: "12/05/2023",
      amount: "$265",
      status: "expired",
    },
  ];

  const handlePasswordChange = (field, value) =>
    setPasswordData((prev) => ({ ...prev, [field]: value }));

  const togglePasswordVisibility = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const handlePasswordUpdate = () => {
    console.log("Password update:", passwordData);
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
            {profileData[key]}
          </p>
        )}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );

  const PasswordInput = ({ label, field, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[field] ? "text" : "password"}
          placeholder={placeholder}
          value={passwordData[field]}
          onChange={(e) => handlePasswordChange(field, e.target.value)}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-7 gap-6">
        {/* Profile Section */}
        <div className="col-span-5 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profileData.image}
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
                      if (file) {
                        setProfileData((prev) => ({
                          ...prev,
                          image: URL.createObjectURL(file),
                        }));
                      }
                    }}
                  />
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="text-2xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {profileData.name}
                  </h2>
                )}
                <p className="text-gray-500">maana@gmail.com</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg p-1 transition-colors"
            >
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
                  "phone",
                  "Phone number",
                  <Phone className="text-gray-400" size={20} />
                )}
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      deanna.curtis@example.com
                    </p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
                {renderInput(
                  "company",
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
                  className="flex items-center space-x-3 cursor-pointer hover:underline"
                >
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
                Monthly
              </h3>
              <p className="text-xs text-gray-400">
                Your plan is getting started with automation
              </p>
            </div>
            <div className="mb-6 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">$99</span>
              <span className="text-gray-400 line-through text-xs">$120</span>
            </div>
            <div className="space-y-3 mb-6">
              {[
                "Unlimited active scenarios",
                "More control with advanced scenarios",
                "Increased data transfer limits",
                "Access to the Make API",
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Check size={16} className="text-green-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Upgrade
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
                      className="text-left py-3 px-4 font-medium text-gray-900"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {billingData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {item.plan}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.issue}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span
                      className={
                        item.status === "expired"
                          ? "text-gray-600"
                          : "text-red-500"
                      }
                    >
                      {item.expire}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {item.amount}
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your account password
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <PasswordInput
                label="Current Password"
                field="currentPassword"
                placeholder="Enter current password"
              />
              <PasswordInput
                label="New Password"
                field="newPassword"
                placeholder="Enter new password"
              />
              <PasswordInput
                label="Confirm New Password"
                field="confirmPassword"
                placeholder="Confirm new password"
              />
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
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
