# 🔍 GUIDE DE DIAGNOSTIC - PROBLÈMES VIDÉOS

## 🚨 **PROBLÈMES IDENTIFIÉS ET SOLUTIONS**

### **1. Vidéos ne correspondent pas aux recherches** 🎯

#### **Problème :**
- Les vidéos affichées ne correspondent pas au thème recherché
- Même vidéos pour tous les thèmes

#### **Solutions Appliquées :**
- ✅ **URLs variées par thème** : Chaque thème a maintenant des vidéos différentes
- ✅ **Mots-clés améliorés** : Recherche plus précise avec l'API Pexels
- ✅ **Diagnostic console** : Logs détaillés pour vérifier les recherches

#### **Comment Vérifier :**
1. **Ouvrir la console** (F12)
2. **Rechercher un thème** (ex: "Travel")
3. **Vérifier les logs** :
   ```
   🔍 Searching Pexels for: "travel vacation adventure"
   📡 API URL: https://api.pexels.com/videos/search?query=...
   📊 Pexels API Response: X videos found
   ```

---

### **2. Trim Bug - Impossible de déplacer la zone** 🎬

#### **Problème :**
- La zone de trim ne peut pas être déplacée
- Drag & drop ne fonctionne pas

#### **Solutions Appliquées :**
- ✅ **Gestion d'événements améliorée** : `preventDefault()` ajouté
- ✅ **Feedback visuel** : Indicateur de drag avec "🎯 Dragging..."
- ✅ **Logs de debug** : Console logs pour tracer les mouvements
- ✅ **Événements multiples** : `onMouseMove`, `onMouseUp`, `onMouseLeave`

#### **Comment Tester :**
1. **Ouvrir le trimmer** d'une vidéo
2. **Cliquer et glisser** sur la zone verte
3. **Vérifier la console** pour les logs :
   ```
   🎯 Mouse down - starting drag
   🎯 Mouse move - new time: 15.2s
   🎯 Mouse up - ending drag
   ```

---

### **3. Vidéos ne se chargent pas** 📹

#### **Problème :**
- Vidéos ne se chargent pas dans la preview
- Erreurs de chargement dans le trimmer

#### **Solutions Appliquées :**
- ✅ **Fallback automatique** : Si proxy échoue → URL directe
- ✅ **Gestion d'erreurs** : Messages d'erreur détaillés
- ✅ **Preload metadata** : Chargement optimisé
- ✅ **Composant de debug** : Test des URLs proxy vs directes

#### **Comment Diagnostiquer :**
1. **Cliquer sur "🔍 Debug"** sur une vidéo
2. **Vérifier les URLs** affichées
3. **Tester les boutons** "Test Proxy URL" et "Test Direct URL"
4. **Vérifier les erreurs** dans la console

---

## 🛠️ **OUTILS DE DIAGNOSTIC**

### **1. Composant VideoDebug** 🔍

**Accès :** Cliquer sur "🔍 Debug" sur n'importe quelle vidéo

**Fonctionnalités :**
- ✅ **État de la vidéo** : Chargée, erreur, durée, etc.
- ✅ **URLs comparées** : Proxy vs Direct
- ✅ **Test des URLs** : Boutons de test
- ✅ **Lecteur vidéo** : Preview avec contrôles
- ✅ **Messages d'erreur** : Détails des erreurs

### **2. Logs Console** 📊

**Ouvrir :** F12 → Console

**Logs Importants :**
```
🔍 Searching Pexels for: "travel vacation adventure"
📡 API URL: https://api.pexels.com/videos/search?...
📊 Pexels API Response: 15 videos found
🎬 Loaded 15 videos for theme "Travel"
🎯 Mouse down - starting drag
🎯 Mouse move - new time: 15.2s
✅ Video metadata loaded: duration=30.5, readyState=4
❌ Video loading error: [details]
```

---

## 🎯 **PROCÉDURE DE DIAGNOSTIC**

### **Étape 1 : Vérifier l'API Pexels**
1. **Ouvrir la console** (F12)
2. **Rechercher des vidéos** dans l'interface
3. **Vérifier les logs** :
   - ✅ `🔑 Using API key: Yes`
   - ✅ `📊 Pexels API Response: X videos found`
   - ❌ Si erreur → Vérifier la clé API

### **Étape 2 : Tester le Trim**
1. **Assigner une vidéo** à un plan
2. **Ouvrir le trimmer** (icône ciseaux)
3. **Essayer de déplacer** la zone verte
4. **Vérifier les logs** de drag & drop

### **Étape 3 : Diagnostiquer le Chargement**
1. **Cliquer sur "🔍 Debug"** sur une vidéo problématique
2. **Vérifier l'état** : Loaded, Error, Duration
3. **Tester les URLs** : Proxy vs Direct
4. **Vérifier les erreurs** affichées

---

## 🔧 **SOLUTIONS RAPIDES**

### **Si les vidéos ne se chargent pas :**
1. **Vérifier la connexion internet**
2. **Tester l'URL directe** dans le debug
3. **Vérifier les erreurs CORS** dans la console
4. **Redémarrer l'application** : `npm run dev`

### **Si le trim ne fonctionne pas :**
1. **Vérifier que la vidéo est chargée** (durée > 0)
2. **Essayer de cliquer** sur la timeline
3. **Vérifier les logs** de drag & drop
4. **Redimensionner la fenêtre** si nécessaire

### **Si les recherches ne correspondent pas :**
1. **Vérifier les logs** de recherche
2. **Tester avec l'API Pexels** (si clé configurée)
3. **Vérifier les mots-clés** dans la console
4. **Essayer un autre thème**

---

## 📋 **CHECKLIST DE VÉRIFICATION**

### **✅ Fonctionnalités de Base :**
- [ ] **Recherche de vidéos** fonctionne
- [ ] **Affichage des thumbnails** correct
- [ ] **Assignation aux plans** possible
- [ ] **Ouverture du trimmer** sans erreur

### **✅ Fonctionnalités Avancées :**
- [ ] **Drag & drop** de la zone de trim
- [ ] **Chargement des vidéos** dans le trimmer
- [ ] **Export FFmpeg** fonctionnel
- [ ] **Debug des vidéos** accessible

### **✅ Diagnostic :**
- [ ] **Logs console** informatifs
- [ ] **Composant debug** fonctionnel
- [ ] **Messages d'erreur** clairs
- [ ] **Fallback automatique** opérationnel

---

## 🎉 **RÉSULTAT ATTENDU**

**Après les corrections :**
- ✅ **Vidéos variées** par thème
- ✅ **Trim fonctionnel** avec drag & drop
- ✅ **Chargement fiable** avec fallback
- ✅ **Diagnostic complet** disponible
- ✅ **Interface stable** et responsive

**L'application devrait maintenant fonctionner parfaitement !** 🚀 