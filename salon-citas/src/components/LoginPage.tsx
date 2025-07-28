import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Una vez logueado, nos vamos a /calendar
        navigate('/calendar', { replace: true });
      }
    } catch (e) {
      console.error(e);
      alert('Error durante el login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <button
        onClick={login}
        className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
      >
        Entrar con Google
      </button>
    </div>
  );
}

