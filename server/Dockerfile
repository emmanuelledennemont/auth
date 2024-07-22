FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Installer ts-node globalement
RUN npm install -g ts-node

# Utiliser ts-node pour exécuter le fichier TypeScript
CMD ["ts-node", "-r", "tsconfig-paths/register", "src/start.ts"]
