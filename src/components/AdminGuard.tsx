'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('adminAuth');
        const authTime = localStorage.getItem('adminAuthTime');
        
        if (authStatus === 'true' && authTime) {
          const loginTime = parseInt(authTime);
          const currentTime = Date.now();
          const maxSessionTime = 24 * 60 * 60 * 1000; // 24 heures
          
          if (currentTime - loginTime < maxSessionTime) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          } else {
            // Session expirée
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminAuthTime');
          }
        }
        
        // Non authentifié - redirection immédiate
        window.location.href = '/admin/login';
      } catch (error) {
        // Erreur d'accès localStorage - redirection
        window.location.href = '/admin/login';
      }
    };

    checkAuth();
  }, [router]);

  // Pendant la vérification ou si non authentifié
  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gold-light border-t-gold rounded-full animate-spin"></div>
          <p className="text-brown/70">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Authentifié - afficher le contenu
  return <>{children}</>;
}