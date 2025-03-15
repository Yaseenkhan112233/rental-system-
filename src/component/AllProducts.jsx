import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Fetch all products from Firestore
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Create a query to fetch all products ordered by createdAt
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and filter options */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex items-center">
          <button className="p-2 border rounded-l">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
            </svg>
          </button>
          <button
            className={`p-2 border ${
              viewMode === "grid" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setViewMode("grid")}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
          <button
            className={`p-2 border rounded-r ${
              viewMode === "list" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img
                      src={product.imageLinks?.[0] || "/Images/DSLR.png"}
                      alt={product.productName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-blue-500">
                      {product.category || "Electronics"}
                    </p>
                    <h3 className="text-lg font-medium text-gray-900 mt-1">
                      {product.productName || "Unnamed Product"}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      ${product.price || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Stock: {product.stockQuantity || 10}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-64">
              <p className="text-center text-gray-500">
                No products available.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
