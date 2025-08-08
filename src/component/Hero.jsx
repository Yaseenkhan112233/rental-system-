// import React from "react";

// const Hero = () => {
//   return (
//     <div className="relative bg-blue-500 overflow-hidden">
//       <div className="absolute inset-0">
//         <img
//           src="/Images/FRAME.png"
//           alt="People renting items"
//           className="w-full h-full object-cover opacity-60"
//         />
//         <div className="absolute inset-0 bg-blue-500 mix-blend-multiply"></div>
//       </div>
//       <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
//           Rent Anything, Anywhere
//         </h1>
//         <p className="mt-6 max-w-lg mx-auto text-xl text-white text-center">
//           Find the perfect items for your next project or adventure
//         </p>
//         <div className="mt-10 max-w-xl mx-auto">
//           <div className="mt-1 flex rounded-md shadow-sm bg-white">
//             <div className="relative flex items-stretch flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-5 w-5 text-gray-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 py-3"
//                 placeholder="What are you looking for?"
//               />
//             </div>
//             <div className="relative flex items-stretch flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-5 w-5 text-gray-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 className="focus:ring-blue-500 focus:border-blue-500 block w-full border-l border-gray-300 pl-10 sm:text-sm py-3"
//                 placeholder="Location"
//               />
//             </div>
//             <button
//               type="button"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/Firebase";

const Hero = ({ onSearchResults }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocationChange = async (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    
    if (!location) {
      // If "Select Location" is selected, pass empty results to show default products
      if (onSearchResults) {
        onSearchResults([], "", "");
      }
      return;
    }

    setLoading(true);
    
    try {
      console.log("🔍 Searching for location:", location);
      
      // First, let's get ALL products to see what we have
      const allProductsQuery = query(collection(db, "products"));
      const allSnapshot = await getDocs(allProductsQuery);
      
      console.log("📋 ALL PRODUCTS IN DATABASE:");
      allSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, warehouseLocation: "${data.warehouseLocation}", productName: "${data.productName}"`);
      });
      
      // Query products by warehouse location
      const q = query(
        collection(db, "products"),
        where("warehouseLocation", "==", location)
      );
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      console.log(`📦 PRODUCTS MATCHING "${location}":`);
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        console.log("✅ Product found:", {
          id: doc.id,
          productName: productData.productName,
          warehouseLocation: productData.warehouseLocation
        });
        results.push({ id: doc.id, ...productData });
      });
      
      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults(results, "", location);
      }
      
      console.log(`🎯 Found ${results.length} products in ${location}`);
      
      if (results.length === 0) {
        console.log("⚠️ No products found! Check if:");
        console.log("1. Products exist with warehouseLocation field");
        console.log("2. The value exactly matches:", location);
      }
      
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      alert("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-blue-500 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/Images/FRAME.png"
          alt="People renting items"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-blue-500 mix-blend-multiply"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
          Rent Anything, Anywhere
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-white text-center">
          Find the perfect items for your next project or adventure
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <div className="mt-1 flex rounded-md shadow-sm bg-white">
            <div className="relative flex items-stretch flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                disabled={loading}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md pl-10 pr-3 sm:text-sm py-3 bg-white border-gray-300 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <option value="">Select Location</option>
                <option value="warehouse1">Warehouse 1</option>
                <option value="warehouse2">Warehouse 2</option>
                <option value="warehouse3">Warehouse 3</option>
                {/* Add more warehouse locations as needed */}
              </select>
            </div>
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;