# ---- Dev stage (ts-node-dev with auto-reload) ----
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
COPY public ./public
CMD ["npm", "run", "dev"]

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

# Compiled JS (includes dist/index.js and dist/seed.js).
COPY --from=build /app/dist ./dist

# Static files and EJS views are not compiled - copy from source.
COPY public ./public
COPY src/backoffice/views/admin ./dist/backoffice/views/admin

EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
