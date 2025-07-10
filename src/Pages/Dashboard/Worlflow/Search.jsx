"use client"

import { useState } from "react"
import { Mic, Users, Bed } from "lucide-react"

const hotelData = [
  {
    id: 1,
    name: "Hotel Silver Shine",
    type: "Apartment or Condo",
    guests: 3,
    beds: 2,
    price: 520.0,
    image: "/hotel-room-1.jpg",
  },
  {
    id: 2,
    name: "Hotel Silver Shine",
    type: "Apartment or Condo",
    guests: 3,
    beds: 2,
    price: 520.0,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&fit=crop",
  },
  {
    id: 3,
    name: "Hotel Silver Shine",
    type: "Apartment or Condo",
    guests: 3,
    beds: 2,
    price: 520.0,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&h=120&fit=crop",
  },
]

export default function Search() {
  const [searchText, setSearchText] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchText(value)
    setShowSuggestions(value.length > 0)
  }

  const handleExplore = () => {
    if (searchText.trim()) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Search Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center flex-1 gap-3">
              <Mic className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ask any think"
                value={searchText}
                onChange={handleInputChange}
                className="flex-1 bg-transparent border-0 outline-none text-base placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleExplore}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 py-2 font-medium text-sm transition-colors"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Hotel Suggestions */}
        {showSuggestions && (
          <div className="space-y-4">
            {hotelData.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Hotel Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="rounded-lg object-cover w-[120px] h-[120px]"
                      />
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{hotel.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{hotel.type}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{hotel.guests}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{hotel.beds}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">${hotel.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">/night</div>
                      </div>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 py-2 mt-2 font-medium text-sm transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
