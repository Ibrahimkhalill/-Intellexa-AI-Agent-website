import { Link } from 'react-router-dom';

const OfferLibrary = () => {
  

  const hotelOffers = [
    {
      id: 1,
      image: 'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
      title: 'Stay in Luxury: Book 5-Star Comfort at Unbeatable Prices!',
      description: 'Relax in premium suites, enjoy rooftop pools, spa services, and world-class dining. Reserve now for exclusive discounts!',
      imageAlt: 'Luxury hotel room with modern amenities'
    },
    {
      id: 2,
      image: 'https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg',
      title: 'Your Perfect City Escape — Rooms Starting at $49!',
      description: 'Find cozy stays or luxury hotels within your budget. Book now & get free breakfast + Wi-Fi! Limited-time offer.',
      imageAlt: 'Modern city hotel room'
    },
    {
      id: 3,
      image: 'https://blupp.b-cdn.net/eroshotel/bbd0e739-682a-4e30-a1b0-aea296169f28/home-slider-2.jpg?quality=80',
      title: 'Last-Minute Hotel Deals Near You — Save Big Today!',
      description: 'Stay near top attractions and nightlife. Comfortable rooms, great service — everything you need for a perfect stay.',
      imageAlt: 'Hotel exterior with pool'
    }
  ];

  const restaurantOffers = [
    {
      id: 1,
      image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      title: 'Taste the Best — Fresh Flavors Delivered to Your Table!',
      description: 'Indulge in delicious meals crafted by expert chefs. From farm-fresh ingredients to international delights — satisfaction guaranteed.',
      imageAlt: 'Fine dining experience with wine'
    },
    {
      id: 2,
      image: 'https://lesroches.edu/wp-content/uploads/2022/08/Restaurant_business_plan_main.jpg',
      title: 'Dine Like Never Before — Book Your Table Now!',
      description: 'Reserve your spot at the city\'s top-rated restaurant. Family-friendly, vegan options, and irresistible desserts!',
      imageAlt: 'People dining at restaurant'
    },
    {
      id: 3,
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/56/71/59/atmosphere.jpg?w=600&h=-1&s=1',
      title: 'Savor Every Bite: Local Favorites & Chef Specials Await!',
      description: 'Authentic taste, cozy ambiance, and a menu loved by locals. Try our signature dishes today!',
      imageAlt: 'Chef preparing food in kitchen'
    }
  ];

  const OfferCard = ({ offer }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
  );

  return (
    <div className="flex  bg-gray-50">
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Offer Library</h2>
            
            {/* Hotel List Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hotel List</h3>
                <Link to={"/offer-libray/Hotel"} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  See all
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotelOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>

            {/* Restaurant List Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Restaurant List</h3>
                <Link to={"/offer-libray/Restaurant"} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  See all
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLibrary;