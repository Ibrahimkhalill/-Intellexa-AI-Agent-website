import React from "react";
import { ArrowRight } from "lucide-react";
import flightImg from "../../../assets/images/flight.svg";
import flightImg1 from "../../../assets/images/fliegt_book.svg";
import restaurantImg from "../../../assets/images/restaurant.svg";
import spaImg from "../../../assets/images/Spa.svg";
import birthdayImg from "../../../assets/images/birthday.svg";
import concertImg from "../../../assets/images/concert.svg";
import emailImg from "../../../assets/images/email.svg";
import hotelImg from "../../../assets/images/hotel.svg";
import aiImg from "../../../assets/images/ChatGPT.svg";
import documentImg from "../../../assets/images/Live.svg";
import BookNow from "../../../assets/images/BookNow.svg";
import Hotel_book from "../../../assets/images/Hotel_book.svg";
import Birthday_book from "../../../assets/images/birthday_books.svg";
import res from "../../../assets/images/res.svg";
import { useNavigate } from "react-router-dom";

const AutomationAiSupport = () => {
  const navigate = useNavigate();
  const automationTemplates = [
    {
      title: "Flight Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [flightImg, aiImg, flightImg1],
      link: "/ai_search",
    },
    {
      title: "Restaurant Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [restaurantImg, aiImg, Hotel_book],
      link: "/ai_search",
    },
    {
      title: "Spa Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [spaImg, aiImg, BookNow],
      link: "/ai_search",
    },
    {
      title: "Birthday Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [birthdayImg, aiImg, Birthday_book],
      link: "/ai_search",
    },
    {
      title: "Concert Tickets Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [concertImg, aiImg, documentImg],
      link: "/ai_search",
    },

    {
      title: "Spa Booking",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [spaImg, aiImg, BookNow],
      link: "/ai_search",
    },

    {
      title: "Email Automation",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [emailImg, aiImg, emailImg],
      link: "/email-automation",
    },
    {
      title: "Hotel Reservation",
      description:
        "Summarize emails with Gmail and OpenAI, then send the summaries to the client.",
      icons: [hotelImg, aiImg, res],
      link: "/ai_search",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Automation Templates Grid */}
        <div className="grid grid-cols-4 gap-6">
          {automationTemplates.map((template, index) => (
            <div
              key={index}
              onClick={() => template.link && navigate(template.link)}
              className="bg-[#F5F4F0] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                {template.icons.map((image, iconIndex) => (
                  <React.Fragment key={iconIndex}>
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
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
        </div>
      </div>
    </div>
  );
};

export default AutomationAiSupport;
