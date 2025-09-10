import { ChevronRight } from "lucide-react";
import AutomationAiSupport from "../Worlflow/AutomationAiSupport";
import axiosInstance from "../../../components/axiosinstance";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get("api/booking/list/");
        setBookings(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // const automationTemplates = [
  //   {
  //     title: "Flight Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [flightImg, aiImg, flightImg1],
  //   },
  //   {
  //     title: "Restaurant Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [restaurantImg, aiImg, Hotel_book],
  //   },
  //   {
  //     title: "Spa Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [spaImg, aiImg, BookNow],
  //   },
  //   {
  //     title: "Birthday Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [birthdayImg, aiImg, Birthday_book],
  //   },
  //   {
  //     title: "Concert Tickets Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [concertImg, aiImg, documentImg],
  //   },

  //   {
  //     title: "Spa Booking",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [spaImg, aiImg, BookNow],
  //   },

  //   {
  //     title: "Email Automation",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [emailImg, aiImg, emailImg],
  //   },
  //   {
  //     title: "Hotel Reservation",
  //     description:
  //       "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
  //     icons: [hotelImg, aiImg, res],
  //   },
  // ];
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
              <ChevronRight className="w-6 h-6 text-gray-400" />
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
                {bookings.length > 0 &&
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
                        {booking.location}
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
