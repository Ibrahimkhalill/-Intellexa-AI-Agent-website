import { useState } from "react";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import BookingDetailsModal from "../../../components/modal/BookingDetailsModal";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const bookings = [
    { id: 1, created: "04/15/2024", booking: "Restaurant Booking", date: "Sep 15-22, 2025", guests: 3, status: "Processing" },
    { id: 2, created: "04/18/2024", booking: "Restaurant Booking", date: "Sep 15-22, 2025", guests: 3, status: "Processing" },
    { id: 3, created: "05/01/2024", booking: "Spa Booking", date: "Aug 12-15, 2025", guests: 12, status: "Cancel" },
    { id: 4, created: "05/10/2024", booking: "Spa Booking", date: "Sep 17-23, 2025", guests: 8, status: "Confirm" },
    { id: 5, created: "05/12/2024", booking: "Hotel Reservation", date: "Jul 22-28, 2025", guests: 5, status: "Processing" },
    { id: 6, created: "06/01/2024", booking: "Spa Booking", date: "Aug 12-15, 2025", guests: 12, status: "Cancel" },
  ];

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [filter, setFilter] = useState({ from: "", to: "" });

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirm":
        return "text-green-600";
      case "Cancel":
        return "text-red-600";
      case "Processing":
      default:
        return "text-gray-600";
    }
  };

  // Converts MM/DD/YYYY to YYYY-MM-DD
  const formatDateToInput = (dateStr) => {
    const [mm, dd, yyyy] = dateStr.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  const inRange = (createdDate) => {
    const formatted = formatDateToInput(createdDate);

    if (!filter.from && !filter.to) return true;
    if (filter.from && formatted < filter.from) return false;
    if (filter.to && formatted > filter.to) return false;

    return true;
  };

  const filteredBookings = bookings.filter((b) => inRange(b.created));

  const handleNavigate = () => {
    navigate("/booking-deatils");
  };

  const handleClear = () => setFilter({ from: "", to: "" });
  const handleApply = () => setShowFilterBox(false);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Booking List</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">All Booking List</h3>

                <button
                  onClick={() => setShowFilterBox((prev) => !prev)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Filter
                  {showFilterBox ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {showFilterBox && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                    <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={filter.from}
                      onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                      className="mb-3 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />

                    <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={filter.to}
                      onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                      className="mb-4 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleClear}
                        className="px-3 py-1 text-xs bg-gray-200 rounded"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleApply}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Booking</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Booking date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Guests</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={handleNavigate}
                      >
                        <td className="py-3 px-4 text-sm text-gray-600">{booking.created}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{booking.booking}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{booking.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{booking.guests} Guests</td>
                        <td className={`py-3 px-4 text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBookings.length === 0 && (
                  <p className="text-center py-8 text-gray-500 text-sm">
                    No bookings found for selected range.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "black", opacity: 0.5 }}
        ></div>
      )}
      <BookingDetailsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default BookingList;
