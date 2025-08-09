# 🔑 CONFIGURATION PEXELS SUR VERCEL

## 🚨 **PROBLÈME IDENTIFIÉ**

### **Cause :**
- ❌ **Fichier .env manquant** en local
- ❌ **Variables d'environnement** non configurées sur Vercel
- ❌ **Application utilise les données mock** au lieu de l'API Pexels

### **Solution :**
Configurer la clé API Pexels sur Vercel pour que l'application utilise de vraies vidéos.

---

## ✅ **ÉTAPES DE CONFIGURATION**

### **Étape 1 : Vérifier la Clé API Locale**
```bash
# Vérifier que le fichier .env existe
cat .env

# Résultat attendu :
VITE_PEXELS_API_KEY=RlTeMfZKQW3nbCkAxYhNDRuzkX7v7MVrR0S0XsgM4EGOZd82iDU5PLYH
```

### **Étape 2 : Configurer Vercel**
1. **Aller sur** https://vercel.com/dashboard
2. **Sélectionner** votre projet `AUTOCUT_PROJECT`
3. **Cliquer sur** "Settings"
4. **Aller dans** "Environment Variables"
5. **Ajouter** une nouvelle variable :
   - **Name** : `VITE_PEXELS_API_KEY`
   - **Value** : `RlTeMfZKQW3nbCkAxYhNDRuzkX7v7MVrR0S0XsgM4EGOZd82iDU5PLYH`
   - **Environment** : Production, Preview, Development
6. **Cliquer** "Save"

### **Étape 3 : Redéployer**
1. **Aller dans** "Deployments"
2. **Cliquer sur** "Redeploy" sur le dernier déploiement
3. **Attendre** la fin du déploiement

---

## 🧪 **TEST DE VALIDATION**

### **Test Local :**
```bash
1. Ouvrir http://localhost:5173/
2. Ouvrir la console (F12)
3. Sélectionner un thème (ex: "Travel")
4. Cliquer "Search Videos"
5. Vérifier les logs :
   🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
   🔍 Searching Pexels for: "travel vacation adventure"
   📊 Pexels API Response: 15 videos found
```

### **Test Production :**
```bash
1. Ouvrir https://autocut-project.vercel.app
2. Ouvrir la console (F12)
3. Sélectionner un thème (ex: "Travel")
4. Cliquer "Search Videos"
5. Vérifier que de vraies vidéos Pexels se chargent
```

---

## 🔍 **LOGS ATTENDUS**

### **Avec API Pexels (Correct) :**
```javascript
🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
🔍 Searching Pexels for: "travel vacation adventure"
📡 API URL: https://api.pexels.com/videos/search?query=travel%20vacation%20adventure&per_page=15&page=1&orientation=portrait
🔑 Using API key: Yes
📊 Pexels API Response: 15 videos found
🎬 Loaded 15 videos for theme "Travel"
```

### **Sans API Pexels (Incorrect) :**
```javascript
🔑 API Key check: { hasKey: false, keyLength: 0, keyStart: "none" }
🔑 Pexels API key not found. Using mock data.
💡 To use real Pexels videos, add VITE_PEXELS_API_KEY to your .env file
🎬 Loaded 15 videos for theme "Travel"
```

---

## 📋 **CHECKLIST DE VALIDATION**

### **✅ Configuration :**
- [ ] **Fichier .env** créé en local
- [ ] **Variable Vercel** configurée
- [ ] **Redéploiement** effectué
- [ ] **Logs API** corrects

### **✅ Fonctionnalités :**
- [ ] **Vraies vidéos Pexels** se chargent
- [ ] **Recherche "Paris"** fonctionne
- [ ] **Bouton "Load More"** visible
- [ ] **Filtres** opérationnels
- [ ] **Thumbnails** s'affichent

### **✅ Debug :**
- [ ] **Video Debug** montre Loaded: true
- [ ] **URLs Pexels** dans le debug
- [ ] **Pas d'erreur** MEDIA_ERR_SRC_NOT_SUPPORTED

---

## 🚨 **PROBLÈMES POTENTIELS**

### **Si les vidéos ne se chargent toujours pas :**
1. **Vérifier** que la variable Vercel est bien configurée
2. **Redéployer** complètement le projet
3. **Vider le cache** du navigateur
4. **Vérifier** les logs de la console

### **Si l'API retourne des erreurs :**
1. **Vérifier** que la clé API est valide
2. **Vérifier** les quotas Pexels (200 req/h)
3. **Attendre** quelques minutes et réessayer

---

## 🎉 **RÉSULTAT ATTENDU**

### **Après Configuration :**
- ✅ **Vraies vidéos Pexels** au lieu des vidéos de démonstration
- ✅ **Recherche fonctionnelle** avec mots-clés personnalisés
- ✅ **Pagination** avec bouton "Load More"
- ✅ **Filtres** par auteur et durée
- ✅ **Interface** complètement fonctionnelle

### **URLs Importantes :**
- 🔗 **Dashboard Vercel** : https://vercel.com/dashboard
- 📱 **Site de Production** : https://autocut-project.vercel.app
- 🔑 **API Pexels** : https://api.pexels.com/

**Une fois configuré, vous aurez un outil de montage vidéo complet avec de vraies vidéos Pexels !** 🎯✨ 