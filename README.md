#  Mabelle Consulting - Site Web Corporate

Site web vitrine moderne pour **Mabelle Consulting**, agence de communication 360° et production audiovisuelle basée à Dakar, Sénégal.

## �� Description du Projet

Mabelle Consulting est une agence créative spécialisée dans la communication 360°, la production audiovisuelle, la photographie professionnelle et le conseil en stratégie de marque. Ce site web présente leurs services, réalisations et permet aux clients de prendre contact.

## �� Technologies Utilisées

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Stockage**: Vercel Blob Storage
- **Déploiement**: Vercel
- **Email**: Nodemailer

## Fonctionnalités

###  Interface Publique
- **Page d'accueil** avec slider d'images et animations fluides
- **À propos** avec présentation de l'équipe et des valeurs
- **Services** détaillés avec galerie interactive
- **Réalisations** portfolio des projets clients
- **Témoignages** clients
- **Contact** avec formulaire fonctionnel

### Interface d'Administration
- **Dashboard** de gestion du contenu
- **Gestion des projets** (ajout, modification, suppression)
- **Gestion des services** avec icônes personnalisées
- **Gestion des témoignages** clients
- **Gestion du contenu du site** (textes, images, sliders)
- **Gestion de l'équipe** (membres, rôles, photos)
- **Upload d'images** avec stockage cloud

### Fonctionnalités Techniques
- **API REST** complète pour la gestion du contenu
- **Authentification** sécurisée pour l'admin
- **Responsive design** optimisé mobile/desktop
- **Animations** fluides et professionnelles
- **SEO** optimisé
- **Performance** optimisée

## Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Vercel (pour le déploiement)

### Installation
```bash
# Cloner le repository
git clone https://github.com/MOHAMED-221/mabelle-consulting.git
cd mabelle-consulting

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Email (optionnel)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

##  Design et UX

- **Palette de couleurs** : Or (#CEA472) et Marron (#754831)
- **Typographie** : Geist (Vercel)
- **Animations** : Transitions fluides avec Framer Motion
- **Responsive** : Mobile-first design
- **Accessibilité** : Navigation clavier et lecteurs d'écran

##  Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
Le projet peut être déployé sur :
- Netlify
- Railway
- Heroku
- AWS Amplify

##  Pages Principales

###  Accueil
- Hero section avec slider d'images
- Présentation de la mission
- Services mis en avant
- Réalisations récentes
- Chiffres clés animés
- Call-to-action

### À Propos
- Présentation de l'agence
- Équipe avec photos
- Valeurs et engagements
- Clients et partenaires

### Services
- Production audiovisuelle
- Photographie professionnelle
- Conseil & expertise
- Image aérienne
- Stratégie de communication
- Branding & storytelling

### Réalisations
- Galerie de projets clients
- Filtres par catégorie
- Détails des projets

## Administration

Accès admin : `/admin`
- Gestion complète du contenu
- Upload d'images
- Modification des textes
- Gestion des projets et services

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

##  Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Développeur

**Mohamed** - [@MOHAMED-221](https://github.com/MOHAMED-221)


- **Site web** : [Mabelle Consulting](https://mabelle-consulting.vercel.app)
- **Email** : contact@mabelle-consulting.com
- **GitHub** : [MOHAMED-221/mabelle-consulting](https://github.com/MOHAMED-221/mabelle-consulting)

