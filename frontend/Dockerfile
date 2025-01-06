FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install react-scripts --save --legacy-peer-deps

COPY . .

CMD ["npm", "start"]