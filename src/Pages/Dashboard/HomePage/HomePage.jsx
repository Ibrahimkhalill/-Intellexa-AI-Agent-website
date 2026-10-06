import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AutomationAiSupport from "../Workflow/AutomationAiSupport";
import { useBookings } from "../../../hooks/useApi";

const HomePage = () => {
  const { data: bookings = [], isLoading: loading } = useBookings();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format booking date range (assuming single date for now)
  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    const startDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    // Assuming a single date; adjust if API provides a range
    return `${startDate}`;
  };
  return (
    <div className=" flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className=" mb-8">
          <div className="bg-gradient-to-r from-[#fffcf5] to-white rounded-lg border border-gray-50 p-4 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Workflow Overview
              </h1>
              <Link to="/booking-list" aria-label="View all bookings">
                <ChevronRight className="w-6 h-6 text-gray-400 hover:text-gray-700" />
              </Link>
            </div>
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr className=" text-left text-sm font-medium text-gray-900">
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Booking Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Booking Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(loading || bookings.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">
                      {loading ? "Loading bookings..." : "No bookings yet."}
                    </td>
                  </tr>
                )}
                {!loading &&
                  bookings.length > 0 &&
                  bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.booking_type.charAt(0).toUpperCase() +
                          booking.booking_type.slice(1)}{" "}
                        Booking
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.location || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatBookingDate(booking.booking_datetime)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Automation Templates Grid */}
        <AutomationAiSupport />
      </div>
    </div>
  );
};

export default HomePage;
