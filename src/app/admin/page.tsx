'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const adminSections = [
  {
    href: '/admin/site',
    title: 'Site',
    description: 'Contenu principal, titre hero, mission, slider d\'images',
    icon: '🏠',
    color: 'from-blue-400 to-blue-600'
  },
  {
    href: '/admin/projects',
    title: 'Projets',
    description: 'Créer, modifier et gérer les réalisations portfolio',
    icon: '📂',
    color: 'from-green-400 to-green-600'
  },
  {
    href: '/admin/services',
    title: 'Services',
    description: 'Définir les offres, descriptions et galeries',
    icon: '🛠️',
    color: 'from-purple-400 to-purple-600'
  },
  {
    href: '/admin/testimonials',
    title: 'Témoignages',
    description: 'Modérer et gérer les avis clients',
    icon: '💬',
    color: 'from-orange-400 to-orange-600'
  },
  {
    href: '/admin/about',
    title: 'À propos',
    description: 'Histoire, mission, vision et équipe Mabelle',
    icon: '👥',
    color: 'from-pink-400 to-pink-600'
  }
];

export default function AdminDashboard() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-[70vh] bg-beige flex flex-col items-center py-12 px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-brown-dark mb-4">
          Administration Mabelle
        </h1>
        <p className="text-brown/80 max-w-2xl">
          Bienvenue dans votre espace d'administration. Gérez facilement le contenu de votre site.
        </p>
      </motion.div>

      {/* Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section, index) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group"
          >
            <Link href={section.href}>
              <div className="bg-white rounded-2xl border-2 border-gold-light shadow-xl hover:shadow-2xl transition-all duration-300 p-6 h-full flex flex-col">
                {/* Icon & Title */}
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-brown-dark ml-3 group-hover:text-gold-dark transition-colors">
                    {section.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-brown/70 flex-grow text-sm leading-relaxed">
                  {section.description}
                </p>

                {/* Action */}
                <div className="mt-4 pt-4 border-t border-gold-light/30">
                  <span className="inline-flex items-center text-gold-dark font-semibold text-sm group-hover:text-gold transition-colors">
                    Gérer
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12 w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl border border-gold-light shadow-xl p-6">
          <h3 className="text-lg font-bold text-brown-dark mb-4 text-center">
            Accès rapide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/admin/projects" 
              className="text-center p-3 rounded-lg border border-gold-light/50 hover:bg-gold-light/10 transition-colors"
            >
              <div className="text-2xl mb-1">📈</div>
              <div className="text-sm font-semibold text-brown-dark">Nouveau projet</div>
            </Link>
            <Link 
              href="/admin/services" 
              className="text-center p-3 rounded-lg border border-gold-light/50 hover:bg-gold-light/10 transition-colors"
            >
              <div className="text-2xl mb-1">✨</div>
              <div className="text-sm font-semibold text-brown-dark">Ajouter service</div>
            </Link>
            <Link 
              href="/admin/testimonials" 
              className="text-center p-3 rounded-lg border border-gold-light/50 hover:bg-gold-light/10 transition-colors"
            >
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-sm font-semibold text-brown-dark">Gérer avis</div>
            </Link>
            <Link 
              href="/admin/site" 
              className="text-center p-3 rounded-lg border border-gold-light/50 hover:bg-gold-light/10 transition-colors"
            >
              <div className="text-2xl mb-1">⚙️</div>
              <div className="text-sm font-semibold text-brown-dark">Config site</div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-brown/60 text-sm">
          💡 Conseil : Pensez à sauvegarder vos modifications après chaque édition
        </p>
      </motion.div>
    </motion.main>
  );
}