import React, { useState } from 'react';
import { Home, MessageSquare, Workflow, BookOpen, User, LogOut, Filter, Settings } from 'lucide-react';


const BookingDeatils = () => {




  return (
    <div className="flex items-start justify-center h-screen bg-gray-50 relative">
      {/* Sidebar */}
     

{/* Main Content */}
          <div className="w-4/5 p-8">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
            <div className="flex space-x-8">
              {/* Trip Details */}
              <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Your trip</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600">Hotel</label>
                    <input type="text" value="Royal Garden Hotel" className="w-full p-2 border rounded" readOnly />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-600">Dates</label>
                      <input type="text" value="Sep 15-22, 2025" className="w-full p-2 border rounded" readOnly />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-600">Guests</label>
                      <input type="text" value="3 Guests" className="w-full p-2 border rounded" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600">E-mail</label>
                    <input type="email" value="deanna.curts@example.com" className="w-full p-2 border rounded" readOnly />
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Price details</h3>
                <div className="space-y-2 border border-[#E2E2E2] rounded-2xl p-4 ">
                  <div className="flex justify-between">
                    <span className='text-[#E2E2E2]'>$120 × 5 night</span>
                    <span>$600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className='text-[#E2E2E2]'>10% campaign discount</span>
                    <span>-$60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className='text-[#E2E2E2]'>Service fee</span>
                    <span>$40</span>
                  </div>
                  <hr className="border-t border-gray-100 my-4" />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>$580</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 text-center bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 mb-4">Please confirm or cancel this booking from the list.</p>
              <div className="space-x-4">
                <button className="px-4 py-2 bg-gray-200 rounded">Cancel to booking</button>
                <button className="px-4 py-2 bg-black text-white rounded">Confirm to booking</button>
              </div>
            </div>
          </div>
     
    </div>
  );
};

export default BookingDeatils;