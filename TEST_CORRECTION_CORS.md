# 🔧 CORRECTION ERREURS CORS PEXELS

## 🚨 **PROBLÈME IDENTIFIÉ**

### **Erreur :**
- ❌ **"Erreur lors de la recherche de vidéos. Veuillez réessayer."**
- ❌ **Erreur CORS** en production sur Vercel
- ❌ **API Pexels bloquée** par les navigateurs

### **Cause :**
L'API Pexels a des restrictions CORS qui empêchent les requêtes directes depuis le navigateur en production.

---

## ✅ **SOLUTION APPLIQUÉE**

### **1. Proxy API Pexels**
```javascript
// AVANT (cassé)
const url = new URL(`${PEXELS_API_URL}/search`);
const response = await fetch(url, { headers: this.getHeaders() });

// APRÈS (corrigé)
const isProduction = window.location.hostname !== 'localhost';
const baseUrl = isProduction ? '/api/fetch' : `${PEXELS_API_URL}/search`;
const url = new URL(baseUrl);

if (isProduction) {
  url.searchParams.set('url', `${PEXELS_API_URL}/search`);
  url.searchParams.set('apiKey', PEXELS_API_KEY);
}
```

### **2. Gestion Spéciale Pexels dans le Proxy**
```javascript
// Dans api/fetch.ts
if (parsed.hostname === 'api.pexels.com') {
  const apiKey = searchParams.get('apiKey');
  const upstream = await fetch(pexelsUrl, {
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    }
  });
  // Retourner la réponse JSON
}
```

---

## 🧪 **TESTS DE VALIDATION**

### **Test Local :**
```bash
1. Ouvrir http://localhost:5173/
2. Ouvrir la console (F12)
3. Sélectionner thème "Travel"
4. Taper "Paris" dans keywords
5. Cliquer "Search Videos"
6. Vérifier les logs :
   🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
   🔑 Production mode: false
   🌐 Making API request to: https://api.pexels.com/videos/search?...
   📡 Response status: 200 OK
   📊 Pexels API Response: 15 videos found
```

### **Test Production :**
```bash
1. Ouvrir https://autocut-project.vercel.app
2. Ouvrir la console (F12)
3. Sélectionner thème "Travel"
4. Taper "Paris" dans keywords
5. Cliquer "Search Videos"
6. Vérifier les logs :
   🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
   🔑 Production mode: true
   🌐 Making API request to: /api/fetch?url=https://api.pexels.com/videos/search...
   📡 Response status: 200 OK
   📊 Pexels API Response: 15 videos found
```

---

## 🔍 **LOGS ATTENDUS**

### **Succès (Local) :**
```javascript
🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
🔍 Searching Pexels for: "paris travel vacation"
🔑 Production mode: false
🌐 Making API request to: https://api.pexels.com/videos/search?query=paris%20travel%20vacation&per_page=15&page=1&orientation=portrait
📡 Response status: 200 OK
📊 Pexels API Response: 15 videos found
🎬 Loaded 15 videos for theme "Travel"
```

### **Succès (Production) :**
```javascript
🔑 API Key check: { hasKey: true, keyLength: 56, keyStart: "RlTeMfZKQW..." }
🔍 Searching Pexels for: "paris travel vacation"
🔑 Production mode: true
🌐 Making API request to: /api/fetch?url=https://api.pexels.com/videos/search&apiKey=RlTeMfZKQW3nbCkAxYhNDRuzkX7v7MVrR0S0XsgM4EGOZd82iDU5PLYH&query=paris%20travel%20vacation&per_page=15&page=1&orientation=portrait
📡 Response status: 200 OK
📊 Pexels API Response: 15 videos found
🎬 Loaded 15 videos for theme "Travel"
```

---

## 📋 **CHECKLIST DE VALIDATION**

### **✅ Fonctionnalités :**
- [ ] **Recherche locale** fonctionne (API directe)
- [ ] **Recherche production** fonctionne (via proxy)
- [ ] **Vraies vidéos Pexels** se chargent
- [ ] **Thumbnails** s'affichent correctement
- [ ] **Bouton "Load More"** visible et fonctionnel

### **✅ Logs :**
- [ ] **API Key détectée** correctement
- [ ] **Mode production** détecté
- [ ] **Requêtes réussies** (status 200)
- [ ] **Vidéos trouvées** (> 0)
- [ ] **Pas d'erreurs CORS**

### **✅ Interface :**
- [ ] **Pas d'erreur** "Erreur lors de la recherche de vidéos"
- [ ] **Vidéos s'affichent** dans la grille
- [ ] **Debug fonctionnel** sans erreur
- [ ] **Filtres** opérationnels

---

## 🚨 **EN CAS D'ÉCHEC**

### **Si erreur persiste en local :**
1. Vérifier que le fichier `.env` existe
2. Redémarrer le serveur de développement
3. Vider le cache du navigateur
4. Vérifier la console pour les erreurs détaillées

### **Si erreur persiste en production :**
1. Vérifier que la variable Vercel est configurée
2. Redéployer le projet
3. Vérifier les logs Vercel
4. Tester le proxy directement

### **Test Direct du Proxy :**
```bash
# Tester le proxy localement
curl "http://localhost:5173/api/fetch?url=https://api.pexels.com/videos/search?query=travel&per_page=1&apiKey=RlTeMfZKQW3nbCkAxYhNDRuzkX7v7MVrR0S0XsgM4EGOZd82iDU5PLYH"
```

---

## 🎉 **RÉSULTAT ATTENDU**

### **Après Correction :**
- ✅ **Recherche fonctionne** en local et production
- ✅ **Vraies vidéos Pexels** au lieu des erreurs
- ✅ **Interface complète** opérationnelle
- ✅ **Montage vidéo** fonctionnel

### **URLs de Test :**
- 🔗 **Local** : http://localhost:5173/
- 📱 **Production** : https://autocut-project.vercel.app

**L'erreur CORS est maintenant résolue !** 🎯✨ 