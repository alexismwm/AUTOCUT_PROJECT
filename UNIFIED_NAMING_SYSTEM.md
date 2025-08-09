# 🗂️ Système de Nomenclature Unifié

## 🎯 **Vue d'Ensemble**

**TOUTES les exportations** utilisent maintenant le **même format de nom** basé sur les champs de l'interface :

```
{Category}_{Template#}_{MusicID}_{PlanCount}_{Duration}s_{Type}
```

**Exemple** : `Travel_006_012_4_13s_project.json`

---

## 📋 **Format Unifié Détaillé**

### **Structure de Base** :
```
Category_TemplateNumber_MusicId_PlanCount_DurationS
```

### **Exemples Concrets** :
- **Category** : `Travel` (depuis champ "Category")  
- **Template #** : `006` (depuis champ "Template #")
- **Music ID** : `012` (depuis champ "Music ID")
- **Plan Count** : `4` (calculé automatiquement selon les cuts)
- **Duration** : `13s` (durée audio trimmée)

---

## 📁 **Types de Fichiers Supportés**

| Type de Fichier | Suffixe | Exemple |
|------------------|---------|---------|
| **Projet JSON** | `_project.json` | `Travel_006_012_4_13s_project.json` |
| **Audio Trimmé** | `_music_trimmed_11s-24s_13s.wav` | `Travel_006_012_4_13s_music_trimmed_11s-24s_13s.wav` |
| **Vidéo Finale HD** | `_render_HD.mp4` | `Travel_006_012_4_13s_render_HD.mp4` |
| **Vidéo Finale SD** | `_render_SD.mp4` | `Travel_006_012_4_13s_render_SD.mp4` |
| **Thumbnail Large** | `_thumbnail_large_1080x1920.jpeg` | `Travel_006_012_4_13s_thumbnail_large_1080x1920.jpeg` |
| **Thumbnail Small** | `_thumbnail_small_540x960.jpeg` | `Travel_006_012_4_13s_thumbnail_small_540x960.jpeg` |
| **Vidéo Brute Plan 1** | `_video1.mp4` | `Travel_006_012_4_13s_video1.mp4` |
| **Vidéo Brute Plan 2** | `_video2.mp4` | `Travel_006_012_4_13s_video2.mp4` |
| **Instructions** | `_MONTAGE_INSTRUCTIONS.txt` | `Travel_006_012_4_13s_MONTAGE_INSTRUCTIONS.txt` |

---

## 🏗️ **Architecture Technique**

### **Service Centralisé** : `src/services/fileNamingService.ts`

```typescript
export class FileNamingService {
  // Génère le préfixe de base commun
  static generateBasePrefix(context: NamingContext): string

  // Types spécifiques
  static generateProjectFilename(context): string
  static generateMusicFilename(context, start?, end?): string  
  static generateFinalVideoFilename(context, compression): string
  static generateThumbnailFilename(context, size, w, h): string
  static generateRawVideoFilename(context, planIndex): string
  
  // Utilitaires
  static extractSettingsFromDOM(): ProjectSettings
  static createContext(settings, cuts, duration): NamingContext
}
```

### **Intégration Composants** :

#### ✅ **ExportPanel.tsx** :
- Export JSON : `_project.json`
- Export Audio : `_music_trimmed_XXs-XXs_XXs.wav`

#### ✅ **FinalVideoExportPanel.tsx** :
- Vidéo finale : `_render_HD.mp4` / `_render_SD.mp4`
- Thumbnails : `_thumbnail_large_1080x1920.jpeg`

#### ✅ **SimpleThumbnailExporter.tsx** :
- Thumbnails standalone : `_thumbnail_large_XXXXxXXXX.jpeg`

#### ✅ **VideoExportPanel.tsx** :
- Vidéos individuelles : `_video1.mp4`, `_video2.mp4`, etc.
- Instructions : `_MONTAGE_INSTRUCTIONS.txt`

---

## 🎬 **Exemples de Projets Complets**

### **Projet Voyage de 13 secondes, 4 plans** :

#### **Fichiers Exportés** :
```
Travel_006_012_4_13s_project.json              ← Configuration Snapcut
Travel_006_012_4_13s_music_trimmed_11s-24s_13s.wav  ← Audio trimé
Travel_006_012_4_13s_render_HD.mp4             ← Vidéo finale HD  
Travel_006_012_4_13s_render_SD.mp4             ← Vidéo finale SD
Travel_006_012_4_13s_thumbnail_large_1080x1920.jpeg ← Thumb large
Travel_006_012_4_13s_thumbnail_small_540x960.jpeg   ← Thumb small
Travel_006_012_4_13s_video1.mp4               ← Plan 1 brut
Travel_006_012_4_13s_video2.mp4               ← Plan 2 brut  
Travel_006_012_4_13s_video3.mp4               ← Plan 3 brut
Travel_006_012_4_13s_video4.mp4               ← Plan 4 brut
Travel_006_012_4_13s_MONTAGE_INSTRUCTIONS.txt ← Guide montage
```

#### **Dans Snapcut App** :
- Le JSON référence : `"fileName": "Travel_006_012_4_13s_music_trimmed_11s-24s_13s.wav"`
- **Cohérence totale** entre tous les fichiers !

---

## 🔧 **Fonctionnement Intelligent**

### **Lecture Automatique des Champs** :
```typescript
// Le service lit automatiquement depuis l'interface :
const settings = FileNamingService.extractSettingsFromDOM();
// Résultat : { category: "Travel", templateNumber: "006", musicId: "012" }
```

### **Calcul Automatique** :
- **Plan Count** : Basé sur `cutMarkers.length + 1`
- **Duration** : Basé sur `endTime - startTime` 
- **Trim Points** : Ajoutés automatiquement pour l'audio

### **Fallback Sécurisé** :
Si les champs UI ne sont pas trouvés → Valeurs par défaut :
```typescript
{ category: 'Travel', templateNumber: '006', musicId: '012' }
```

---

## 🎉 **Avantages du Système**

### ✅ **Cohérence Parfaite** :
- **Même préfixe** pour tout un projet
- **Impossible** de se tromper de correspondances
- **Organisation claire** dans les dossiers

### ✅ **Traçabilité Complète** :
- **Category** : Type de contenu 
- **Template #** : Version du template
- **Music ID** : Référence audio
- **Plan Count** : Complexité du montage
- **Duration** : Durée finale

### ✅ **Import Snapcut Facilité** :
- **JSON** et **audio** ont les **mêmes références**
- **0 erreur** d'import dans l'app
- **Workflow professionnel**    

### ✅ **Gestion Multi-Projets** :
- **Tri naturel** par catégorie
- **Recherche facile** par template/music
- **Versions multiples** possibles

---

## 🚀 **Utilisation en Production**

### **Workflow Utilisateur Final** :
1. **Remplir les champs** : Category, Template #, Music ID
2. **Créer le projet** : Upload audio + cuts + thème  
3. **Exporter** → **Tous les fichiers suivent le même naming !**

### **Résultat Attendu** :
```
📁 Mon_Projet_Export/
  ├── Travel_006_012_4_13s_project.json
  ├── Travel_006_012_4_13s_music_trimmed_11s-24s_13s.wav  
  ├── Travel_006_012_4_13s_render_HD.mp4
  ├── Travel_006_012_4_13s_thumbnail_large_1080x1920.jpeg
  ├── Travel_006_012_4_13s_video1.mp4
  ├── Travel_006_012_4_13s_video2.mp4
  └── Travel_006_012_4_13s_MONTAGE_INSTRUCTIONS.txt
```

### **Import dans Snapcut** :
1. **Import JSON** → Application lit : `"Travel_006_012_4_13s_music_trimmed_11s-24s_13s.wav"`
2. **Chercher audio** → Nom **exact** correspondant dans le dossier  
3. **Import automatique** → **0 erreur !** ✅

---

## 🎯 **Le Système est Maintenant Complet !**

**Tous vos téléchargements utilisent la nomenclature unifié !** 🎊

- ✅ **JSON Templates** 
- ✅ **Audio Trimé** 
- ✅ **Vidéos Finales** 
- ✅ **Thumbnails**
- ✅ **Vidéos Brutes** 
- ✅ **Instructions**

**Votre workflow est maintenant de niveau professionnel avec une cohérence parfaite !** 🚀 