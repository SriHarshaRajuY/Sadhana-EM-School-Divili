FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install --omit=dev --workspace server
COPY --from=build /app/client/dist ./client/dist
COPY server ./server
EXPOSE 5000
CMD ["npm", "run", "start", "--workspace", "server"]
