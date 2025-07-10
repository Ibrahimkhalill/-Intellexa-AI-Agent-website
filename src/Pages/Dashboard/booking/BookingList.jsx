import { useState } from 'react';
import { Settings } from 'lucide-react';
import BookingDetailsModal from '../../../components/modal/BookingDetailsModal';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {


  const bookings = [
    { id: 1, created: '04/15/2024', booking: 'Restaurant Booking', date: 'Sep 15-22, 2025', guests: 3, status: 'Processing' },
    { id: 2, created: '04/15/2024', booking: 'Restaurant Booking', date: 'Sep 15-22, 2025', guests: 3, status: 'Processing' },
    { id: 3, created: '04/15/2024', booking: 'Spa Booking', date: 'Aug 12-15, 2025', guests: 12, status: 'Cancel' },
    { id: 4, created: '04/15/2024', booking: 'Spa Booking', date: 'Sep 17-23, 2025', guests: 8, status: 'Confirm' },
    { id: 5, created: '04/15/2024', booking: 'Hotel Reservation', date: 'Jul 22-28, 2025', guests: 5, status: 'Processing' },
    { id: 6, created: '04/15/2024', booking: 'Spa Booking', date: 'Aug 12-15, 2025', guests: 12, status: 'Cancel' },
    { id: 7, created: '04/15/2024', booking: 'Spa Booking', date: 'Sep 17-23, 2025', guests: 8, status: 'Confirm' },
    { id: 8, created: '04/15/2024', booking: 'Spa Booking', date: 'Sep 17-23, 2025', guests: 8, status: 'Confirm' },
    { id: 9, created: '04/15/2024', booking: 'Restaurant Booking', date: 'Sep 15-22, 2025', guests: 3, status: 'Processing' },
    { id: 10, created: '04/15/2024', booking: 'Spa Booking', date: 'Sep 17-23, 2025', guests: 8, status: 'Confirm' },
    { id: 11, created: '04/15/2024', booking: 'Spa Booking', date: 'Aug 12-15, 2025', guests: 12, status: 'Cancel' },
    { id: 12, created: '04/15/2024', booking: 'Spa Booking', date: 'Sep 17-23, 2025', guests: 8, status: 'Confirm' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirm':
        return 'text-green-600';
      case 'Cancel':
        return 'text-red-600';
      case 'Processing':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()


  const handleNavigate = ()=>{
   
    navigate("/booking-deatils")

  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Booking List</h2>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Booking List</h3>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>

              {/* Table */}
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
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" onClick={()=>handleNavigate()}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (

     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: "black", opacity: 0.5}}></div>
      )}
      <BookingDetailsModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  );
};

export default BookingList;