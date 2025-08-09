#!/bin/bash

# Script de déploiement rapide pour Vercel
# Usage: ./scripts/deploy-vercel.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement Vercel AUTOCUT_PROJECT${NC}"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet.${NC}"
    exit 1
fi

# Build du projet
echo -e "${BLUE}📦 Build du projet...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

# Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erreur: dossier dist non trouvé après le build${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Build terminé avec succès !${NC}"
echo ""
echo -e "${YELLOW}📋 Prochaines étapes :${NC}"
echo "1. Vercel devrait se redéployer automatiquement"
echo "2. Si ce n'est pas le cas, allez sur votre dashboard Vercel"
echo "3. Cliquez sur 'Redeploy' pour forcer un nouveau déploiement"
echo ""
echo -e "${BLUE}🔗 Dashboard Vercel : https://vercel.com/dashboard${NC}"
echo -e "${BLUE}📱 Votre site : https://autocut-project.vercel.app${NC}"
echo ""
echo -e "${GREEN}✅ Déploiement prêt !${NC}" 