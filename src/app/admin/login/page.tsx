'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérification des identifiants
    const validEmail = 'Mabelleconsulting@gmail.com';
    const validPassword = 'ComProd1999@';

    if (email === validEmail && password === validPassword) {
      // Connexion réussie
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      
      // Redirection immédiate avec remplacement de l'historique
      window.location.href = '/admin';
    } else {
      setError('Email ou mot de passe incorrect');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-2xl font-bold">M</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-brown-dark mb-2">
            Administration Mabelle
          </h1>
          <p className="text-brown/70">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-2xl border-2 border-gold-light shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brown-dark mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gold-light rounded-lg focus:border-gold-dark focus:outline-none transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-brown-dark mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gold-light rounded-lg focus:border-gold-dark focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-brown shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-brown/60 text-sm">
            © Mabelle Consulting - Votre histoire, notre vision 360°
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}