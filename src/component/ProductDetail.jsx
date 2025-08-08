

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase/Firebase";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      if (!product) return;

      setLoadingSuggestions(true);
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", product.category || "Electronics"),
          where("__name__", "!=", productId),
          limit(4)
        );

        const querySnapshot = await getDocs(q);
        const suggestedProductsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (suggestedProductsData.length < 4) {
          const additionalQ = query(
            collection(db, "products"),
            where("__name__", "!=", productId),
            limit(4 - suggestedProductsData.length)
          );

          const additionalSnapshot = await getDocs(additionalQ);
          const additionalProducts = additionalSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(
              (p) =>
                p.id !== productId &&
                !suggestedProductsData.some((sp) => sp.id === p.id)
            );

          setSuggestedProducts(
            [...suggestedProductsData, ...additionalProducts].slice(0, 4)
          );
        } else {
          setSuggestedProducts(suggestedProductsData);
        }
      } catch (error) {
        console.error("Error fetching suggested products: ", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestedProducts();
  }, [product, productId]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/product/${productId}` } });
      return;
    }

    if (!messageText.trim()) {
      setMessageError("Please enter a message");
      return;
    }

    if (!product.ownerId) {
      setMessageError(
        "Cannot send message: Product owner information is missing"
      );
      return;
    }

    setSendingMessage(true);
    setMessageError(null);

    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUser.uid,
        receiverId: product.ownerId,
        content: messageText,
        timestamp: serverTimestamp(),
        read: false,
        productId: productId,
        productName: product.productName,
        participants: [currentUser.uid, product.ownerId],
      });

      setMessageSuccess(true);
      setMessageText("");

      setTimeout(() => {
        setMessageModalOpen(false);
        setMessageSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending message: ", error);
      setMessageError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">Loading product details...</div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold">Product Not Found</h2>
        <p className="text-lg text-gray-500">
          Sorry, the product you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const mainImage =
    product.imageLinks && product.imageLinks.length > 0
      ? product.imageLinks[selectedImage]
      : "/Images/DSLR.png";

  const isOutOfStock = (product.stockQuantity || 0) === 0;

  const renderSpecifications = () => {
    if (
      !product.specifications ||
      !Array.isArray(product.specifications) ||
      product.specifications.length === 0
    ) {
      return (
        <>
          <div className="text-gray-600">Category</div>
          <div className="font-medium">{product.category || "General"}</div>
          <div className="text-gray-600">Brand</div>
          <div className="font-medium">{product.brandName || "Unknown"}</div>
        </>
      );
    }

    return product.specifications.map((spec, index) => (
      <React.Fragment key={index}>
        <div className="text-gray-600">{spec.key}</div>
        <div className="font-medium">{spec.value}</div>
      </React.Fragment>
    ));
  };

  const renderTags = () => {
    if (!product.tags || !Array.isArray(product.tags) || product.tags.length === 0) {
      return (
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
          {product.category || "product"}
        </span>
      );
    }

    return product.tags.map((tag, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
      >
        {tag}
      </span>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-full h-96 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/Images/default.png";
              }}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg">
                  OUT OF STOCK
                </div>
              </div>
            )}
          </div>

          {product.imageLinks && product.imageLinks.length > 1 ? (
            <div className="grid grid-cols-3 gap-2">
              {product.imageLinks.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className={`bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/Images/DSLR.png"}
                    alt={`${product.productName} thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Images/default.png";
                    }}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No additional images available
            </p>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            {isOutOfStock && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{product.brandName}</p>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              SKU: {product.sku || `PRD${product.id?.slice(0, 6)}`}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-4xl font-bold text-blue-600">
              ${product.price?.toFixed(2)}
            </h2>
            <div className="flex items-center mt-2">
              {isOutOfStock ? (
                <p className="text-red-600 flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </p>
              ) : (
                <p className="text-green-600 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  In Stock ({product.stockQuantity || 0} available)
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              {product.description || "A high-quality product for your needs."}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-y-2">
              {renderSpecifications()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">{renderTags()}</div>

          <div className="mb-4">
            <p className="flex items-center text-gray-600">
              {product.warehouseLocation || "Warehouse"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <button
              className={`w-full font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center ${
                isOutOfStock
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={() => !isOutOfStock && setMessageModalOpen(true)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Message Seller"}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        {loadingSuggestions ? (
          <p className="text-center text-gray-500">Loading suggestions...</p>
        ) : suggestedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((sp) => (
              <Link
                to={`/product/${sp.id}`}
                key={sp.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  <img
                    src={sp.imageLinks?.[0] || "/Images/DSLR.png"}
                    alt={sp.productName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Images/default.png";
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-blue-500">
                    {sp.category || "Electronics"}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 mt-1 truncate">
                    {sp.productName || "Unnamed Product"}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    ${sp.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 border rounded-lg">
            No suggested products available
          </p>
        )}
      </div>

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Message about: {product.productName}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setMessageModalOpen(false);
                  setMessageText("");
                  setMessageError(null);
                  setMessageSuccess(false);
                }}
              >
                ✕
              </button>
            </div>

            {!currentUser ? (
              <div className="text-center py-4">
                <p className="mb-4">Please log in to message the seller</p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  onClick={() =>
                    navigate("/login", {
                      state: { from: `/product/${productId}` },
                    })
                  }
                >
                  Log In
                </button>
              </div>
            ) : (
              <>
                {messageSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Message sent successfully!
                  </div>
                ) : (
                  <>
                    {messageError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {messageError}
                      </div>
                    )}

                    <textarea
                      className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                      placeholder="Write your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={sendingMessage}
                    ></textarea>

                    <div className="flex justify-end">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                        onClick={() => {
                          setMessageModalOpen(false);
                          setMessageText("");
                          setMessageError(null);
                        }}
                        disabled={sendingMessage}
                      >
                        Cancel
                      </button>
                      <button
                        className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded ${
                          sendingMessage ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={handleSendMessage}
                        disabled={sendingMessage}
                      >
                        {sendingMessage ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
