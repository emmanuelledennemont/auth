FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Installer nodemon globalement
RUN npm install -g nodemon

# Utiliser nodemon pour exécuter le fichier TypeScript
CMD ["nodemon", "--exec", "ts-node", "-r", "tsconfig-paths/register", "src/start.ts"]
