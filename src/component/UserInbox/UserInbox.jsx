// import React, { useState, useEffect, useRef } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   updateDoc,
//   doc,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
// } from "firebase/firestore";
// import { db, auth } from "../firebase/Firebase";
// import { useNavigate } from "react-router-dom";

// const UserInbox = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const currentUser = auth.currentUser;
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);
//   const [unsubscribeListener, setUnsubscribeListener] = useState(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

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

//         const key = `${otherParticipantId}_${messageData.productId}`;

//         if (!conversationMap.has(key)) {
//           conversationMap.set(key, {
//             partnerId: otherParticipantId,
//             productId: messageData.productId,
//             productName: messageData.productName,
//             lastMessage: messageData.content,
//             timestamp: messageData.timestamp,
//             unreadCount:
//               messageData.read === false &&
//               messageData.senderId !== currentUser.uid
//                 ? 1
//                 : 0,
//             messages: [messageData],
//           });
//         } else {
//           const existing = conversationMap.get(key);
//           existing.messages.push(messageData);

//           if (
//             !existing.timestamp ||
//             messageData.timestamp > existing.timestamp
//           ) {
//             existing.lastMessage = messageData.content;
//             existing.timestamp = messageData.timestamp;
//           }

//           if (
//             messageData.read === false &&
//             messageData.senderId !== currentUser.uid
//           ) {
//             existing.unreadCount += 1;
//           }
//         }
//       });

//       const sorted = Array.from(conversationMap.values()).sort(
//         (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
//       );

//       setConversations(sorted);

//       if (selectedConversation) {
//         const updated = sorted.find(
//           (c) =>
//             c.partnerId === selectedConversation.partnerId &&
//             c.productId === selectedConversation.productId
//         );
//         setSelectedConversation(updated);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [
//     currentUser,
//     navigate,
//     selectedConversation?.partnerId,
//     selectedConversation?.productId,
//   ]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [selectedConversation]);

//   const openConversation = (conversation) => {
//     setSelectedConversation(conversation);

//     if (unsubscribeListener) unsubscribeListener();

//     const q = query(
//       collection(db, "messages"),
//       where("productId", "==", conversation.productId),
//       where("participants", "array-contains", currentUser.uid),
//       orderBy("timestamp")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messages = [];
//       snapshot.forEach((docSnap) => {
//         const data = { id: docSnap.id, ...docSnap.data() };
//         messages.push(data);

//         if (data.receiverId === currentUser.uid && data.read === false) {
//           updateDoc(doc(db, "messages", docSnap.id), { read: true });
//         }
//       });

//       setSelectedConversation((prev) => ({
//         ...prev,
//         messages,
//       }));
//     });

//     setUnsubscribeListener(() => unsubscribe);
//   };

//   useEffect(() => {
//     return () => {
//       if (unsubscribeListener) unsubscribeListener();
//     };
//   }, [unsubscribeListener]);

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

//       setNewMessage("");
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSendMessage();
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

//     return (
//       <div className="overflow-y-auto h-[calc(100vh-120px)]">
//         {conversations.map((conversation) => (
//           <div
//             key={`${conversation.partnerId}_${conversation.productId}`}
//             className={`p-4 hover:bg-gray-100 cursor-pointer flex items-start ${
//               selectedConversation?.partnerId === conversation.partnerId &&
//               selectedConversation?.productId === conversation.productId
//                 ? "bg-blue-50"
//                 : ""
//             }`}
//             onClick={() => openConversation(conversation)}
//           >
//             <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex-shrink-0" />
//             <div className="flex-grow">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-sm">
//                   {conversation.productName || "Product Inquiry"}
//                 </h3>
//                 {conversation.unreadCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {conversation.unreadCount}
//                   </span>
//                 )}
//               </div>
//               <p className="text-gray-600 text-xs truncate">
//                 {conversation.lastMessage}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderConversationDetails = () => {
//     if (!selectedConversation) {
//       return (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           Select a conversation to view details
//         </div>
//       );
//     }

//     const sortedMessages = [...selectedConversation.messages].sort(
//       (a, b) => a.timestamp?.seconds - b.timestamp?.seconds
//     );

//     return (
//       <div className="h-full flex flex-col">
//         <div className="border-b p-4 bg-gray-100">
//           <h2 className="font-bold text-lg">
//             {selectedConversation.productName}
//           </h2>
//           <p className="text-gray-600 text-sm">Product Conversation Details</p>
//         </div>

//         <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-220px)]">
//           {sortedMessages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${
//                 msg.senderId === currentUser.uid
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] p-3 rounded-lg relative ${
//                   msg.senderId === currentUser.uid
//                     ? "bg-blue-500 text-white rounded-tr-none"
//                     : "bg-gray-200 text-black rounded-tl-none"
//                 }`}
//               >
//                 <p>{msg.content}</p>
//                 <div
//                   className={`text-xs mt-1 text-right ${
//                     msg.senderId === currentUser.uid
//                       ? "text-gray-200"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {msg.timestamp?.toDate()?.toLocaleTimeString() || "Now"}
//                   {msg.senderId === currentUser.uid && (
//                     <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="border-t p-4 bg-white">
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
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
//     <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-[calc(100vh-60px)]">
//       <div className="md:col-span-1 bg-white border rounded-lg flex flex-col">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Inbox</h2>
//         </div>
//         {renderConversationList()}
//       </div>
//       <div className="md:col-span-2 bg-white border rounded-lg">
//         {renderConversationDetails()}
//       </div>
//     </div>
//   );
// };

// export default UserInbox;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   updateDoc,
//   doc,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
// } from "firebase/firestore";
// import { db, auth } from "../firebase/Firebase";
// import { useNavigate } from "react-router-dom";

// const UserInbox = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const currentUser = auth.currentUser;
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);
//   const [unsubscribeListener, setUnsubscribeListener] = useState(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

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

//         const key = `${otherParticipantId}_${messageData.productId}`;

//         if (!conversationMap.has(key)) {
//           conversationMap.set(key, {
//             partnerId: otherParticipantId,
//             productId: messageData.productId,
//             productName: messageData.productName,
//             lastMessage: messageData.content,
//             timestamp: messageData.timestamp,
//             unreadCount:
//               messageData.read === false &&
//               messageData.senderId !== currentUser.uid
//                 ? 1
//                 : 0,
//             messages: [messageData],
//           });
//         } else {
//           const existing = conversationMap.get(key);
//           existing.messages.push(messageData);

//           if (
//             !existing.timestamp ||
//             messageData.timestamp > existing.timestamp
//           ) {
//             existing.lastMessage = messageData.content;
//             existing.timestamp = messageData.timestamp;
//           }

//           if (
//             messageData.read === false &&
//             messageData.senderId !== currentUser.uid
//           ) {
//             existing.unreadCount += 1;
//           }
//         }
//       });

//       const sorted = Array.from(conversationMap.values()).sort(
//         (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
//       );

//       setConversations(sorted);

//       if (selectedConversation) {
//         const updated = sorted.find(
//           (c) =>
//             c.partnerId === selectedConversation.partnerId &&
//             c.productId === selectedConversation.productId
//         );
//         setSelectedConversation(updated);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [
//     currentUser,
//     navigate,
//     selectedConversation?.partnerId,
//     selectedConversation?.productId,
//   ]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [selectedConversation]);

//   const openConversation = (conversation) => {
//     setSelectedConversation(conversation);

//     if (unsubscribeListener) unsubscribeListener();

//     const q = query(
//       collection(db, "messages"),
//       where("productId", "==", conversation.productId),
//       where("participants", "array-contains", currentUser.uid),
//       orderBy("timestamp")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messages = [];
//       snapshot.forEach((docSnap) => {
//         const data = { id: docSnap.id, ...docSnap.data() };
//         messages.push(data);

//         if (data.receiverId === currentUser.uid && data.read === false) {
//           updateDoc(doc(db, "messages", docSnap.id), { read: true });
//         }
//       });

//       setSelectedConversation((prev) => ({
//         ...prev,
//         messages,
//       }));

//       // Scroll to bottom when new messages come in
//       setTimeout(scrollToBottom, 100);
//     });

//     setUnsubscribeListener(() => unsubscribe);
//   };

//   useEffect(() => {
//     return () => {
//       if (unsubscribeListener) unsubscribeListener();
//     };
//   }, [unsubscribeListener]);

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

//       setNewMessage("");
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSendMessage();
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

//     return (
//       <div className="overflow-y-auto h-[calc(100vh-250px)]">
//         {conversations.map((conversation) => (
//           <div
//             key={`${conversation.partnerId}_${conversation.productId}`}
//             className={`p-4 hover:bg-gray-100 cursor-pointer flex items-start ${
//               selectedConversation?.partnerId === conversation.partnerId &&
//               selectedConversation?.productId === conversation.productId
//                 ? "bg-blue-50"
//                 : ""
//             }`}
//             onClick={() => openConversation(conversation)}
//           >
//             <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex-shrink-0" />
//             <div className="flex-grow">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-sm">
//                   {conversation.productName || "Product Inquiry"}
//                 </h3>
//                 {conversation.unreadCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {conversation.unreadCount}
//                   </span>
//                 )}
//               </div>
//               <p className="text-gray-600 text-xs truncate">
//                 {conversation.lastMessage}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderConversationDetails = () => {
//     if (!selectedConversation) {
//       return (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           Select a conversation to view details
//         </div>
//       );
//     }

//     const sortedMessages = [...selectedConversation.messages].sort(
//       (a, b) => a.timestamp?.seconds - b.timestamp?.seconds
//     );

//     return (
//       <div className="h-full flex flex-col">
//         <div className="border-b p-4 bg-gray-100">
//           <h2 className="font-bold text-lg">
//             {selectedConversation.productName}
//           </h2>
//           <p className="text-gray-600 text-sm">Product Conversation Details</p>
//         </div>

//         <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-300px)]">
//           {sortedMessages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${
//                 msg.senderId === currentUser.uid
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] p-3 rounded-lg relative ${
//                   msg.senderId === currentUser.uid
//                     ? "bg-blue-500 text-white rounded-tr-none"
//                     : "bg-gray-200 text-black rounded-tl-none"
//                 }`}
//               >
//                 <p>{msg.content}</p>
//                 <div
//                   className={`text-xs mt-1 text-right ${
//                     msg.senderId === currentUser.uid
//                       ? "text-gray-200"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {msg.timestamp?.toDate()?.toLocaleTimeString() || "Now"}
//                   {msg.senderId === currentUser.uid && (
//                     <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="border-t p-4 bg-white">
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
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
//     <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-[calc(100vh-150px)] mb-16">
//       <div className="md:col-span-1 bg-white border rounded-lg flex flex-col">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Inbox</h2>
//         </div>
//         {renderConversationList()}
//       </div>
//       <div className="md:col-span-2 bg-white border rounded-lg">
//         {renderConversationDetails()}
//       </div>
//     </div>
//   );
// };

// export default UserInbox;

import React, { useState, useEffect, useRef } from "react";
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
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import UserActions from "./UserActions";

const UserInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [unsubscribeListener, setUnsubscribeListener] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserProfile = async (uid) => {
    if (userProfiles[uid]) return;

    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserProfiles((prev) => ({
          ...prev,
          [uid]: userDoc.data(),
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

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

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const conversationMap = new Map();

      for (const messageDoc of querySnapshot.docs) {
        const messageData = { id: messageDoc.id, ...messageDoc.data() };
        const otherParticipantId = messageData.participants.find(
          (id) => id !== currentUser.uid
        );

        const key = `${otherParticipantId}_${messageData.productId}`;

        await fetchUserProfile(otherParticipantId);

        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            partnerId: otherParticipantId,
            productId: messageData.productId,
            productName: messageData.productName,
            lastMessage: messageData.content,
            timestamp: messageData.timestamp,
            unreadCount:
              messageData.read === false &&
              messageData.senderId !== currentUser.uid
                ? 1
                : 0,
            messages: [messageData],
          });
        } else {
          const existing = conversationMap.get(key);
          existing.messages.push(messageData);

          if (
            !existing.timestamp ||
            messageData.timestamp > existing.timestamp
          ) {
            existing.lastMessage = messageData.content;
            existing.timestamp = messageData.timestamp;
          }

          if (
            messageData.read === false &&
            messageData.senderId !== currentUser.uid
          ) {
            existing.unreadCount += 1;
          }
        }
      }

      const sorted = Array.from(conversationMap.values()).sort(
        (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
      );

      setConversations(sorted);

      if (selectedConversation) {
        const updated = sorted.find(
          (c) =>
            c.partnerId === selectedConversation.partnerId &&
            c.productId === selectedConversation.productId
        );
        setSelectedConversation(updated);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [
    currentUser,
    navigate,
    selectedConversation?.partnerId,
    selectedConversation?.productId,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const openConversation = (conversation) => {
    setSelectedConversation(conversation);

    if (unsubscribeListener) unsubscribeListener();

    const q = query(
      collection(db, "messages"),
      where("productId", "==", conversation.productId),
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        messages.push(data);

        if (data.receiverId === currentUser.uid && data.read === false) {
          updateDoc(doc(db, "messages", docSnap.id), { read: true });
        }
      });

      setSelectedConversation((prev) => ({
        ...prev,
        messages,
      }));

      setTimeout(scrollToBottom, 100);
    });

    setUnsubscribeListener(() => unsubscribe);
  };

  useEffect(() => {
    return () => {
      if (unsubscribeListener) unsubscribeListener();
    };
  }, [unsubscribeListener]);

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

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

    return (
      <div className="overflow-y-auto h-[calc(100vh-250px)]">
        {conversations.map((conversation) => {
          const user = userProfiles[conversation.partnerId];
          return (
            <div
              key={`${conversation.partnerId}_${conversation.productId}`}
              className={`p-4 hover:bg-gray-100 cursor-pointer flex items-start ${
                selectedConversation?.partnerId === conversation.partnerId &&
                selectedConversation?.productId === conversation.productId
                  ? "bg-blue-50"
                  : ""
              }`}
              onClick={() => openConversation(conversation)}
            >
              <img
                src={user?.photoURL || "/Images/profile.png"}
                alt="User"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
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
          );
        })}
      </div>
    );
  };

  const renderConversationDetails = () => {
    if (!selectedConversation) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a conversation to view details
        </div>
      );
    }

    const sortedMessages = [...selectedConversation.messages].sort(
      (a, b) => a.timestamp?.seconds - b.timestamp?.seconds
    );

    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4 bg-gray-100">
          <h2 className="font-bold text-lg">
            {selectedConversation.productName}
          </h2>
          <p className="text-gray-600 text-sm">Product Conversation Details</p>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-300px)]">
          {sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser.uid
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg relative ${
                  msg.senderId === currentUser.uid
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-black rounded-tl-none"
                }`}
              >
                <p>{msg.content}</p>
                <div
                  className={`text-xs mt-1 text-right ${
                    msg.senderId === currentUser.uid
                      ? "text-gray-200"
                      : "text-gray-600"
                  }`}
                >
                  {msg.timestamp?.toDate()?.toLocaleTimeString() || "Now"}
                  {msg.senderId === currentUser.uid && (
                    <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
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
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-[calc(100vh-150px)] mb-16">
      <div className="md:col-span-1 bg-white border rounded-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Inbox</h2>
        </div>
        {renderConversationList()}
      </div>
      <div className="md:col-span-2 bg-white border rounded-lg">
        {renderConversationDetails()}
      </div>
    </div>
  );
};

export default UserInbox;
