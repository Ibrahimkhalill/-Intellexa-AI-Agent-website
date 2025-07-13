import { ChevronRight } from "lucide-react";
import AutomationAiSupport from "../Worlflow/AutomationAiSupport";

const HomePage = () => {
  const workflowData = [
    {
      id: 1,
      created: "04/15/2024",
      booking: "Email Automation",
      bookingDate: "Sep 15-22, 2025",
      guests: 3,
      status: "Processing",
    },
    {
      id: 2,
      created: "04/15/2024",
      booking: "Hotel Reservation",
      bookingDate: "Jul 22-28, 2025",
      guests: 5,
      status: "Processing",
    },
    {
      id: 3,
      created: "04/15/2024",
      booking: "Email Automation",
      bookingDate: "Aug 12-15, 2025",
      guests: 12,
      status: "Cancel",
    },
    {
      id: 4,
      created: "04/15/2024",
      booking: "Spa Booking",
      bookingDate: "Sep 17-23, 2025",
      guests: 8,
      status: "Confirm",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "text-yellow-600 bg-yellow-50";
      case "Cancel":
        return "text-red-600 bg-red-50";
      case "Confirm":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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

  return (
    <div className="min-h-screen  flex">
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
                    <th className="px-6 py-4">
                      Created
                    </th>
                    <th className="px-6 py-4">
                      Booking
                    </th>
                    <th className="px-6 py-4">
                      Booking date
                    </th>
                    <th className="px-6 py-4">
                      Guests
                    </th>
                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workflowData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.booking}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.bookingDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.guests} Guest{row.guests !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

        {/* Automation Templates Grid */}
        <AutomationAiSupport/>
        {/* <div className="grid grid-cols-4 gap-6">
          {automationTemplates.map((template, index) => (
            <div
              key={index}
              className="bg-[#F5F4F0] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                {template.icons.map((image, iconIndex) => (
                  <React.Fragment key={iconIndex}>
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                      <img
                        src={image}
                        alt={`${template.title} icon ${iconIndex + 1}`}
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    {iconIndex < template.icons.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {template.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {template.description}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
