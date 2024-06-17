FROM node:18
WORKDIR /app

# Copie des fichiers de dépendances et installation
COPY package*.json ./
RUN npm install && npm install -g nodemon

# Copie du reste de l'application
COPY . .

# Exposition du port
EXPOSE 5000

# Utilisation de nodemon pour le hot reloading
CMD ["npx", "nodemon", "server.js"]