FROM node:18-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app/node_modules/.cache && \
    chmod -R 777 /usr/src/app/node_modules/.cache && \
    chown -R node:node /usr/src/app
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]