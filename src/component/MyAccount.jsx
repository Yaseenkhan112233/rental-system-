import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const MyAccount = ({ user }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/"); // Redirect to home page after sign out
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold">My Account</h2>
      <div className="flex items-center mt-6">
        {/* Profile Image */}
        <img
          src={user?.photoURL || "/Images/profile.png"} // Default profile if no image
          alt="Profile"
          className="h-16 w-16 rounded-full"
        />
        <div className="ml-4">
          <h3 className="text-xl font-medium">{user?.displayName}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
