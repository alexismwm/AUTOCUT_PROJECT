# Fichiers à mettre sur Git (minimal et prêt pour Vercel)

## À COMMIT (obligatoire)
- index.html
- src/**
- public/**
  - public/ffmpeg/.gitkeep (garder le dossier, sans les binaires)
- scripts/fetch-ffmpeg-core.mjs
- package.json
- package-lock.json
- vercel.json
- vite.config.ts
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- postcss.config.js
- tailwind.config.js
- eslint.config.js
- .gitignore
- README.md

## Optionnel (docs)
- Tous les .md de documentation (tu peux les garder ou les supprimer si tu veux un repo ultra-minimal)

## NE PAS COMMIT
- dist/**
- node_modules/**
- public/ffmpeg/ffmpeg-core.js
- public/ffmpeg/ffmpeg-core.wasm
- public/ffmpeg/ffmpeg-core.worker.js
- .DS_Store
- *.log
- .env*

## Notes
- Les fichiers ffmpeg lourds sont téléchargés automatiquement au build via:
  - postinstall/prebuild: scripts/fetch-ffmpeg-core.mjs public
  - postbuild: scripts/fetch-ffmpeg-core.mjs dist
- Sur Vercel, rien à uploader à la main: push le code, Vercel build et sert /ffmpeg/* depuis `dist/ffmpeg/`. 