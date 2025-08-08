

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import RentalCard from "./RentalCards";
import { Link } from "react-router-dom";

const FeaturedRentals = ({ filteredProducts, selectedLocation, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("🔄 FeaturedRentals useEffect triggered");
        console.log("📦 filteredProducts:", filteredProducts);
        console.log("📍 selectedLocation:", selectedLocation);
        
        // If we have filtered products from Hero search, use them
        if (filteredProducts && filteredProducts.length > 0) {
          console.log("✅ Using filtered products:", filteredProducts.length);
          setProducts(filteredProducts.slice(0, 4)); // Limit to 4 for featured
          setLoading(false);
          return;
        }
        
        // If location is selected but no products found, show empty state
        if (selectedLocation && filteredProducts && filteredProducts.length === 0) {
          console.log("⚠️ Location selected but no products found");
          setProducts([]);
          setLoading(false);
          return;
        }
        
        // Default behavior: fetch featured products when no location is selected
        if (!selectedLocation) {
          console.log("🏠 Loading default products (no location selected)");
          const q = query(
            collection(db, "products"),
            orderBy("createdAt", "desc"),
            limit(4)
          );

          const querySnapshot = await getDocs(q);
          const productsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("📋 Default products loaded:", productsData.length);
          setProducts(productsData);
        } else {
          // If location is selected but filteredProducts is null/undefined, keep loading
          console.log("⏳ Location selected but no filtered products yet, keeping loading state");
        }
      } catch (error) {
        console.error("❌ Error fetching products: ", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filteredProducts, selectedLocation, searchTerm]);

  const getHeaderText = () => {
    if (selectedLocation) {
      return `Featured Rentals in ${selectedLocation}`;
    }
    return "Featured Rentals";
  };

  console.log("🎯 Current products to display:", products.length);

  return (
    <div className="mt-6 mb-12">
      {/* Header with View All link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{getHeaderText()}</h2>
        <Link
          to="/all-products"
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
        </Link>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

  

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2v4M12 18v4m-6-6h4m8 0h4m-5.293-5.293l2.828 2.828M5.707 5.707L8.535 8.535m9.192 9.192l2.828-2.828M5.707 18.707L8.535 15.879"
            />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <RentalCard
                  item={{
                    id: product.id,
                    title: product.productName || "Unnamed Product",
                    category: product.category || "Uncategorized",
                    location: product.warehouseLocation || "Unknown Location",
                    price: product.price || 0,
                    priceUnit: "day",
                    rating: product.rating || 0,
                    image: product.imageLinks?.[0] || "/Images/DSLR.png",
                  }}
                />
              </Link>
            ))
          ) : selectedLocation ? (
            <p className="text-center text-gray-500 col-span-full">
              No products available in {selectedLocation}.
            </p>
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedRentals;




