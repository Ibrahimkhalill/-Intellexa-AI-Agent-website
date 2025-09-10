import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OfferLibrary = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch offers from the API
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://wbsl64n9-8005.inc1.devtunnels.ms/offers-api/offers"
        );
        // Generate shortId for each offer
        const enhancedOffers = response.data.offers.map((offer, index) => ({
          ...offer,
          shortId: offer.id.split("/").pop() || `offer-${index}`, // Extract last segment of URL or use index
        }));
        setOffers(enhancedOffers || []);
      } catch (err) {
        setError("Failed to fetch offers. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Group offers by category
  const groupedOffers = offers.reduce((acc, offer) => {
    const category = offer.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(offer);
    return acc;
  }, {});

  const OfferCard = ({ offer }) => (
    <Link to={`/booking/${offer.shortId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-64 flex flex-col">
        <div className=" bg-gray-200 relative overflow-hidden">
          <img
            src={
              offer.image_url ||
              "https://blupp.b-cdn.net/eroshotel/bbd0e739-682a-4e30-a1b0-aea296169f28/home-slider-2.jpg?quality=80"
            }
            alt={offer.imageAlt || "Offer image"}
            className="w-full h-[50vh] object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight line-clamp-2">
            {offer.title}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed flex-1 line-clamp-3">
            {offer.summary}
          </p>
          <p className="text-gray-500 font-medium text-xs mt-2">
            Location: {offer.location}
          </p>
          {offer.url && (
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
              Visit Website
            </a>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Offer Library
            </h2>

            {loading ? (
              <div className="flex items-center h-[80vh] justify-center ">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-sm mt-4">
                    Loading offers...
                  </span>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : Object.keys(groupedOffers).length === 0 ? (
              <p className="text-gray-600 text-center">No offers available.</p>
            ) : (
              Object.keys(groupedOffers).map((category) => (
                <div key={category} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.replace(/([A-Z])/g, " $1").trim()} Offers
                    </h3>
                    <Link
                      to={`/offer-library/${category}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      See all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedOffers[category].map((offer) => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OfferLibrary;
