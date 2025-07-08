import { useState } from "react";

const pricingPlans = [
  {
    id: "monthly",
    title: "Monthly",
    price: "$55",
    duration: "/mn",
    oldPrice: "$95",
    save: "$40",
    features: [
      "Automatic bot building",
      "Team collaboration",
      "Basic AI model training",
      "Multilingual AI",
      "Limited support access",
    ],
  },
  {
    id: "halfyear",
    title: "Half Year",
    price: "$255",
    duration: "/6mo",
    oldPrice: "$295",
    save: "$40",
    features: [
      "Automatic bot building",
      "Team collaboration",
      "Advanced AI model training",
      "Multilingual AI",
      "Draft comparison tool",
      "Inline comments & feedback",
    ],
  },
  {
    id: "yearly",
    title: "Yearly",
    price: "$555",
    duration: "/yr",
    oldPrice: "$695",
    save: "$140",
    features: [
      "Automatic bot building",
      "Full team collaboration",
      "Premium AI model training",
      "Multilingual AI with regional tuning",
      "Analytics dashboard access",
      "Admin custom guidelines",
      "Source authenticity validation",
    ],
  },
];
const PricingCards = () => {
  const [selected, setSelected] = useState("halfyear");

  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 px-4 py-10 bg-gradient-to-br from-gray-100 to-white rounded-2xl">
      {pricingPlans.map((plan) => {
        const isActive = selected === plan.id;

        return (
          <div
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`w-full max-w-sm rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl ${
              isActive ? "bg-[#0F172A] text-white" : "bg-white text-black"
            }`}
          >
            {/* Title Pill Button */}
            <div className="flex justify-center mt-4">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  isActive
                    ? "bg-white text-[#0F172A] border-white"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                <span className="rounded-full w-4 h-4 border-2 border-current flex items-center justify-center">
                  {isActive && (
                    <span className="w-2 h-2 bg-[#0F172A] rounded-full"></span>
                  )}
                </span>
                {plan.title}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex flex-col justify-between min-h-[460px]">
              {/* Price Section */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {plan.price}
                  <span className="text-base font-normal">{plan.duration}</span>
                </div>
                <div className="text-sm line-through text-gray-400">
                  {plan.oldPrice}
                </div>
                <div
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isActive ? "bg-white text-[#0F172A]" : "bg-black text-white"
                  }`}
                >
                  Save: {plan.save}
                </div>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-blue-500">●</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full mt-6 rounded-md text-sm font-semibold py-2 transition ${
                  isActive
                    ? "bg-white text-[#0F172A] hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PricingCards;
