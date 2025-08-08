

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FaInbox } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/Firebase";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import FeaturedRentals from "./component/FeaturedRentals";
import CategoryBrowser from "./component/CategoryBrowser";
import HowItWorks from "./component/HowItWorks";
import SafeAndSecure from "./component/SafeAndSecure";
import Footer from "./component/Footer";
import AuthPage from "./component/AuthPage";
import MyAccount from "./component/MyAccount";
import ProductUploadForm from "./component/ProductUploadForm";
import ProductDetail from "./component/ProductDetail";
import AllProducts from "./component/AllProducts";
import UserInbox from "./component/UserInbox/UserInbox";

// ❗ Helper component to show/hide based on route
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideOnPaths = ["/auth", "/login"];

  const showLayout = !hideOnPaths.includes(location.pathname);

  const handleInboxClick = () => {
    if (location.pathname === "/inbox") {
      // If currently on inbox page, go back to home
      navigate("/");
    } else {
      // If on any other page, go to inbox
      navigate("/inbox");
    }
  };

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && (
        <>
          {/* Inbox Floating Button */}
          <button
            onClick={handleInboxClick}
            className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-50"
          >
            <FaInbox size={24} />
          </button>
        </>
      )}
      {showLayout && <Footer />}
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <LayoutWrapper>
          <div className="flex-grow">
            <AppRoutes user={user} />
          </div>
        </LayoutWrapper>
      </div>
    </Router>
  );
}

const AppRoutes = ({ user }) => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={user ? <HomePage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/account"
        element={
          user ? <MyAccount user={user} /> : <Navigate to="/auth" replace />
        }
      />
      <Route
        path="/list-your-item"
        element={user ? <ProductUploadForm /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/inbox"
        element={user ? <UserInbox /> : <Navigate to="/auth" replace />}
      />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/all-products" element={<AllProducts />} />
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
};

const HomePage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchResults = (products, searchTerm, location) => {
    setFilteredProducts(products);
    setSelectedLocation(location);
    setSearchTerm(searchTerm);
  };
  return (
    <>
      <Hero onSearchResults={handleSearchResults}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedRentals filteredProducts={filteredProducts}
        selectedLocation={selectedLocation}
        searchTerm={searchTerm} />
        {/* <CategoryBrowser /> */}
        <HowItWorks />
        <SafeAndSecure />
      </div>
    </>
  );
};

export default App;