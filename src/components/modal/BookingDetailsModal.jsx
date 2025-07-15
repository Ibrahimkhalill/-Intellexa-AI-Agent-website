import { useState } from 'react';
import { X, Minus, Plus, ChevronDown, Calendar } from 'lucide-react';

const BookingDetailsModal = ({isOpen, setIsOpen}) => {
  
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    checkIn: '12-09-2025',
    checkOut: '16-09-2025',
    roomPreference: 'Single',
    bedType: 'King',
    specialRequests: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountChange = (type, operation) => {
    if (type === 'adult') {
      setAdultCount(prev => operation === 'increment' ? prev + 1 : Math.max(1, prev - 1));
    } else {
      setChildCount(prev => operation === 'increment' ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleConfirm = () => {
    console.log('Booking confirmed:', { ...formData, adultCount, childCount });
    alert('Booking confirmed successfully!');
  };

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-8 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-gray-500 mt-1">Provide your information for booking confirmation</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-8 pb-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
              <input
                type="tel"
                placeholder="Mobile number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Person Count */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Person</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-gray-700 font-medium">Adult</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleCountChange('adult', 'decrement')}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{adultCount}</span>
                  <button
                    onClick={() => handleCountChange('adult', 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-gray-700 font-medium">Child</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleCountChange('child', 'decrement')}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{childCount}</span>
                  <button
                    onClick={() => handleCountChange('child', 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Exact dates for your stay</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-2">Check-in</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-2">Check-out</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Room Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Room Preference</label>
              <div className="relative">
                <select
                  value={formData.roomPreference}
                  onChange={(e) => handleInputChange('roomPreference', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Bed Type</label>
              <div className="relative">
                <select
                  value={formData.bedType}
                  onChange={(e) => handleInputChange('bedType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="King">King</option>
                  <option value="Queen">Queen</option>
                  <option value="Twin">Twin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Special Requests</label>
            <textarea
              placeholder="Talk about you additional requirements"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end">
            <button
              onClick={handleConfirm}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;