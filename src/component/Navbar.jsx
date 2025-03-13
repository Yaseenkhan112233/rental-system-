// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // Check authentication state when component mounts
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user);
//     });

//     // Clean up subscription
//     return () => unsubscribe();
//   }, [auth]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       // Redirect to home page after signing out
//       navigate("/");
//       console.log("User signed out successfully");
//     } catch (error) {
//       console.error("Sign out error:", error.message);
//     }
//   };

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">R</span>
//               </div>
//               <span className="ml-2 text-lg font-semibold">RentHub</span>
//             </div>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               <Link
//                 to="/"
//                 className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 Browse
//               </Link>
//               <Link
//                 to="/"
//                 className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 How it Works
//               </Link>
//               <Link
//                 to="/"
//                 className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 About
//               </Link>
//             </div>
//           </div>
//           <div className="flex items-center">
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   to="/account"
//                   className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
//                 >
//                   My Account
//                 </Link>
//                 <button
//                   onClick={handleSignOut}
//                   className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : null}
//             <Link
//               to="/list-your-item"
//               className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//             >
//               List Your Item
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Check authentication state when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [auth]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="ml-2 text-lg font-semibold">RentHub</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Browse
              </Link>
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                How it Works
              </Link>
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <Link
                to="/account"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                My Account
              </Link>
            ) : null}
            <Link
              to="/list-your-item"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              List Your Item
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
