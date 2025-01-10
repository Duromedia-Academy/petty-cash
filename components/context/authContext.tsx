"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

// Rename local User type to avoid conflict
type LocalUser = {
  uid: string;
  email: string;
  displayName?: string;
  docId?: string;
  photoURL?: string;
};

interface AuthContextProps {
  user: LocalUser | null;
  role: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchUserData: (currentUser: FirebaseUser) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  loading: true,
  setLoading: () => {},
  fetchUserData: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser: FirebaseUser) => {
    const userEmail = currentUser.email;
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    const userDetails = querySnapshot.docs[0].data();
    setUser({
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: userDetails.displayName,
      docId: querySnapshot.docs[0].id,
    });
    setRole(userDetails.role);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        document.cookie = `token=${token}; path=/;`;

        await fetchUserData(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ...existing code...
  const value = { user, role, loading, setLoading, fetchUserData };
  // ...existing code...

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => useContext(AuthContext);
