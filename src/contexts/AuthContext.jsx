// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email/password
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        photoURL: '',
        role: 'employee',
        createdAt: new Date(),
        updatedAt: new Date(),
        contacts: {
          email: email,
          phone: '',
          telegram: '',
          linkedin: '',
        },
        position: '',
        qualification: '',
        skills: '',
        workFormat: '',
        englishLevel: '',
        desiredPay: 0,
        city: ''
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with email/password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          name: result.user.displayName?.split(' ')[0] || '',
          surname: result.user.displayName?.split(' ')[1] || '',
          email: result.user.email,
          photoURL: result.user.photoURL || '',
          role: 'employee',
          createdAt: new Date(),
          updatedAt: new Date(),
          contacts: {
            email: result.user.email,
            phone: '',
            telegram: '',
            linkedin: '',
          }
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      }, { merge: true });

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCurrentUser({
          ...auth.currentUser,
          ...userSnap.data()
        });
      }
    } catch (error) {
      throw error;
    }
  };

  // Get user data
  const getUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        setCurrentUser({
          ...user,
          ...userData
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}