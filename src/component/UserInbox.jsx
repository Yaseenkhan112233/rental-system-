// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db, auth } from "../firebase/Firebase";
// import { useNavigate } from "react-router-dom";

// const UserInbox = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const currentUser = auth.currentUser;
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("Current User:", auth.currentUser); // Log the current user
//     if (!auth.currentUser) {
//       navigate("/login", { state: { from: "/inbox" } });
//       return;
//     }

//     const fetchConversations = async () => {
//       try {
//         const q = query(
//           collection(db, "messages"),
//           where("participants", "array-contains", auth.currentUser.uid),
//           orderBy("timestamp", "desc")
//         );

//         const querySnapshot = await getDocs(q);
//         console.log("Query Results:", querySnapshot.docs); // Log query results

//         if (querySnapshot.empty) {
//           console.log("No matching documents found.");
//           return;
//         }

//         // Rest of the code...
//       } catch (error) {
//         console.error("Error fetching conversations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversations();
//   }, [navigate]);

//   const openConversation = async (conversation) => {
//     setSelectedConversation(conversation);

//     // Mark messages as read
//     const unreadMessages = conversation.messages.filter((msg) => !msg.read);

//     for (const message of unreadMessages) {
//       try {
//         await updateDoc(doc(db, "messages", message.id), {
//           read: true,
//         });
//       } catch (error) {
//         console.error("Error marking message as read:", error);
//       }
//     }
//   };

//   const renderConversationList = () => {
//     if (loading) {
//       return <div className="text-center py-8">Loading conversations...</div>;
//     }

//     if (conversations.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-500">
//           No conversations yet
//         </div>
//       );
//     }

//     return conversations.map((conversation) => (
//       <div
//         key={conversation.partnerId}
//         className={`border-b p-4 hover:bg-gray-100 cursor-pointer flex items-center ${
//           selectedConversation?.partnerId === conversation.partnerId
//             ? "bg-blue-50"
//             : ""
//         }`}
//         onClick={() => openConversation(conversation)}
//       >
//         <div className="flex-grow">
//           <div className="flex justify-between">
//             <h3 className="font-semibold">
//               {conversation.productName || "Product Inquiry"}
//             </h3>
//             {conversation.unreadCount > 0 && (
//               <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                 {conversation.unreadCount}
//               </span>
//             )}
//           </div>
//           <p className="text-gray-600 text-sm truncate">
//             {conversation.lastMessage}
//           </p>
//         </div>
//       </div>
//     ));
//   };

//   const renderConversationDetails = () => {
//     if (!selectedConversation) {
//       return (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           Select a conversation to view details
//         </div>
//       );
//     }

//     return (
//       <div className="h-full flex flex-col">
//         <div className="border-b p-4 bg-gray-100">
//           <h2 className="font-bold">{selectedConversation.productName}</h2>
//           <p className="text-gray-600 text-sm">Product Conversation Details</p>
//         </div>
//         <div className="flex-grow overflow-y-auto p-4">
//           {selectedConversation.messages.map((message) => (
//             <div
//               key={message.id}
//               className={`mb-4 max-w-[80%] ${
//                 message.senderId === currentUser.uid
//                   ? "ml-auto text-right"
//                   : "mr-auto text-left"
//               }`}
//             >
//               <div
//                 className={`inline-block p-3 rounded-lg ${
//                   message.senderId === currentUser.uid
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-black"
//                 }`}
//               >
//                 {message.content}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {message.timestamp?.toDate()?.toLocaleString() || "Recent"}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//       {/* Conversations List */}
//       <div className="md:col-span-1 bg-white border rounded-lg">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Inbox</h2>
//         </div>
//         {renderConversationList()}
//       </div>

//       {/* Conversation Details */}
//       <div className="md:col-span-2 bg-white border rounded-lg">
//         {renderConversationDetails()}
//       </div>
//     </div>
//   );
// };

// export default UserInbox;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db, auth } from "../firebase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { onSnapshot } from "firebase/firestore";

// // Main UserInbox Component
// const UserInbox = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [newMessage, setNewMessage] = useState(""); // For composing new messages
//   const currentUser = auth.currentUser;
//   const navigate = useNavigate();

//   // Fetch Conversations
//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login", { state: { from: "/inbox" } });
//       return;
//     }

//     const q = query(
//       collection(db, "messages"),
//       where("participants", "array-contains", currentUser.uid),
//       orderBy("timestamp", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const conversationMap = new Map();

//       querySnapshot.forEach((messageDoc) => {
//         const messageData = { id: messageDoc.id, ...messageDoc.data() };
//         const otherParticipantId = messageData.participants.find(
//           (id) => id !== currentUser.uid
//         );

//         if (!conversationMap.has(otherParticipantId)) {
//           conversationMap.set(otherParticipantId, {
//             partnerId: otherParticipantId,
//             productName: messageData.productName,
//             productId: messageData.productId,
//             lastMessage: messageData.content,
//             timestamp: messageData.timestamp,
//             unreadCount: messageData.read === false ? 1 : 0,
//             messages: [messageData],
//           });
//         } else {
//           const existingConversation = conversationMap.get(otherParticipantId);
//           existingConversation.messages.push(messageData);

//           if (
//             !existingConversation.timestamp ||
//             messageData.timestamp > existingConversation.timestamp
//           ) {
//             existingConversation.lastMessage = messageData.content;
//             existingConversation.timestamp = messageData.timestamp;
//           }

//           if (messageData.read === false) {
//             existingConversation.unreadCount += 1;
//           }
//         }
//       });

//       const sortedConversations = Array.from(conversationMap.values()).sort(
//         (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
//       );

//       setConversations(sortedConversations);
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, [currentUser, navigate]);

//   // Open a Conversation
//   const openConversation = async (conversation) => {
//     setSelectedConversation(conversation);

//     const unreadMessages = conversation.messages.filter((msg) => !msg.read);

//     for (const message of unreadMessages) {
//       try {
//         await updateDoc(doc(db, "messages", message.id), { read: true });
//       } catch (error) {
//         console.error("Error marking message as read:", error);
//       }
//     }
//   };

//   // Handle Sending a New Message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       await addDoc(collection(db, "messages"), {
//         senderId: currentUser.uid,
//         receiverId: selectedConversation.partnerId,
//         content: newMessage,
//         timestamp: serverTimestamp(),
//         read: false,
//         productId: selectedConversation.productId,
//         productName: selectedConversation.productName,
//         participants: [currentUser.uid, selectedConversation.partnerId],
//       });

//       setNewMessage(""); // Clear input field
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // Render the Conversation List
//   const renderConversationList = () => {
//     if (loading) {
//       return <div className="text-center py-8">Loading conversations...</div>;
//     }

//     if (conversations.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-500">
//           No conversations yet
//         </div>
//       );
//     }

//     return conversations.map((conversation) => (
//       <div
//         key={conversation.partnerId}
//         className={`p-4 hover:bg-gray-100 cursor-pointer flex items-start ${
//           selectedConversation?.partnerId === conversation.partnerId
//             ? "bg-blue-50"
//             : ""
//         }`}
//         onClick={() => openConversation(conversation)}
//       >
//         {/* Profile Picture Placeholder */}
//         <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>

//         <div className="flex-grow">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-sm">
//               {conversation.productName || "Product Inquiry"}
//             </h3>
//             {conversation.unreadCount > 0 && (
//               <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                 {conversation.unreadCount}
//               </span>
//             )}
//           </div>
//           <p className="text-gray-600 text-xs truncate">
//             {conversation.lastMessage}
//           </p>
//         </div>
//       </div>
//     ));
//   };

//   // Render the Conversation Details
//   const renderConversationDetails = () => {
//     if (!selectedConversation) {
//       return (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           Select a conversation to view details
//         </div>
//       );
//     }

//     return (
//       <div className="h-full flex flex-col">
//         {/* Header */}
//         <div className="border-b p-4 bg-gray-100">
//           <h2 className="font-bold text-lg">
//             {selectedConversation.productName}
//           </h2>
//           <p className="text-gray-600 text-sm">Product Conversation Details</p>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-grow overflow-y-auto p-4 space-y-4">
//           {selectedConversation.messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.senderId === currentUser.uid
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] p-3 rounded-lg ${
//                   message.senderId === currentUser.uid
//                     ? "bg-blue-500 text-white rounded-tr-none"
//                     : "bg-gray-200 text-black rounded-tl-none"
//                 }`}
//               >
//                 <p>{message.content}</p>
//                 <div className="text-xs text-gray-500 mt-1 text-right">
//                   {message.timestamp?.toDate()?.toLocaleString() || "Recent"}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Compose Message Input */}
//         <div className="border-t p-4 bg-white">
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//       {/* Conversations List */}
//       <div className="md:col-span-1 bg-white border rounded-lg">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Inbox</h2>
//         </div>
//         {renderConversationList()}
//       </div>

//       {/* Conversation Details */}
//       <div className="md:col-span-2 bg-white border rounded-lg">
//         {renderConversationDetails()}
//       </div>
//     </div>
//   );
// };

// export default UserInbox;

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";

// Main UserInbox Component
const UserInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  // Fetch Conversations
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/inbox" } });
      return;
    }

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversationMap = new Map();

      querySnapshot.forEach((messageDoc) => {
        const messageData = { id: messageDoc.id, ...messageDoc.data() };
        const otherParticipantId = messageData.participants.find(
          (id) => id !== currentUser.uid
        );

        if (!conversationMap.has(otherParticipantId)) {
          conversationMap.set(otherParticipantId, {
            partnerId: otherParticipantId,
            productName: messageData.productName,
            productId: messageData.productId,
            lastMessage: messageData.content,
            timestamp: messageData.timestamp,
            unreadCount: messageData.read === false ? 1 : 0,
            messages: [messageData],
          });
        } else {
          const existingConversation = conversationMap.get(otherParticipantId);
          existingConversation.messages.push(messageData);

          if (
            !existingConversation.timestamp ||
            messageData.timestamp > existingConversation.timestamp
          ) {
            existingConversation.lastMessage = messageData.content;
            existingConversation.timestamp = messageData.timestamp;
          }

          if (messageData.read === false) {
            existingConversation.unreadCount += 1;
          }
        }
      });

      const sortedConversations = Array.from(conversationMap.values()).sort(
        (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
      );

      setConversations(sortedConversations);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser, navigate]);

  // Open a Conversation
  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);

    const unreadMessages = conversation.messages.filter((msg) => !msg.read);

    for (const message of unreadMessages) {
      try {
        await updateDoc(doc(db, "messages", message.id), { read: true });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  // Handle Sending a New Message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUser.uid,
        receiverId: selectedConversation.partnerId,
        content: newMessage,
        timestamp: serverTimestamp(),
        read: false,
        productId: selectedConversation.productId,
        productName: selectedConversation.productName,
        participants: [currentUser.uid, selectedConversation.partnerId],
      });

      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render the Conversation List
  const renderConversationList = () => {
    if (loading) {
      return <div className="text-center py-8">Loading conversations...</div>;
    }

    if (conversations.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No conversations yet
        </div>
      );
    }

    return conversations.map((conversation) => (
      <div
        key={conversation.partnerId}
        className={`p-4 hover:bg-gray-100 cursor-pointer flex items-start ${
          selectedConversation?.partnerId === conversation.partnerId
            ? "bg-blue-50"
            : ""
        }`}
        onClick={() => openConversation(conversation)}
      >
        {/* Profile Picture Placeholder */}
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>

        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">
              {conversation.productName || "Product Inquiry"}
            </h3>
            {conversation.unreadCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {conversation.unreadCount}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-xs truncate">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    ));
  };

  // Render the Conversation Details
  const renderConversationDetails = () => {
    if (!selectedConversation) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a conversation to view details
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-gray-100">
          <h2 className="font-bold text-lg">
            {selectedConversation.productName}
          </h2>
          <p className="text-gray-600 text-sm">Product Conversation Details</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {selectedConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser.uid
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === currentUser.uid
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-black rounded-tl-none"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {message.timestamp?.toDate()?.toLocaleString() || "Recent"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compose Message Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Conversations List */}
      <div className="md:col-span-1 bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Inbox</h2>
        </div>
        {renderConversationList()}
      </div>

      {/* Conversation Details */}
      <div className="md:col-span-2 bg-white border rounded-lg">
        {renderConversationDetails()}
      </div>
    </div>
  );
};

export default UserInbox;
