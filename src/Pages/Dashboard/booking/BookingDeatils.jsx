const BookingDeatils = () => {
  return (
    <div className="flex items-start justify-center h-screen bg-gray-50 relative">
      <div className="w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
        <div className="flex space-x-8">
          {/* Trip Details */}
          <div className="w-1/2 bg-white p-6 rounded-3xl shadow-lg">
            <div className="space-y-4">
              <div className="w-full p-2 border rounded-lg border-gray-300">
                <label className="block text-gray-300 text-sm">Hotel</label>
                <input
                  type="text"
                  value="Royal Garden Hotel"
                  className="w-full"
                  readOnly
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2 p-2 border rounded-lg border-gray-300">
                  <label className="block text-gray-300 text-sm">Dates</label>
                  <input
                    type="text"
                    value="Sep 15-22, 2025"
                    className="w-full"
                    readOnly
                  />
                </div>
                <div className="w-1/2 p-2 border rounded-lg border-gray-300">
                  <label className="block text-gray-300 text-sm">Guests</label>
                  <input
                    type="text"
                    value="3 Guests"
                    className="w-full"
                    readOnly
                  />
                </div>
              </div>
              <div className="w-1/2 p-2 border rounded-lg border-gray-300">
                <label className="block text-gray-300 text-sm">E-mail</label>
                <input
                  type="email"
                  value="deanna.curts@example.com"
                  className="w-full"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="w-1/2 bg-white p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Price details</h3>
            <div className="space-y-2 border border-[#E2E2E2] rounded-2xl p-4 ">
              <div className="flex justify-between">
                <span className="text-gray-400">$120 × 5 night</span>
                <span>$600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">10% campaign discount</span>
                <span>-$60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service fee</span>
                <span>$40</span>
              </div>
              <hr className="border-t border-gray-300 my-4" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>$580</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="rounded-3xl shadow mt-8 p-6 bg-white/30 w-1/3 mx-auto">
          <div className="text-center bg-white border border-gray-100 p-7 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-7">
              Please confirm or cancel this booking from the list.
            </p>
            <div className="space-x-4">
              <button className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 duration-300">
                Cancel to booking
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-700 duration-300">
                Confirm to booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDeatils;
