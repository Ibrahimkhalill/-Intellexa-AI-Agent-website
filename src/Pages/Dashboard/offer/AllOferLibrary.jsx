import { useParams } from "react-router-dom";

const AllOferLibrary = () => {
  const { name } = useParams();

  const hotelOffers = [
    {
      id: 1,
      image:
        "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=",
      title: "Stay in Luxury: Book 5-Star Comfort at Unbeatable Prices!",
      description:
        "Relax in premium suites, enjoy rooftop pools, spa services, and world-class dining. Reserve now for exclusive discounts!",
      imageAlt: "Luxury hotel room with modern amenities",
    },
    {
      id: 2,
      image:
        "https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg",
      title: "Your Perfect City Escape — Rooms Starting at $49!",
      description:
        "Find cozy stays or luxury hotels within your budget. Book now & get free breakfast + Wi-Fi! Limited-time offer.",
      imageAlt: "Modern city hotel room",
    },
    {
      id: 3,
      image:
        "https://blupp.b-cdn.net/eroshotel/bbd0e739-682a-4e30-a1b0-aea296169f28/home-slider-2.jpg?quality=80",
      title: "Last-Minute Hotel Deals Near You — Save Big Today!",
      description:
        "Stay near top attractions and nightlife. Comfortable rooms, great service — everything you need for a perfect stay.",
      imageAlt: "Hotel exterior with pool",
    },
    {
      id: 4,
      image:
        "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=",
      title: "Stay in Luxury: Book 5-Star Comfort at Unbeatable Prices!",
      description:
        "Relax in premium suites, enjoy rooftop pools, spa services, and world-class dining. Reserve now for exclusive discounts!",
      imageAlt: "Luxury hotel room with modern amenities",
    },
    {
      id: 5,
      image:
        "https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg",
      title: "Your Perfect City Escape — Rooms Starting at $49!",
      description:
        "Find cozy stays or luxury hotels within your budget. Book now & get free breakfast + Wi-Fi! Limited-time offer.",
      imageAlt: "Modern city hotel room",
    },
    {
      id: 6,
      image:
        "https://blupp.b-cdn.net/eroshotel/bbd0e739-682a-4e30-a1b0-aea296169f28/home-slider-2.jpg?quality=80",
      title: "Last-Minute Hotel Deals Near You — Save Big Today!",
      description:
        "Stay near top attractions and nightlife. Comfortable rooms, great service — everything you need for a perfect stay.",
      imageAlt: "Hotel exterior with pool",
    },
  ];

  return (
    <div className="flex  bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Offer Library
            </h2>

            {/* Hotel List Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  All {name} List
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotelOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOferLibrary;
