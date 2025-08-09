import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-gray-50 flex items-center flex-col shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Subscription Activated!
        </h1>
        <p className="text-green-700 text-lg text-center mb-4">
          Thank you for subscribing. Your payment was successful, and your
          subscription is now active.
        </p>

        <button
          onClick={handleGoToProfile}
          className="px-6 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition">
          Go to Profile
        </button>
      </div>
    </div>
  );
}
