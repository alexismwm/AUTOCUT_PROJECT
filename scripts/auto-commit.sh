#!/bin/bash

# Script d'auto-commit pour AUTOCUT_PROJECT
# Usage: ./scripts/auto-commit.sh [message]

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Message de commit par défaut
DEFAULT_MESSAGE="feat: mise à jour automatique"
COMMIT_MESSAGE=${1:-$DEFAULT_MESSAGE}

echo -e "${BLUE}🚀 Auto-commit AUTOCUT_PROJECT${NC}"
echo -e "${YELLOW}Message: ${COMMIT_MESSAGE}${NC}"
echo ""

# Vérifier s'il y a des changements
if [[ -z $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Aucun changement détecté${NC}"
    exit 0
fi

# Ajouter tous les fichiers
echo -e "${BLUE}📁 Ajout des fichiers...${NC}"
git add .

# Vérifier le statut
echo -e "${BLUE}📊 Statut des changements:${NC}"
git status --short

# Commit
echo -e "${BLUE}💾 Commit des changements...${NC}"
if git commit -m "$COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Commit réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du commit${NC}"
    exit 1
fi

# Push
echo -e "${BLUE}🚀 Push vers le repository...${NC}"
if git push; then
    echo -e "${GREEN}✅ Push réussi${NC}"
    echo -e "${GREEN}🎉 Auto-commit terminé avec succès!${NC}"
else
    echo -e "${RED}❌ Erreur lors du push${NC}"
    exit 1
fi 