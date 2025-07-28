// src/components/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface AuthContextValue {
  user: FirebaseUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser && firebaseUser.email) {
        console.log('Auth change: signed in as', firebaseUser.email);
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', firebaseUser.email));
          const snap = await getDocs(q);
          console.log('Firestore users query result size:', snap.size);
          if (!snap.empty) {
            setUser(firebaseUser);
          } else {
            // Si no está registrado, cierra sesión
            await signOut(auth);
            setUser(null);
            alert(`El correo ${firebaseUser.email} no está registrado. Contacta al administrador.`);
          }
        } catch (error) {
          console.error('Error validando usuario en Firestore:', error);
          setUser(null);
          signOut(auth);
        }
      } else if (firebaseUser && !firebaseUser.email) {
        console.warn('Usuario sin email:', firebaseUser);
        setUser(null);
        await signOut(auth);
      } else {
        // no hay usuario
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
