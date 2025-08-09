# 🚀 Guide de Déploiement Netlify

## Préparation locale

### 1. Test du build
```bash
# Nettoyer les anciens builds
npm run clean

# Builder l'application
npm run build

# Tester localement
npm run preview
```

### 2. Vérifications avant déploiement
- ✅ Tous les tests passent
- ✅ Aucune erreur TypeScript
- ✅ Build réussi sans warnings
- ✅ Preview fonctionne correctement

## Déploiement Netlify

### Option 1: Déploiement Git (Recommandé)

1. **Pusher sur GitHub/GitLab**
   ```bash
   git add .
   git commit -m "feat: ready for Netlify deployment"
   git push origin main
   ```

2. **Connecter à Netlify**
   - Aller sur [netlify.com](https://netlify.com)
   - "New site from Git"
   - Choisir votre repository
   - Configurer :
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: `18`

### Option 2: Déploiement Manuel

1. **Builder localement**
   ```bash
   npm run deploy
   ```

2. **Déployer via Netlify CLI**
   ```bash
   # Installer Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Déployer
   netlify deploy --prod --dir=dist
   ```

## Configuration Netlify

### Variables d'environnement
Si nécessaires, ajouter dans Netlify dashboard :
- `NODE_VERSION`: `18`
- `NPM_VERSION`: `9`

### Paramètres Build
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### Domaine personnalisé
1. Aller dans "Domain settings"
2. "Add custom domain"
3. Configurer DNS selon les instructions

## Optimisations Post-Déploiement

### 1. Performance
- ✅ Compression automatique activée (gzip/brotli)
- ✅ Cache headers configurés
- ✅ Assets minifiés
- ✅ Code splitting activé

### 2. Sécurité
- ✅ HTTPS automatique
- ✅ Headers de sécurité configurés
- ✅ XSS Protection
- ✅ Content Security Policy

### 3. SEO
- ✅ Meta tags dans index.html
- ✅ Redirections SPA configurées
- ✅ Sitemap (si nécessaire)

## Monitoring

### Analytics Netlify
- Activer dans les paramètres du site
- Suivre les métriques de performance

### Logs de Build
- Consulter les logs en cas d'erreur
- Vérifier les warnings

## Maintenance

### Updates régulières
```bash
# Mettre à jour les dépendances
npm update

# Audit de sécurité
npm audit

# Redéployer
git push origin main
```

### Rollback en cas de problème
```bash
# Via Netlify CLI
netlify rollback

# Ou via dashboard Netlify
```

## URLs de déploiement

- **Production**: `https://votre-site.netlify.app`
- **Branch previews**: Automatiques pour chaque PR
- **Deploy previews**: Pour chaque commit

## Troubleshooting

### Build qui échoue
1. Vérifier Node version (18)
2. Nettoyer node_modules : `rm -rf node_modules && npm install`
3. Tester build local : `npm run build`

### Problèmes de routing
- Vérifier `_redirects` et `netlify.toml`
- S'assurer que toutes les routes SPA redirigent vers index.html

### Performance lente
- Vérifier les chunks générés
- Optimiser les imports dynamiques
- Analyser le bundle : `npm run build:analyze` 