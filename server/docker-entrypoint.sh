#!/bin/bash

# Installer les dépendances si elles ne sont pas déjà installées
if [ ! -d "node_modules" ]; then
  npm install
fi

# Utiliser nodemon pour exécuter le fichier TypeScript
nodemon --exec ts-node -r tsconfig-paths/register src/start.ts
