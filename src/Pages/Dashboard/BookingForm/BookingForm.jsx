import { useState } from "react";
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingForm() {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    adults: 1,
    children: 0,
    checkIn: formatDate(today),
    checkOut: formatDate(twoDaysLater),
    bedType: "Single",
    specialRequests: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const incrementCount = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const decrementCount = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1),
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
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 p-2"
            >
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
                `}
              >
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
      <div className="border border-gray-300 rounded-xl p-4 w-full max-w-2xl shadow-sm bg-white/20">
        <div className="bg-[#F2F4F3] border border-gray-200 rounded-xl shadow-lg w-full relative">
          {/* Header */}
          <div className="p-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Booking Details
              </h2>
              <p className="text-sm text-gray-500">
                Ready? Let&#39;s finish the booking confirmation.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Name and Phone */}
            <div className="grid grid-cols-2 gap-4">
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
                />
              </div>
            </div>

            {/* Person Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Adult
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => decrementCount("adults")}
                      className="px-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center py-2 text-sm">
                      {formData.adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementCount("adults")}
                      className="px-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Child
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => decrementCount("children")}
                      className="px-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center py-2 text-sm">
                      {formData.children}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementCount("children")}
                      className="px-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exact dates for your stay
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Check-in
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
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <Calendar className="h-4 w-4 cursor-pointer" />
                    </button>
                    {calendarOpen === "checkin" && <CalendarComponent />}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.checkOut}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white "
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarOpen(
                          calendarOpen === "checkout" ? null : "checkout"
                        )
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <Calendar className="h-4 w-4 cursor-pointer" />
                    </button>
                    {calendarOpen === "checkout" && <CalendarComponent />}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Preference
                  </label>
                  <div className="relative">
                    <select
                      value={formData.bedType}
                      onChange={(e) =>
                        handleInputChange("bedType", e.target.value)
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white cursor-pointer appearance-none"
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Twin">Twin</option>
                      <option value="Queen">Queen</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bed type
                  </label>
                  <div className="relative">
                    <select
                      defaultValue="King"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none bg-white cursor-pointer appearance-none"
                    >
                      <option value="King">King</option>
                      <option value="Queen">Queen</option>
                      <option value="Double">Double</option>
                      <option value="Single">Single</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                placeholder="Talk about you additional requirements"
                value={formData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none resize-none"
              />
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
