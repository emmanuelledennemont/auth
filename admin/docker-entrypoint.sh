#!/bin/bash

# Installer les dépendances si elles ne sont pas déjà installées
if [ ! -d "node_modules" ]; then
  npm install
fi

# Démarrer l'application Next.js en mode développement
npm run dev
