// import React, { useEffect, useState } from "react";
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
// import { db } from "../firebase/Firebase";
// import RentalCard from "./RentalCards";
// import { Link } from "react-router-dom";

// const FeaturedRentals = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const q = query(
//           collection(db, "products"),
//           orderBy("createdAt", "desc"),
//           limit(4)
//         );

//         const querySnapshot = await getDocs(q);
//         const productsData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setProducts(productsData);
//       } catch (error) {
//         console.error("Error fetching products: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="mt-6 mb-12">
//       {/* Header with View All link updated to use React Router */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">Featured Rentals</h2>
//         <Link
//           to="/all-products"
//           className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
//         >
//           View all
//           <svg
//             className="ml-1 w-4 h-4"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </Link>
//       </div>

//       {/* Product Grid */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading products...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link to={`/product/${product.id}`} key={product.id}>
//                 <RentalCard
//                   item={{
//                     id: product.id,
//                     title: product.productName || "Unnamed Product",
//                     category: product.category || "Uncategorized",
//                     location: product.warehouseLocation || "Unknown Location",
//                     price: product.price || 0,
//                     priceUnit: "day",
//                     rating: product.rating || 0,
//                     image: product.imageLinks?.[0] || "/Images/DSLR.png",
//                   }}
//                 />
//               </Link>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products available.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeaturedRentals;

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import RentalCard from "./RentalCards";
import { Link } from "react-router-dom";

const FeaturedRentals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Failed to load products. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mt-6 mb-12">
      {/* Header with View All link updated to use React Router */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Rentals</h2>
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
