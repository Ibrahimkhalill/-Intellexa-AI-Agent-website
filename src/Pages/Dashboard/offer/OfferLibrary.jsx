import { useState } from "react";
import { useOffers } from "../../../hooks/useApi";

const FALLBACK_IMAGE =
  "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";

// Only link out when the offer has a real external URL
const getOfferLink = (offer) => {
  const link = offer.url || offer.offer_url || offer.link || offer.source_url;
  return typeof link === "string" && /^https?:\/\//.test(link) ? link : null;
};

// Defined outside OfferLibrary so it isn't re-created (and its popup state
// reset) every time the page re-renders
const OfferCard = ({ offer }) => {
  const [showPopup, setShowPopup] = useState(false);
  const link = getOfferLink(offer);
  const summary = offer.summary || "";

  return (
    <div className="block group">
      <div
        onClick={() => setShowPopup(true)}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg h-96 flex flex-col cursor-pointer">
        <div className="relative h-60 overflow-hidden">
          <img
            src={offer.image_url || FALLBACK_IMAGE}
            onError={(e) => {
              e.target.onerror = null; // prevents infinite loop
              e.target.src = FALLBACK_IMAGE;
            }}
            alt={offer.imageAlt || "Offer image"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
            {offer.title}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-3">
            {summary.length > 100 ? `${summary.substring(0, 100)}...` : summary}
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium text-sm">{offer.location}</p>
            {offer.offer_price && offer.currency && (
              <p className="text-green-600 font-semibold text-sm">
                {offer.currency} {offer.offer_price}
              </p>
            )}
          </div>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
              Explore Offer
            </a>
          )}
        </div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}>
          <div
            className="bg-white p-6 rounded-lg max-w-md"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-900 mb-3">{offer.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{summary}</p>
            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowPopup(false)}>
                Close
              </button>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  Explore Offer
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OfferLibrary = () => {
  const { data: offers = [], isLoading: loading, isError } = useOffers();
  const error = isError ? "Failed to fetch offers. Please try again." : null;

  // Group offers by category
  const groupedOffers = offers.reduce((acc, offer) => {
    const category = offer.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(offer);
    return acc;
  }, {});

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-8xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Offer Library
            </h2>

            {loading ? (
              <div className="flex items-center h-[80vh] justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-sm mt-4">
                    Loading offers...
                  </span>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center text-lg">{error}</p>
            ) : Object.keys(groupedOffers).length === 0 ? (
              <p className="text-gray-600 text-center text-lg">
                No offers available.
              </p>
            ) : (
              Object.keys(groupedOffers).map((category) => (
                <div key={category} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.replace(/([A-Z])/g, " $1").trim()} Offers
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedOffers[category].map((offer, index) => (
                      <OfferCard key={offer.id ?? `offer-${index}`} offer={offer} />
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
