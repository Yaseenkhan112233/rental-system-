// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase/Firebase";
// import Navbar from "./component/Navbar";
// import Hero from "./component/Hero";
// import FeaturedRentals from "./component/FeaturedRentals";
// import CategoryBrowser from "./component/CategoryBrowser";
// import HowItWorks from "./component/HowItWorks";
// import SafeAndSecure from "./component/SafeAndSecure";
// import Footer from "./component/Footer"; // Import Footer
// import AuthPage from "./component/AuthPage";
// import MyAccount from "./component/MyAccount";
// import ProductUploadForm from "./component/ProductUploadForm"; // Import the ProductUploadForm component
// import ProductDetail from "./component/ProductDetail";
// import AllProducts from "./component/AllProducts";

// // Main App component
// function App() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Check auth state at the top level
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser); // Update user state
//       setAuthChecked(true); // Mark auth check as complete
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   // Show loading state while checking authentication
//   if (!authChecked) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-white flex flex-col">
//         {/* Always render Navbar */}
//         <Navbar />

//         {/* Render routes */}
//         <div className="flex-grow">
//           <AppRoutes user={user} />
//         </div>

//         {/* Always render Footer */}
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// // Routes component to handle all application routes
// const AppRoutes = ({ user }) => {
//   return (
//     <Routes>
//       {/* Auth route - redirects to home if logged in */}
//       <Route
//         path="/auth"
//         element={user ? <Navigate to="/" replace /> : <AuthPage />}
//       />
//       {/* Home route - redirects to auth if not logged in */}
//       <Route
//         path="/"
//         element={user ? <HomePage /> : <Navigate to="/auth" replace />}
//       />
//       {/* My Account route */}
//       <Route
//         path="/account"
//         element={
//           user ? <MyAccount user={user} /> : <Navigate to="/auth" replace />
//         }
//       />
//       {/* Add Product Upload Form route */}
//       <Route
//         path="/list-your-item"
//         element={user ? <ProductUploadForm /> : <Navigate to="/auth" replace />}
//       />
//       {/* Fallback route */}
//       <Route
//         path="*"
//         element={<Navigate to={user ? "/" : "/auth"} replace />}
//       />
//       <Route path="/product/:productId" element={<ProductDetail />} />
//       <Route path="/all-products" element={<AllProducts />} />{" "}
//       {/* Add the new route */}
//     </Routes>
//   );
// };

// // Home page component
// const HomePage = () => (
//   <>
//     <Hero />
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <FeaturedRentals />
//       <CategoryBrowser />
//       <HowItWorks />
//       <SafeAndSecure />
//     </div>
//   </>
// );

// export default App;

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { FaInbox } from "react-icons/fa"; // Import an inbox icon
// import { useNavigate } from "react-router-dom";

// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase/Firebase";
// import Navbar from "./component/Navbar";
// import Hero from "./component/Hero";
// import FeaturedRentals from "./component/FeaturedRentals";
// import CategoryBrowser from "./component/CategoryBrowser";
// import HowItWorks from "./component/HowItWorks";
// import SafeAndSecure from "./component/SafeAndSecure";
// import Footer from "./component/Footer";
// import AuthPage from "./component/AuthPage";
// import MyAccount from "./component/MyAccount";
// import ProductUploadForm from "./component/ProductUploadForm";
// import ProductDetail from "./component/ProductDetail";
// import AllProducts from "./component/AllProducts";
// import UserInbox from "./component/UserInbox"; // Import the new UserInbox component

// // Conditional Footer Wrapper Component
// const ConditionalFooter = () => {
//   const location = useLocation();

//   // List of routes where Footer should not be shown
//   const routesWithoutFooter = ["/auth", "/login"];

//   if (routesWithoutFooter.includes(location.pathname)) {
//     return null;
//   }

//   return <Footer />;
// };

// // Main App component
// function App() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Check auth state at the top level
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser); // Update user state
//       setAuthChecked(true); // Mark auth check as complete
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   // Show loading state while checking authentication
//   if (!authChecked) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-white flex flex-col">
//         {/* Always render Navbar */}
//         <Navbar />

//         {/* Render routes */}
//         <div className="flex-grow">
//           <AppRoutes user={user} />
//         </div>

//         {/* Conditionally render Footer */}
//         <ConditionalFooter />
//       </div>
//     </Router>
//   );
// }

// // Routes component to handle all application routes
// const AppRoutes = ({ user }) => {
//   return (
//     <Routes>
//       {/* Auth route - redirects to home if logged in */}
//       <Route
//         path="/auth"
//         element={user ? <Navigate to="/" replace /> : <AuthPage />}
//       />
//       {/* Home route - redirects to auth if not logged in */}
//       <Route
//         path="/"
//         element={user ? <HomePage /> : <Navigate to="/auth" replace />}
//       />
//       {/* My Account route */}
//       <Route
//         path="/account"
//         element={
//           user ? <MyAccount user={user} /> : <Navigate to="/auth" replace />
//         }
//       />
//       {/* Add Product Upload Form route */}
//       <Route
//         path="/list-your-item"
//         element={user ? <ProductUploadForm /> : <Navigate to="/auth" replace />}
//       />
//       {/* User Inbox route */}
//       <Route
//         path="/inbox"
//         element={user ? <UserInbox /> : <Navigate to="/auth" replace />}
//       />
//       {/* Fallback route */}
//       <Route
//         path="*"
//         element={<Navigate to={user ? "/" : "/auth"} replace />}
//       />
//       <Route path="/product/:productId" element={<ProductDetail />} />
//       <Route path="/all-products" element={<AllProducts />} />
//     </Routes>
//   );
// };

// // Home page component
// const HomePage = () => {
//   const navigate = useNavigate();

//   const handleInboxClick = () => {
//     navigate("/inbox"); // Navigate to the UserInbox page
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <Hero />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <FeaturedRentals />
//         <CategoryBrowser />
//         <HowItWorks />
//         <SafeAndSecure />
//       </div>

//       {/* Inbox Button (Floating Action Button) */}
//       <button
//         onClick={handleInboxClick}
//         className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
//       >
//         <FaInbox size={24} /> {/* Inbox Icon */}
//       </button>
//     </>
//   );
// };

// export default App;

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
import UserInbox from "./component/UserInbox";

// ❗ Helper component to show/hide based on route
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideOnPaths = ["/auth", "/login"];

  const showLayout = !hideOnPaths.includes(location.pathname);

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && (
        <>
          {/* Inbox Floating Button */}
          <button
            onClick={() => navigate("/inbox")}
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
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedRentals />
        <CategoryBrowser />
        <HowItWorks />
        <SafeAndSecure />
      </div>
    </>
  );
};

export default App;
