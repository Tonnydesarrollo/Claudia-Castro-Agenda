// src/components/LoginPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();

  // Si ya está logueado, vamos a /calendar
  React.useEffect(() => {
    if (user) router.replace("/calendar");
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email.trim());
      router.replace("/calendar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center mb-6">Inicia sesión</h1>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
    </div>
  );
}
