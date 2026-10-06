import { useState, useEffect } from "react";
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useBooking, useSaveBooking } from "../../../hooks/useApi";
import { notify } from "../../../utils/notify";

const toTime = (dateString) => new Date(dateString).toTimeString().slice(0, 5);

export default function BookingForm() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const navigate = useNavigate();
  const { bookingId } = useParams(); // present when editing an existing booking
  const isEditing = Boolean(bookingId);

  const [formData, setFormData] = useState({
    bookingType: "",
    location: "",
    checkIn: formatDate(tomorrow),
    checkOut: formatDate(tomorrow),
    startTime: "10:00",
    endTime: "12:00",
  });
  const [calendarOpen, setCalendarOpen] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);

  const { data: booking, isLoading: bookingLoading, isError: bookingError } = useBooking(bookingId);
  const saveBooking = useSaveBooking();
  const loading = bookingLoading || saveBooking.isPending;

  const bookingTypes = [
    { value: "flight", label: "Flight Booking" },
    { value: "restaurant", label: "Restaurant Booking" },
    { value: "spa", label: "Spa Booking" },
    { value: "birthday", label: "Birthday Booking" },
    { value: "concert", label: "Concert Tickets Booking" },
    { value: "hotel", label: "Hotel Reservation" },
  ];

  // Prefill the form when editing
  useEffect(() => {
    if (!booking) return;
    const start = new Date(booking.booking_datetime);
    const end = booking.booking_end_date ? new Date(booking.booking_end_date) : start;
    setFormData({
      bookingType: booking.booking_type,
      location: booking.location || "",
      checkIn: formatDate(start),
      checkOut: formatDate(end),
      startTime: toTime(booking.booking_datetime),
      endTime: booking.booking_end_date ? toTime(booking.booking_end_date) : toTime(booking.booking_datetime),
    });
    setCurrentMonth(start);
  }, [booking]);

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
      if (date > checkOutDate) {
        handleInputChange("checkOut", formattedDate);
      }
    } else if (calendarOpen === "checkout") {
      handleInputChange("checkOut", formattedDate);
    }
    setCalendarOpen(null);
  };

  const combineDateTime = (dateString, timeString) => {
    const date = parseDate(dateString);
    const [hours, minutes] = (timeString || "00:00").split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (calendarOpen === "checkin") {
      return date < today;
    } else if (calendarOpen === "checkout") {
      // Same-day end is allowed (e.g. a restaurant or spa booking)
      return date < today || date < parseDate(formData.checkIn);
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
    setError(null);
    const start = combineDateTime(formData.checkIn, formData.startTime);
    const end = combineDateTime(formData.checkOut, formData.endTime);
    if (start <= new Date()) {
      setError("The booking start time must be in the future.");
      return;
    }
    if (end < start) {
      setError("The end time must be after the start time.");
      return;
    }

    try {
      const payload = {
        booking_type: formData.bookingType,
        location: formData.location,
        booking_datetime: start.toISOString(),
        booking_end_date: end.toISOString(),
      };
      await saveBooking.mutateAsync({ id: bookingId, payload });
      notify.success(
        isEditing ? "Booking updated" : "Booking created",
        "We'll remind you before it starts."
      );
      navigate("/booking-list");
    } catch (err) {
      // Show the first validation message from the backend if there is one
      const data = err.response?.data;
      const firstFieldError =
        data && typeof data === "object"
          ? Object.values(data).flat().find((msg) => typeof msg === "string")
          : null;
      setError(firstFieldError || "Failed to save booking. Please try again.");
      console.error(err);
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
                {isEditing ? "Edit Booking" : "Add New Booking"}
              </h2>
              <p className="text-sm text-gray-500">
                Ready? Let&apos;s finish the booking confirmation.
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
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {formData.bookingType === "flight" ? "Departure Time" : "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {formData.bookingType === "flight" ? "Return Time" : "End Time"}
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}

            {/* Error Message */}
            {bookingError && (
              <p className="text-red-500 text-sm text-center">Booking not found.</p>
            )}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium"
              disabled={loading || bookingError}>
              {isEditing ? "Save Changes" : "Confirm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
