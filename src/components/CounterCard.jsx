import React from "react";

const CounterCard = ({ title, value, count }) => {
  return (
    <div className="border border-base-300 bg-base-300 rounded-2xl p-4 flex-1">
      
      <div className="border-b border-gray-300 pb-3 text-gray-700 flex items-center justify-between">
        <h4 className="">{title}</h4>
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold">{count}</span>
      </div>

      <div className="flex items-center text-sm mt-5">
        <span className="text-gray-500"> +{value} From Last Week</span>
      </div>
    </div>
  );
};

export default CounterCard;
