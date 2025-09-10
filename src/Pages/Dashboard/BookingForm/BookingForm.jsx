import { useState, useEffect } from "react";
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { useParams } from "react-router-dom";
import axiosInstance from "../../../components/axiosinstance";

export default function BookingForm() {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  const [formData, setFormData] = useState({
    bookingType: "",
    location: "",
    checkIn: formatDate(today),
    checkOut: formatDate(today),
  });
  const [calendarOpen, setCalendarOpen] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { bookingId } = useParams(); // To prefill form if editing an existing booking

  const bookingTypes = [
    { value: "flight", label: "Flight Booking" },
    { value: "restaurant", label: "Restaurant Booking" },
    { value: "spa", label: "Spa Booking" },
    { value: "birthday", label: "Birthday Booking" },
    { value: "concert", label: "Concert Tickets Booking" },
    { value: "hotel", label: "Hotel Reservation" },
  ];

  // Fetch existing booking if bookingId is provided
  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.get(`api/booking/list/`);
          const booking = response.data.find(
            (b) => b.id === parseInt(bookingId)
          );
          if (booking) {
            setFormData({
              fullName: "", // API doesn't provide this, so keep empty
              phoneNumber: "", // API doesn't provide this
              bookingType: booking.booking_type,
              location: booking.location,
              adults: booking.guests || 1,
              children: 0, // API doesn't provide this
              checkIn: formatDate(new Date(booking.booking_datetime)),
              checkOut: formatDate(
                new Date(
                  new Date(booking.booking_datetime).setDate(
                    new Date(booking.booking_datetime).getDate() + 2
                  )
                )
              ),
              specialRequests: "", // API doesn't provide this
            });
          }
        } catch (err) {
          setError("Failed to fetch booking details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date) => {
    const formattedDate = formatDate(date);
    if (calendarOpen === "checkin") {
      handleInputChange("checkIn", formattedDate);
      const checkOutDate = parseDate(formData.checkOut);
      if (date >= checkOutDate) {
        const newCheckOut = new Date(date);
        newCheckOut.setDate(date.getDate() + 2);
        handleInputChange("checkOut", formatDate(newCheckOut));
      }
    } else if (calendarOpen === "checkout") {
      handleInputChange("checkOut", formattedDate);
    }
    setCalendarOpen(null);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (calendarOpen === "checkin") {
      return date < today;
    } else if (calendarOpen === "checkout") {
      const checkInDate = parseDate(formData.checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      return date < today || date <= checkInDate;
    }
    return false;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        booking_type: formData.bookingType,
        location: formData.location,
        booking_datetime: parseDate(formData.checkIn).toISOString(),
        booking_end_date: parseDate(formData.checkOut).toISOString(),
      };
      await axiosInstance.post("api/booking/create/", payload);
      // Optionally redirect or show success message
      alert("Booking created successfully!");
      setFormData({
        bookingType: "",
        location: "",
        checkIn: formatDate(today),
        checkOut: formatDate(today),
      });
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const CalendarComponent = () => {
    const days = getDaysInMonth(currentMonth);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-72">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isDisabled = day ? isDateDisabled(day) : true;
            const isSelected =
              day &&
              ((calendarOpen === "checkin" &&
                formatDate(day) === formData.checkIn) ||
                (calendarOpen === "checkout" &&
                  formatDate(day) === formData.checkOut));

            return (
              <button
                key={index}
                type="button"
                onClick={() => day && !isDisabled && handleDateSelect(day)}
                disabled={isDisabled}
                className={`
                  p-2 text-sm rounded transition-colors
                  ${!day ? "invisible" : ""}
                  ${
                    isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-teal-50 hover:text-teal-600 cursor-pointer"
                  }
                  ${isSelected ? "bg-teal-600 text-white" : ""}
                `}>
                {day ? day.getDate() : ""}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
            <span className="text-white text-sm mt-4">Processing...</span>
          </div>
        </div>
      )}
      <div className="border border-gray-300 rounded-xl p-4 w-full max-w-2xl shadow-sm bg-white/20">
        <div className="bg-[#F2F4F3] border border-gray-200 rounded-xl shadow-lg w-full relative">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between flex-col gap-2">
              <h2 className="text-lg text-center font-semibold text-gray-800">
                Add New Booking
              </h2>
              <p className="text-sm text-gray-500">
                Ready? Let's finish the booking confirmation.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name and Phone */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                  required
                />
              </div>
            </div> */}

            {/* Booking Type and Location */}
            <div className=" gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Type
                </label>
                <div className="relative">
                  <select
                    value={formData.bookingType}
                    onChange={(e) =>
                      handleInputChange("bookingType", e.target.value)
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white cursor-pointer appearance-none"
                    required>
                    <option value="">Select Booking Type</option>
                    {bookingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.bookingType === "flight"
                  ? "Departure and Destination"
                  : formData.bookingType === "hotel"
                  ? "Hotel/City"
                  : "Venue/Location"}
              </label>
              <input
                type="text"
                placeholder={
                  formData.bookingType === "flight"
                    ? "e.g., Dhaka to Bangkok"
                    : formData.bookingType === "hotel"
                    ? "e.g., Dhaka, Bangladesh"
                    : "e.g., Restaurant Name, Dhaka"
                }
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                required
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.bookingType === "flight"
                  ? "Travel Dates"
                  : formData.bookingType === "hotel"
                  ? "Stay Dates"
                  : "Event Dates"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {formData.bookingType === "flight" ? "Departure" : "Start"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.checkIn}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarOpen(
                          calendarOpen === "checkin" ? null : "checkin"
                        )
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      <Calendar className="h-4 w-4 cursor-pointer" />
                    </button>
                    {calendarOpen === "checkin" && <CalendarComponent />}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {formData.bookingType === "flight" ? "Return" : "End"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.checkOut}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarOpen(
                          calendarOpen === "checkout" ? null : "checkout"
                        )
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      <Calendar className="h-4 w-4 cursor-pointer" />
                    </button>
                    {calendarOpen === "checkout" && <CalendarComponent />}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium"
              disabled={loading}>
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
