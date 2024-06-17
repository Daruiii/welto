FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY testMongoConnection.js .

EXPOSE 5000
CMD ["node", "server.js"]