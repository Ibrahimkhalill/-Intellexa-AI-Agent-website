import { useState, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
import BookingDetailsModal from "../../../components/modal/BookingDetailsModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../components/axiosinstance";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("api/booking/list/");
        setBookings(response.data || []);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleNavigate = () => {
    navigate(`/booking`);
  };

  // Format date from API (e.g., "2025-09-10T04:01:30Z" to "09/10/2025")
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
    <div className="flex h-screen bg-gray-50 relative">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Booking List</h2>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                <span className="text-gray-600 text-sm mt-4">
                  Loading bookings...
                </span>
              </div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600 text-center">No bookings available.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Booking List
                  </h3>
                  <button
                    onClick={handleNavigate}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Booking
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                          Created
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                          Booking Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                          Location
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                          Booking Start date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-16">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(booking.created_at)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {booking.booking_type.charAt(0).toUpperCase() +
                              booking.booking_type.slice(1)}{" "}
                            Booking
                          </td>

                          <td className="py-3 px-4 text-sm text-gray-600">
                            {booking.location}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatBookingDate(booking.booking_datetime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "black", opacity: 0.5 }}></div>
      )}
      <BookingDetailsModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Custom Styles */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BookingList;
