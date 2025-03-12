// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
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

// // Main App component
// function App() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Check auth state at the top level
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setAuthChecked(true);
//     });

//     return () => unsubscribe();
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
//       <div className="min-h-screen bg-white">
//         <Navbar />
//         <AppRoutes user={user} />
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

//       {/* Fallback route */}
//       <Route
//         path="*"
//         element={<Navigate to={user ? "/" : "/auth"} replace />}
//       />
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
//     <Footer />
//   </>
// );

// export default App;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

// Main App component
function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check auth state at the top level
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      setAuthChecked(true); // Mark auth check as complete
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Conditionally render Navbar only if the user is logged in */}
        {user && <Navbar />}
        <AppRoutes user={user} />
      </div>
    </Router>
  );
}

// Routes component to handle all application routes
const AppRoutes = ({ user }) => {
  return (
    <Routes>
      {/* Auth route - redirects to home if logged in */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Home route - redirects to auth if not logged in */}
      <Route
        path="/"
        element={user ? <HomePage /> : <Navigate to="/auth" replace />}
      />

      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
};

// Home page component
const HomePage = () => (
  <>
    <Hero />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FeaturedRentals />
      <CategoryBrowser />
      <HowItWorks />
      <SafeAndSecure />
    </div>
    <Footer />
  </>
);

export default App;
