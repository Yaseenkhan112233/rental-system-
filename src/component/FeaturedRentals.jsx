import React from "react";
import RentalCard from "./RentalCards";

const FeaturedRentals = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Professional DSLR Camera",
      category: "Electronics",
      location: "San Francisco, CA",
      price: 45,
      priceUnit: "day",
      rating: 4.8,
      image: "/Images/DSLR.png",
    },
    {
      id: 2,
      title: "Mountain Bike",
      category: "Sports",
      location: "Denver, CO",
      price: 25,
      priceUnit: "day",
      rating: 4.9,
      image: "/Images/cycle.png",
    },
    {
      id: 3,
      title: "Power Tools Set",
      category: "Tools",
      location: "Austin, TX",
      price: 35,
      priceUnit: "day",
      rating: 4.7,
      image: "/Images/drill.png",
    },
    {
      id: 4,
      title: "Modern Sofa",
      category: "Furniture",
      location: "Seattle, WA",
      price: 50,
      priceUnit: "day",
      rating: 4.6,
      image: "/Images/modersofa.png",
    },
  ];

  return (
    <div className="mt-6 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Rentals</h2>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          View all
          <svg
            className="ml-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredItems.map((item) => (
          <RentalCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRentals;
