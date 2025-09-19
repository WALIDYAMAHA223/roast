# 🔥 Configuration Firebase Analytics

## Vue d'ensemble

Firebase Analytics a été intégré dans votre application Roast/Compliment pour suivre l'engagement des utilisateurs et les métriques importantes.

## 📊 Événements Trackés

### 1. **Génération de Contenu**
- `roast_generated` - Quand un roast est généré
- `compliment_generated` - Quand un compliment est généré

### 2. **Interactions Utilisateur**
- `mode_switched` - Changement entre mode roast/compliment
- `message_reaction` - Réactions (like/dislike) sur les messages
- `ai_limit_reached` - Quand la limite IA est atteinte

### 3. **Navigation**
- `page_view` - Vue de page automatique

## 🛠️ Configuration

### Fichiers Principaux
- `lib/firebase.ts` - Configuration Firebase
- `hooks/use-analytics.ts` - Hook personnalisé pour les analytics
- `components/analytics-dashboard.tsx` - Tableau de bord des métriques
- `app/analytics/page.tsx` - Page des analytics

### Variables d'Environnement
Aucune variable d'environnement supplémentaire n'est nécessaire car la configuration Firebase est publique.

## 📈 Utilisation

### Dans les Composants
```typescript
import { useAnalytics } from "@/hooks/use-analytics"

function MyComponent() {
  const { trackRoastGeneration, trackModeSwitch } = useAnalytics()
  
  const handleRoast = () => {
    // ... logique de génération
    trackRoastGeneration(username)
  }
}
```

### Événements Disponibles
- `trackEvent(eventName, parameters)` - Événement personnalisé
- `trackRoastGeneration(target?)` - Génération de roast
- `trackComplimentGeneration(target?)` - Génération de compliment
- `trackModeSwitch(newMode)` - Changement de mode
- `trackReaction(messageType, reaction)` - Réaction utilisateur
- `trackAILimitReached()` - Limite IA atteinte

## 🎯 Métriques Disponibles

### Dashboard Analytics (`/analytics`)
- **Roasts Générés** - Nombre total de roasts créés
- **Compliments Générés** - Nombre total de compliments créés
- **Réactions Totales** - Nombre de likes/dislikes
- **Changements de Mode** - Fréquence de basculement
- **Limites IA Atteintes** - Nombre de fois où l'IA a atteint sa limite
- **Utilisateurs Actifs** - Estimation basée sur les générations

## 🔍 Accès aux Données

### Firebase Console
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `roast-ea643`
3. Naviguez vers **Analytics** > **Events**
4. Consultez les événements en temps réel

### Dashboard Local
- URL: `http://localhost:3001/analytics`
- Données simulées pour le développement
- Design cohérent avec l'application

## 🚀 Déploiement

### Vercel
Firebase Analytics fonctionne automatiquement en production sans configuration supplémentaire.

### Variables d'Environnement
```bash
# Aucune variable supplémentaire nécessaire
# La configuration Firebase est publique
```

## 📱 Compatibilité

- ✅ **Navigateurs modernes** - Chrome, Firefox, Safari, Edge
- ✅ **Mobile** - iOS Safari, Android Chrome
- ✅ **SSR** - Compatible avec Next.js
- ✅ **PWA** - Support des Progressive Web Apps

## 🔧 Dépannage

### Analytics ne fonctionne pas
1. Vérifiez la console du navigateur pour les erreurs
2. Assurez-vous que Firebase est correctement initialisé
3. Vérifiez la configuration dans `lib/firebase.ts`

### Données manquantes
1. Les données peuvent prendre jusqu'à 24h à apparaître
2. Utilisez le dashboard local pour les tests
3. Vérifiez les événements dans Firebase Console

## 📚 Ressources

- [Documentation Firebase Analytics](https://firebase.google.com/docs/analytics)
- [Guide d'implémentation](https://firebase.google.com/docs/analytics/get-started)
- [Événements personnalisés](https://firebase.google.com/docs/analytics/events)
