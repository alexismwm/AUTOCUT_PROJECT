# 🚀 GUIDE AUTO-COMMIT GIT

## 📋 **Utilisation du Script Auto-Commit**

### **Commandes Disponibles :**

#### **1. Commit automatique avec message par défaut**
```bash
npm run commit
# ou
npm run push
# ou
./scripts/auto-commit.sh
```

#### **2. Commit avec message personnalisé**
```bash
npm run commit "feat: nouvelle fonctionnalité"
# ou
./scripts/auto-commit.sh "fix: correction bug vidéo"
```

#### **3. Messages de commit recommandés**
```bash
# Nouvelles fonctionnalités
npm run commit "feat: ajout système de cache vidéo"

# Corrections de bugs
npm run commit "fix: correction export FFmpeg"

# Améliorations
npm run commit "perf: optimisation chargement vidéos"

# Documentation
npm run commit "docs: mise à jour README"

# Refactoring
npm run commit "refactor: simplification service Pexels"
```

---

## 🔧 **Fonctionnalités du Script**

### **✅ Actions Automatiques :**
1. **Vérification** des changements non commités
2. **Ajout** de tous les fichiers modifiés
3. **Affichage** du statut des changements
4. **Commit** avec le message fourni
5. **Push** vers le repository distant
6. **Feedback** coloré et informatif

### **🛡️ Gestion d'Erreurs :**
- ✅ **Aucun changement** → Message d'information
- ✅ **Erreur de commit** → Arrêt avec message d'erreur
- ✅ **Erreur de push** → Arrêt avec message d'erreur

---

## 📊 **Exemple d'Utilisation**

### **Scénario 1 : Développement quotidien**
```bash
# Après avoir modifié des fichiers
npm run commit "feat: amélioration interface utilisateur"
```

**Résultat :**
```
🚀 Auto-commit AUTOCUT_PROJECT
Message: feat: amélioration interface utilisateur

📁 Ajout des fichiers...
📊 Statut des changements:
M  src/components/PexelsVideoManager.tsx
M  src/services/pexelsService.ts
💾 Commit des changements...
[main abc1234] feat: amélioration interface utilisateur
 2 files changed, 45 insertions(+), 12 deletions(-)
✅ Commit réussi
🚀 Push vers le repository...
✅ Push réussi
🎉 Auto-commit terminé avec succès!
```

### **Scénario 2 : Aucun changement**
```bash
npm run commit
```

**Résultat :**
```
🚀 Auto-commit AUTOCUT_PROJECT
Message: feat: mise à jour automatique

⚠️  Aucun changement détecté
```

---

## 🎯 **Bonnes Pratiques**

### **1. Messages de Commit Clairs**
```bash
# ✅ Bon
npm run commit "feat: ajout filtres par durée vidéo"

# ❌ Éviter
npm run commit "update"
```

### **2. Utilisation des Préfixes**
- `feat:` - Nouvelles fonctionnalités
- `fix:` - Corrections de bugs
- `perf:` - Améliorations de performance
- `docs:` - Documentation
- `refactor:` - Refactoring de code
- `test:` - Tests
- `chore:` - Tâches de maintenance

### **3. Messages Descriptifs**
```bash
# ✅ Bon
npm run commit "fix: correction téléchargement vidéos Pexels avec proxy"

# ❌ Éviter
npm run commit "fix bug"
```

---

## 🔄 **Intégration dans le Workflow**

### **Workflow Recommandé :**
1. **Développer** vos fonctionnalités
2. **Tester** localement
3. **Commit automatique** : `npm run commit "description"`
4. **Vérifier** le push sur GitHub
5. **Continuer** le développement

### **Avantages :**
- ✅ **Sauvegarde automatique** de votre travail
- ✅ **Historique clair** des modifications
- ✅ **Collaboration facilitée** avec l'équipe
- ✅ **Rollback facile** en cas de problème

---

## 🚨 **Important**

### **Fichiers Ignorés :**
Le script respecte votre `.gitignore` :
- `node_modules/`
- `.env` (contient vos clés API)
- `dist/`
- Fichiers temporaires

### **Sécurité :**
- ✅ **Clés API** dans `.env` (non commitées)
- ✅ **Fichiers sensibles** protégés
- ✅ **Vérification** avant commit

---

## 🎉 **Résultat**

**Maintenant vous pouvez :**
- ✅ **Commiter automatiquement** avec `npm run commit`
- ✅ **Pousser automatiquement** vers GitHub
- ✅ **Garder un historique** propre et clair
- ✅ **Collaborer efficacement** avec l'équipe

**Plus besoin de se souvenir des commandes Git !** 🚀 