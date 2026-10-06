import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookings, useDeleteBooking } from "../../../hooks/useApi";
import { confirmAction, notify } from "../../../utils/notify";
import { getApiErrorMessage } from "../../../utils/validation";

// Format date from API (e.g., "2025-09-10T04:01:30Z" to "09/10/2025")
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

const formatBookingDate = (dateString) =>
  new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatType = (type) => `${type.charAt(0).toUpperCase()}${type.slice(1)} Booking`;

const BookingList = () => {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isError, refetch } = useBookings();
  const deleteBooking = useDeleteBooking();

  const handleDelete = async (booking) => {
    const confirmed = await confirmAction({
      title: "Delete this booking?",
      text: `${formatType(booking.booking_type)} on ${formatBookingDate(booking.booking_datetime)} and its reminders will be removed.`,
      confirmButtonText: "Delete",
    });
    if (!confirmed) return;
    try {
      await deleteBooking.mutateAsync(booking.id);
      notify.success("Booking deleted");
    } catch (err) {
      notify.error(getApiErrorMessage(err, "Failed to delete booking."));
    }
  };

  const addButton = (
    <button
      onClick={() => navigate("/booking")}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      <Plus className="w-4 h-4 mr-2" />
      Add Booking
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-8">
          <div className="flex items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Booking List</h2>
            {addButton}
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                <span className="text-gray-600 text-sm mt-4">Loading bookings...</span>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center">
              <p className="text-red-500 mb-3">Failed to fetch bookings.</p>
              <button onClick={() => refetch()} className="text-blue-600 hover:underline text-sm">
                Try again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600 text-center">No bookings yet. Add your first one!</p>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">All Booking List</h3>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {["Created", "Booking Type", "Location", "Starts", ""].map((header) => (
                          <th
                            key={header}
                            className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                            {header}
                          </th>
                        ))}
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
                            {formatType(booking.booking_type)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {booking.location || "—"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatBookingDate(booking.booking_datetime)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => navigate(`/booking/${booking.id}`)}
                                title="Edit booking"
                                aria-label="Edit booking"
                                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(booking)}
                                disabled={deleteBooking.isPending}
                                title="Delete booking"
                                aria-label="Delete booking"
                                className="p-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
    </div>
  );
};

export default BookingList;
