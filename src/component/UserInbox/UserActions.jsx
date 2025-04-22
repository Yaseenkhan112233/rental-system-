import React, { useState } from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/Firebase"; // adjust the path if needed

const UserActions = ({ userId, currentUserId, onUserDeleted }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, "users", userId));
      showMessage("User deleted successfully", "success");
      if (onUserDeleted) onUserDeleted(); // remove from list
    } catch (error) {
      showMessage("Failed to delete user", "error");
    }
  };

  const handleBlockUser = async () => {
    try {
      await setDoc(doc(db, "blockedUsers", userId), {
        blockedBy: currentUserId,
        blockedAt: new Date(),
      });
      showMessage("User blocked successfully", "success");
    } catch (error) {
      showMessage("Failed to block user", "error");
    }
  };

  const handleReportUser = async () => {
    try {
      await setDoc(doc(db, "reports", userId), {
        reportedBy: currentUserId,
        reportedAt: new Date(),
        reason: "Inappropriate behavior",
      });
      showMessage("User reported successfully", "success");
    } catch (error) {
      showMessage("Failed to report user", "error");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={handleDeleteUser}
      >
        Delete
      </button>
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded"
        onClick={handleBlockUser}
      >
        Block
      </button>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={handleReportUser}
      >
        Report
      </button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          <AlertTitle>
            {snackbar.severity === "success" ? "Success" : "Error"}
          </AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserActions;
