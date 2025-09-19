# Roast Me / Compliment Me

Une application web moderne et fun qui génère des roasts ou des compliments personnalisés, avec un design soigné et des fonctionnalités de sécurité intégrées.

## 🚀 Fonctionnalités

### Modes de génération
- **Mode Roast** : Génère des roasts amusants et créatifs
- **Mode Compliment** : Crée des compliments sincères et motivants
- **Mode Sécurisé** : Filtre automatiquement le contenu inapproprié

### Personnalisation
- **Ciblage** : Personnalisez avec un prénom ou pseudo
- **Contexte** : Choisissez parmi Gym, Gaming, Études, Auto/Moto, Tech, Lifestyle
- **Intensité** : Léger, Moyen, ou Épicé (respectant le mode sécurisé)
- **Langues** : Français et Anglais

### Fonctionnalités avancées
- **Historique** : Conserve les 50 derniers roasts/compliments
- **Recherche** : Trouvez facilement vos contenus précédents
- **Export** : Copiez ou téléchargez en PNG
- **Raccourcis clavier** : R (roast), C (compliment), S (historique)
- **Thèmes** : Mode sombre/clair avec détection automatique
- **Responsive** : Optimisé pour mobile et desktop

## 🛠️ Technologies

- **Framework** : Next.js 14+ (App Router, TypeScript)
- **UI** : Tailwind CSS + shadcn/ui
- **Thèmes** : next-themes
- **Export** : html2canvas
- **Animations** : canvas-confetti
- **Tests** : Jest

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm, yarn ou pnpm

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd roast-me-app
```

2. **Installer les dépendances**
```bash
# Avec npm
npm install

# Avec yarn
yarn install

# Avec pnpm
pnpm install
```

3. **Initialiser shadcn/ui**
```bash
npx shadcn-ui@latest init
```

4. **Ajouter les composants shadcn/ui nécessaires**
```bash
npx shadcn-ui@latest add button card input select switch sheet badge
```

5. **Installer les dépendances Radix UI**
```bash
npm install @radix-ui/react-slot @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-dialog
```

6. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Lancer les tests en mode watch
npm run test:watch
```

## 🚀 Déploiement sur Vercel

### Option 1 : Déploiement automatique
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement Next.js et configurera le build
3. Déployez en un clic !

### Option 2 : Déploiement manuel
1. **Installer Vercel CLI**
```bash
npm i -g vercel
```

2. **Déployer**
```bash
vercel
```

3. **Suivre les instructions** pour configurer le projet

### Configuration Vercel
- **Framework Preset** : Next.js
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

## 📁 Structure du projet

```
roast-me-app/
├── app/                    # App Router Next.js
│   ├── api/               # API routes (stub pour l'instant)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── LayoutHeader.tsx  # Header avec thème et langue
│   ├── Hero.tsx          # Section héro
│   ├── ControlsPanel.tsx # Panneau de contrôles
│   ├── RoastCard.tsx     # Carte d'affichage du contenu
│   ├── HistoryDrawer.tsx # Drawer d'historique
│   └── Footer.tsx        # Footer
├── hooks/                # Hooks personnalisés
│   └── useAnalytics.ts   # Hook d'analytics
├── lib/                  # Utilitaires et logique
│   ├── types.ts          # Types TypeScript
│   ├── filters.ts        # Système de filtrage
│   ├── roasts.ts         # Templates de roasts
│   ├── compliments.ts    # Templates de compliments
│   └── utils.ts          # Utilitaires généraux
├── __tests__/            # Tests unitaires
│   └── filters.test.ts   # Tests du système de filtrage
└── public/               # Assets statiques
```

## 🎨 Personnalisation

### Ajouter de nouveaux templates
1. Modifiez `lib/roasts.ts` ou `lib/compliments.ts`
2. Ajoutez vos templates dans les catégories appropriées
3. Utilisez `{{target}}` comme placeholder pour la cible

### Modifier les filtres de sécurité
1. Éditez `lib/filters.ts`
2. Ajoutez des mots à la liste `BLOCKED_WORDS`
3. Ajoutez des patterns à `PROBLEMATIC_PATTERNS`

### Ajouter de nouvelles langues
1. Créez de nouveaux fichiers de templates
2. Modifiez `lib/types.ts` pour ajouter la langue
3. Mettez à jour les composants UI

## 🔒 Sécurité

- **Mode Sécurisé** activé par défaut
- **Filtrage automatique** du contenu inapproprié
- **Fallbacks sûrs** en cas de contenu bloqué
- **Respect des identités protégées**
- **Aucun tracking externe** (analytics en console uniquement)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Radix UI](https://www.radix-ui.com/) - Primitives UI
- [Lucide React](https://lucide.dev/) - Icônes

---

**Fait avec ❤️ + v0 + shadcn/ui**

*Roasts fun, jamais haineux. Respectez les autres et amusez-vous bien !*




