import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

export const createUser = async (userData) => {
  try {
    // Create Firebase Auth user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    // Add user data to Firestore
    const usersRef = collection(db, 'users');
    await addDoc(usersRef, {
      uid: user.uid,
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName,
      createdAt: serverTimestamp(),
      status: 'active'
    });

    toast.success('User created successfully');
    return user.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error(error.message || 'Failed to create user');
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    toast.success('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const batch = writeBatch(db);

    // Delete user enrollments
    const enrollmentsRef = collection(db, 'enrollments');
    const enrollmentsQuery = query(enrollmentsRef, where('userId', '==', userId));
    const enrollmentDocs = await getDocs(enrollmentsQuery);
    enrollmentDocs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user messages
    const messagesRef = collection(db, 'messages');
    const sentQuery = query(messagesRef, where('senderId', '==', userId));
    const receivedQuery = query(messagesRef, where('receiverId', '==', userId));
    
    const [sentDocs, receivedDocs] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);

    sentDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    receivedDocs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user notifications
    const notificationsRef = collection(db, 'notifications');
    const notifQuery = query(notificationsRef, where('recipientId', '==', userId));
    const notifDocs = await getDocs(notifQuery);
    notifDocs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user document
    const userRef = doc(db, 'users', userId);
    batch.delete(userRef);

    // Commit all deletions
    await batch.commit();

    toast.success('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    throw error;
  }
};

export const subscribeToUsers = (callback, role = null) => {
  const usersRef = collection(db, 'users');
  const constraints = [orderBy('createdAt', 'desc')];
  
  if (role) {
    constraints.unshift(where('role', '==', role));
  }

  const q = query(usersRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(users);
  });
};

export const searchUsers = async (searchTerm, role = null) => {
  try {
    const usersRef = collection(db, 'users');
    const constraints = [
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      orderBy('displayName')
    ];
    
    if (role) {
      constraints.unshift(where('role', '==', role));
    }

    const q = query(usersRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    toast.error('Failed to search users');
    throw error;
  }
};

export const exportUsersToCSV = async (role = null) => {
  try {
    const users = await getAllUsers(role);
    const csvContent = generateCSV(users);
    downloadCSV(csvContent, `users_export_${new Date().toISOString()}.csv`);
  } catch (error) {
    console.error('Error exporting users:', error);
    toast.error('Failed to export users');
    throw error;
  }
};

const getAllUsers = async (role = null) => {
  const usersRef = collection(db, 'users');
  const constraints = [orderBy('createdAt', 'desc')];
  
  if (role) {
    constraints.unshift(where('role', '==', role));
  }

  const q = query(usersRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const generateCSV = (users) => {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created At'];
  const rows = users.map(user => [
    user.id,
    user.displayName,
    user.email,
    user.role,
    user.status,
    new Date(user.createdAt?.toDate()).toLocaleString()
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};