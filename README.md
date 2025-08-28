# LoftAlgerie - Gestion de Lofts en Algérie

Une application moderne de gestion de lofts et propriétés locatives en Algérie, construite avec Next.js 15, Supabase et TypeScript.

## 🏠 Fonctionnalités

### Gestion des Lofts
- ✅ **Catalogue complet** - Visualisation de tous les lofts avec détails
- ✅ **Disponibilité en temps réel** - Système de réservation et calendrier
- ✅ **Filtrage avancé** - Par région, propriétaire, prix, capacité
- ✅ **Gestion multi-statuts** - Disponible, occupé, maintenance

### Gestion Financière
- 💰 **Transactions** - Suivi des revenus et dépenses
- 📊 **Rapports** - Analyses financières détaillées
- 💳 **Méthodes de paiement** - Gestion multiple des paiements
- 💱 **Multi-devises** - Support DZD et autres devises

### Administration
- 👥 **Gestion des utilisateurs** - Rôles admin, manager, executive
- 🏢 **Propriétaires** - Gestion des propriétaires tiers et entreprise
- 📍 **Zones géographiques** - Organisation par régions
- 🔔 **Notifications** - Système de notifications en temps réel

### Fonctionnalités Techniques
- 🌐 **Multilingue** - Français, Anglais, Arabe
- 📱 **Responsive** - Interface adaptée mobile/desktop
- 🎨 **UI Moderne** - Design avec Tailwind CSS et shadcn/ui
- 🔐 **Authentification** - Sécurité avec Supabase Auth
- 📊 **Base de données** - PostgreSQL via Supabase

## 🚀 Technologies

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Internationalisation**: react-i18next
- **Tests**: Jest, Playwright
- **Déploiement**: Vercel

## 📦 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/loft-algerie.git
cd loft-algerie
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
```bash
cp .env.example .env.local
```

Remplir les variables d'environnement :
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ajouter des données d'exemple** (optionnel)
```bash
npm run db:seed-lofts
```

## 🗄️ Structure de la Base de Données

### Tables principales
- `lofts` - Informations des propriétés
- `loft_owners` - Propriétaires des lofts
- `zone_areas` - Zones géographiques
- `transactions` - Transactions financières
- `users` - Utilisateurs du système
- `notifications` - Notifications

## 🎯 Pages Principales

- `/` - Dashboard principal
- `/lofts` - Gestion des lofts
- `/availability` - Disponibilités et réservations
- `/transactions` - Gestion financière
- `/reports` - Rapports et analyses
- `/owners` - Gestion des propriétaires

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Tests
npm test
npm run test:e2e

# Base de données
npm run db:seed-lofts        # Ajouter des lofts d'exemple
npm run db:migrate           # Migrations
npm run db:backup           # Sauvegarde

# Internationalisation
npm run i18n:scan           # Scanner les traductions
```

## 🌍 Langues Supportées

- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **English**
- 🇩🇿 **العربية**

## 📱 Pages de Debug/Test

- `/debug-lofts` - Vérifier le contenu de la base de données
- `/test-api` - Tester les APIs
- `/add-sample-lofts` - Ajouter des données d'exemple

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- **Email**: contact@loftalgerie.com
- **Website**: https://loftalgerie.com

---

**LoftAlgerie** - Simplifiez la gestion de vos propriétés locatives en Algérie 🏠🇩🇿