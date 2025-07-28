// src/app/layout.tsx
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth-provider";

export const metadata = { title: "Agenda Uñas" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
