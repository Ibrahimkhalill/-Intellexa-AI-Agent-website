import React from 'react';
import { 
  Home, 
  MessageCircle, 
  Workflow, 
  User, 
  LogOut,
  ChevronRight,
  Mail,
  Calendar,
  FileText,
  Plane,
  UtensilsCrossed,
  Sparkles,
  PartyPopper,
  Music,
  Hotel,
  ArrowRight
} from 'lucide-react';
import flightImg from '../../../assets/images/flight.svg';
import flightImg1 from '../../../assets/images/fliegt_book.svg';
import restaurantImg from '../../../assets/images/restaurant.svg';
import spaImg from '../../../assets/images/Spa.svg';
import birthdayImg from '../../../assets/images/birthday.svg';
import concertImg from '../../../assets/images/concert.svg';
import emailImg from '../../../assets/images/email.svg';
import hotelImg from '../../../assets/images/hotel.svg';
import aiImg from '../../../assets/images/ChatGPT.svg';
import documentImg from '../../../assets/images/Live.svg';
import BookNow from '../../../assets/images/BookNow.svg';
import fliegt_book from '../../../assets/images/fliegt_book.svg';
import Hotel_book from '../../../assets/images/Hotel_book.svg';
import Birthday_book from '../../../assets/images/birthday_books.svg';
import res from '../../../assets/images/res.svg';

const HomePage = () => {
  const workflowData = [
    { name: 'Email Automation', status: 'Active', created: '04/15/2024', statusColor: 'text-green-500' },
    { name: 'Hotel Reservation', status: 'Active', created: '04/15/2024', statusColor: 'text-green-500' },
    { name: 'Email Automation', status: 'Inactive', created: '04/15/2024', statusColor: 'text-gray-500' },
    { name: 'Document Processing', status: 'Processing', created: '04/15/2024', statusColor: 'text-blue-500' }
  ];

  const recentActivity = [
    { name: 'Email Automation', created: '04/15/2024' },
    { name: 'Email Automation', created: '04/15/2024' },
    { name: 'Email Automation', created: '04/15/2024' },
    { name: 'Email Automation', created: '04/15/2024' }
  ];

  const automationTemplates = [
     {
       title: 'Flight Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [flightImg, aiImg, flightImg1]
     },
     {
       title: 'Restaurant Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [restaurantImg, aiImg, Hotel_book]
     },
     {
       title: 'Spa Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [spaImg, aiImg, BookNow]
     },
     {
       title: 'Birthday Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [birthdayImg, aiImg, Birthday_book]
     },
     {
       title: 'Concert Tickets Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [concertImg, aiImg, documentImg]
     },
   
     {
       title: 'Spa Booking',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [spaImg, aiImg, BookNow]
     },
    
     {
       title: 'Email Automation',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [emailImg, aiImg, emailImg]
     },
     {
       title: 'Hotel Reservation',
       description: 'Summarize emails with Gmail and OpenAI, then send the summaries to the client.',
       icons: [hotelImg, aiImg, res]
     }
   ];

  return (
    <div className="min-h-screen  flex">
      {/* Sidebar */}
  
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Workflow Overview */}
          <div className="bg-gradient-to-r from-[#FAF4EA] to-white rounded-lg shadow-lg border border-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Workflow Overview</h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 py-2 text-sm font-medium text-gray-500 border-b">
                <span>Name</span>
                <span>Status</span>
                <span>Created</span>
              </div>
              {workflowData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 text-sm">
                  <span className="text-gray-900">{item.name}</span>
                  <span className={item.statusColor}>{item.status}</span>
                  <span className="text-gray-500">{item.created}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-r from-[#FAF4EA] to-white rounded-lg shadow-lg border border-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4 py-2 text-sm font-medium text-gray-500 border-b">
                <span>Name</span>
                <span>Created</span>
              </div>
              {recentActivity.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 py-3 text-sm">
                  <span className="text-gray-900">{item.name}</span>
                  <span className="text-gray-500">{item.created}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Templates Grid */}
        <div className="grid grid-cols-4 gap-6">
          {automationTemplates.map((template, index) => (
            <div key={index} className="bg-[#F5F4F0] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
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
              <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;