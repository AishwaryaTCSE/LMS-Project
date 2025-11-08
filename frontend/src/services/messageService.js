import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { toast } from 'react-toastify';

export const sendMessage = async (senderId, receiverId, message, type = 'text') => {
  try {
    const messagesRef = collection(db, 'messages');
    const messageData = {
      senderId,
      receiverId,
      content: message,
      type,
      createdAt: serverTimestamp(),
      read: false
    };

    const docRef = await addDoc(messagesRef, messageData);

    // Get sender's name from users collection
    const senderDoc = await getDoc(doc(db, 'users', senderId));
    const senderName = senderDoc.exists() 
      ? `${senderDoc.data().firstName} ${senderDoc.data().lastName}`
      : 'Unknown User';

    // Create notification for receiver
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      recipientId: receiverId,
      senderId,
      type: 'message',
      message: `New message from ${senderName}`,
      read: false,
      createdAt: serverTimestamp(),
      relatedId: docRef.id
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};

export const subscribeToMessages = (userId, callback) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('receiverId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, { read: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
};

export const uploadFileToStorage = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const sendVoiceMessage = async (receiverId, audioBlob) => {
  try {
    // Upload audio file
    const filename = `voice-messages/${Date.now()}.wav`;
    const audioUrl = await uploadFileToStorage(audioBlob, filename);

    // Send message with audio URL
    return sendMessage(receiverId, audioUrl, 'voice');
  } catch (error) {
    console.error('Error sending voice message:', error);
    toast.error('Failed to send voice message');
    throw error;
  }
};

export const sendAttachment = async (receiverId, files) => {
  try {
    const attachments = [];
    
    // Upload each file
    for (const file of files) {
      const filename = `attachments/${Date.now()}-${file.name}`;
      const url = await uploadFileToStorage(file, filename);
      attachments.push({
        filename: file.name,
        url,
        size: file.size,
        type: file.type
      });
    }

    // Send message with file attachments
    const message = {
      attachments,
      content: files.length > 1 ? `Sent ${files.length} files` : `Sent ${files[0].name}`
    };

    return sendMessage(receiverId, message, 'file');
  } catch (error) {
    console.error('Error sending attachments:', error);
    toast.error('Failed to send files');
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    const messageSnapshot = await getDoc(messageRef);
    
    if (messageSnapshot.exists()) {
      const messageData = messageSnapshot.data();
      
      // Delete attachments from storage if any
      if (messageData.type === 'voice' || (messageData.attachments && messageData.attachments.length > 0)) {
        const filesToDelete = messageData.type === 'voice' 
          ? [messageData.content] // Voice message URL
          : messageData.attachments.map(att => att.url); // Attachment URLs
        
        for (const fileUrl of filesToDelete) {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        }
      }
    }

    // Delete message document
    await deleteDoc(messageRef);
    toast.success('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    toast.error('Failed to delete message');
    throw error;
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};