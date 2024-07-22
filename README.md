# Techrevive

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Lancement du projet](#lancement-du-projet)
4. [Structure du projet](#structure-du-projet)
5. [Développement](#développement)
6. [Déploiement](#déploiement)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-nom-utilisateur/techrevive-admin.git
   cd techrevive-admin
   ```
2. Créez un fichier .env à la racine du projet et ajoutez les variables d'environnement nécessaires :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
MONGODB_URI=votre_uri_mongodb 3. Installez les dépendances :
```

```bash
npm install
```

## Lancement du projet

### Avec Docker

1. Construisez et lancez les conteneurs :

```bash
docker-compose up --build
```

2. Les services seront accessibles aux adresses suivantes :
   ▪ Interface administrateur : http://localhost:3000
   ▪ API : http://localhost:3001
   ▪ Base de données MongoDB : mongodb://localhost:27017
   En mode développement local 1. Lancez le serveur de développement pour l'interface administrateur :

```bash
cd admin
npm run dev
```

2. Dans un autre terminal, lancez l'API :

```bash
cd server
npm run dev
```

3. Les services seront accessibles aux adresses suivantes :

▪ Interface administrateur : http://localhost:3000
▪ API : http://localhost:3001
▪ Base de données MongoDB : dépend de votre configuration locale

## Structure du projet

• /admin : Contient le code du frontend Next.js pour l'interface administrateur
• /server : Contient le code du backend Express pour l'API
• /docker-compose.yml : Configuration Docker pour le projet

## Développement

• Pour le frontend (interface administrateur) :
▪ Modifiez les fichiers dans le dossier /admin
▪ Utilisez npm run dev dans le dossier /admin pour le développement local
• Pour le backend (API) :
▪ Modifiez les fichiers dans le dossier /server
▪ Utilisez npm run dev dans le dossier /server pour le développement local

## Déploiement
